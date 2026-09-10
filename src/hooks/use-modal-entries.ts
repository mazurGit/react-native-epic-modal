import { useSyncExternalStore } from 'react';
import { ModalManager } from '../store/modal-manager';

/** Subscribes a React component to registered modal entries. */
export const useModalEntries = (
  manager: ModalManager = ModalManager.getInstance()
) =>
  useSyncExternalStore(
    manager.subscribe,
    manager.getSnapshot,
    manager.getSnapshot
  );
