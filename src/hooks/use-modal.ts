import { useCallback, useContext } from 'react';
import type { IModalComponent } from '../components/modal/types';
import { ModalSetStateProvider } from '../context/context';

export const upsertModal = (
  state: IModalComponent[],
  modal: IModalComponent
) => {
  const index = state.findIndex((item) => item.id === modal.id);
  if (index === -1) return [...state, modal];

  const nextState = [...state];
  nextState[index] = modal;
  return nextState;
};

export const removeModalById = (state: IModalComponent[], id: string) => {
  const index = state.findIndex((item) => item.id === id);
  if (index === -1) return state;

  return [...state.slice(0, index), ...state.slice(index + 1)];
};

export const useModal = () => {
  const setState = useContext(ModalSetStateProvider);
  if (!setState) {
    throw new Error("[ModalSetStateProvider] - context can't be null");
  }

  const addUpdateModal = useCallback(
    (modal: IModalComponent) => {
      setState((prev) => upsertModal(prev, modal));
    },
    [setState]
  );

  const removeModal = useCallback(
    (id: string) => {
      setState((prev) => removeModalById(prev, id));
    },
    [setState]
  );

  return { addUpdateModal, removeModal };
};
