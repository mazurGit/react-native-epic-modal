import { useCallback, useContext } from 'react';
import type {
  IModalComponent,
  IModalRegistry,
} from '../components/modal/types';
import { ModalSetStateProvider } from '../context/context';

export const registerModalById = (
  state: IModalRegistry,
  modal: IModalComponent
) => {
  if (state.byId[modal.id]) {
    return { ...state, byId: { ...state.byId, [modal.id]: modal } };
  }

  return {
    byId: { ...state.byId, [modal.id]: modal },
    order: [...state.order, modal.id],
  };
};

export const removeModalById = (state: IModalRegistry, id: string) => {
  if (!state.byId[id]) return state;

  const byId = { ...state.byId };
  delete byId[id];
  return {
    byId,
    order: state.order.filter((itemId) => itemId !== id),
  };
};

export const updateModalById = (
  state: IModalRegistry,
  id: string,
  props: IModalComponent['props']
) => {
  const current = state.byId[id];
  if (!current) return state;

  return {
    ...state,
    byId: { ...state.byId, [id]: { ...current, props } },
  };
};

export const useModal = () => {
  const setState = useContext(ModalSetStateProvider);
  if (!setState) {
    throw new Error("[ModalSetStateProvider] - context can't be null");
  }

  const registerModal = useCallback(
    (modal: IModalComponent) => {
      setState((prev) => registerModalById(prev, modal));
    },
    [setState]
  );

  const updateModal = useCallback(
    (id: string, props: IModalComponent['props']) => {
      setState((prev) => updateModalById(prev, id, props));
    },
    [setState]
  );

  const removeModal = useCallback(
    (id: string) => {
      setState((prev) => removeModalById(prev, id));
    },
    [setState]
  );

  return { registerModal, updateModal, removeModal };
};
