import { useSyncExternalStore } from 'react';
import { ModalManager } from '../external/modal-manager';

/** Subscribes a React component to the visible modal entries. */
export const useModalEntries = (
  manager: ModalManager = ModalManager.getInstance()
) =>
  useSyncExternalStore(
    manager.subscribe,
    manager.getSnapshot,
    manager.getSnapshot
  );
