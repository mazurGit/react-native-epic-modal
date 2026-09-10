import type { RefObject } from 'react';
import type {
  ModalBridgeProps,
  ModalRef,
} from '../components/modal-bridge/modal-bridge';

type Listener = () => void;

export type StoredModalEntry = {
  id: string;
  props: ModalBridgeProps;
  ref: RefObject<ModalRef | null>;
  presentationOrder: number;
};

type ModalRegistration = Pick<StoredModalEntry, 'id' | 'props' | 'ref'>;

/** External store responsible for the modal collection and its ordering. */
export class ModalManager {
  private static instance: ModalManager | undefined;

  private readonly entries = new Map<string, StoredModalEntry>();
  private readonly listeners = new Set<Listener>();
  private nextPresentationOrder = 0;
  private snapshot: readonly StoredModalEntry[] = [];

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

  register = (registration: ModalRegistration) => {
    const existingEntry = this.entries.get(registration.id);
    this.entries.set(registration.id, {
      ...(existingEntry ?? { id: registration.id, presentationOrder: 0 }),
      ...registration,
    });
    this.updateSnapshot();

    return () => this.unregister(registration.id, registration.ref);
  };

  unregister = (id: string, ref?: RefObject<ModalRef | null>) => {
    if (ref && this.entries.get(id)?.ref !== ref) return;

    if (this.entries.delete(id)) this.updateSnapshot();
  };

  present = (id: string) => {
    const entry = this.entries.get(id);
    if (!entry) return;
    entry.presentationOrder = this.nextPresentationOrder++;
    this.updateSnapshot();
  };

  clear = () => {
    if (this.entries.size === 0) return;
    this.entries.clear();
    this.updateSnapshot();
  };

  private updateSnapshot() {
    this.snapshot = [...this.entries.values()].sort(
      (a, b) => a.presentationOrder - b.presentationOrder
    );

    this.listeners.forEach((listener) => listener());
  }
}

export const modalManager = ModalManager.getInstance();
