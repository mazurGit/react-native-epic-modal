import type { ReactNode } from 'react';
import type {
  ModalEntry,
  ModalEntryUpdate,
  PersistedModalState,
} from '../modal-entry';

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

  serialize = (): PersistedModalState => ({
    version: 1,
    entries: [...this.entries.values()]
      .filter((entry) => entry.visible)
      .map(({ visible: _visible, ...entry }) => entry),
  });

  hydrate = (state: PersistedModalState) => {
    if (state.version !== 1) return;

    this.entries.clear();
    state.entries.forEach((entry) => {
      const { presentationOrder, ...modalEntry } = entry;
      this.entries.set(entry.id, {
        ...modalEntry,
        visible: true,
        presentationOrder,
      });
      this.nextPresentationOrder = Math.max(
        this.nextPresentationOrder,
        presentationOrder + 1
      );
    });
    this.updateSnapshot();
  };

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

  update = (id: string, changes: ModalEntryUpdate) => {
    const entry = this.entries.get(id);
    if (!entry) return;

    Object.assign(entry, changes);
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
      .sort(
        (a, b) =>
          (a.priority ?? 0) - (b.priority ?? 0) ||
          a.presentationOrder - b.presentationOrder
      )
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
