import { useCallback, useContext } from 'react';
import type { IModalComponent } from '../components/modal/types';
import { ModalSetStateProvider } from '../context/context';

export const useModal = () => {
  const setState = useContext(ModalSetStateProvider);
  if (!setState) {
    throw new Error("[ModalSetStateProvider] - context can't be null");
  }

  const addUpdateModal = useCallback(
    (modal: IModalComponent) => {
      setState((prev) => {
        const stateClone = [...prev];
        const currentIndex = stateClone.findIndex(
          (item) => item.id === modal.id
        );

        if (currentIndex !== -1) {
          stateClone[currentIndex] = modal;
        } else {
          stateClone.push(modal);
        }
        return stateClone;
      });
    },
    [setState]
  );

  const removeModal = useCallback(
    (id: string) => {
      setState((prev) => {
        const index = prev.findIndex((item) => item.id === id);
        if (index === -1) {
          return prev;
        }
        const newState = [...prev.slice(0, index), ...prev.slice(index + 1)];
        return newState;
      });
    },
    [setState]
  );

  return { addUpdateModal, removeModal };
};
