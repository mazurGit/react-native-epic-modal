import type { ModalEntry } from '../modal-entry';

type Listener = () => void;

type StoredEntry = ModalEntry & {
  visible: boolean;
  presentationOrder: number;
};

/** External store responsible for the modal collection and its ordering. */
export class ModalManager {
  private static instance: ModalManager | undefined;

  private readonly entries = new Map<string, StoredEntry>();
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

  register = (entry: ModalEntry) => {
    const storedEntry: StoredEntry = {
      ...entry,
      visible: false,
      presentationOrder: 0,
    };
    this.entries.set(entry.id, storedEntry);
    this.updateSnapshot();

    return () => {
      if (this.entries.get(entry.id) !== storedEntry) return;
      this.entries.delete(entry.id);
      this.updateSnapshot();
    };
  };

  present = (id: string) => {
    const entry = this.entries.get(id);
    if (!entry || entry.visible) return;

    entry.visible = true;
    entry.presentationOrder = this.nextPresentationOrder++;
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
          (b.priority ?? 0) - (a.priority ?? 0) ||
          b.presentationOrder - a.presentationOrder
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
