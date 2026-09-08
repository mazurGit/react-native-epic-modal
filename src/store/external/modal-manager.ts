import type { ReactNode } from 'react';
import type { ModalEntry } from '../modal-entry';

type Listener = () => void;

type ModalRegistration = {
  id: string;
  render: () => ReactNode;
};

type StoredEntry = ModalEntry & {
  visible: boolean;
  presentationOrder: number;
};

/** External store responsible for the modal collection and its ordering. */
export class ModalManager {
  private static instance: ModalManager | undefined;

  private readonly entries = new Map<string, StoredEntry>();
  private readonly renderers = new Map<string, () => ReactNode>();
  private readonly listeners = new Set<Listener>();
  private nextPresentationOrder = 0;
  private snapshot: readonly ModalEntry[] = [];

  private constructor() {}

  static getInstance() {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager();
    }

    return ModalManager.instance;
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.snapshot;

  getRenderer = (id: string) => this.renderers.get(id);

  register = (registration: ModalRegistration) => {
    this.renderers.set(registration.id, registration.render);
    this.updateSnapshot();

    return () => this.unregister(registration.id, registration.render);
  };

  unregister = (id: string, render?: () => ReactNode) => {
    if (render && this.renderers.get(id) !== render) return;

    const rendererRemoved = this.renderers.delete(id);
    const entryRemoved = this.entries.delete(id);
    if (rendererRemoved || entryRemoved) this.updateSnapshot();
  };

  present = (entry: ModalEntry) => {
    const existingEntry = this.entries.get(entry.id);
    const storedEntry: StoredEntry = existingEntry ?? {
      ...entry,
      visible: false,
      presentationOrder: 0,
    };
    Object.assign(storedEntry, entry, {
      visible: true,
      presentationOrder: this.nextPresentationOrder++,
    });
    this.entries.set(entry.id, storedEntry);
    this.updateSnapshot();
  };

  notify = (id: string) => {
    if (!this.entries.has(id) && !this.renderers.has(id)) return;
    this.updateSnapshot();
  };

  dismiss = (id: string) => {
    const entry = this.entries.get(id);
    if (!entry || !entry.visible) return;

    entry.visible = false;
    this.updateSnapshot();
  };

  clear = () => {
    if (this.entries.size === 0) return;
    this.entries.clear();
    this.updateSnapshot();
  };

  private updateSnapshot() {
    this.snapshot = [...this.entries.values()]
      .filter((entry) => entry.visible)
      .sort((a, b) => a.presentationOrder - b.presentationOrder)
      .map(
        ({
          visible: _visible,
          presentationOrder: _presentationOrder,
          ...entry
        }) => entry
      );

    this.listeners.forEach((listener) => listener());
  }
}

export const modalManager = ModalManager.getInstance();
