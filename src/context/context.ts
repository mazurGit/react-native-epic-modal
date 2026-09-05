import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { IModalRegistry } from '../components/modal/types';

export interface ModalBackHandlerContextValue {
  register: (
    id: string,
    priority: number,
    handler: () => boolean
  ) => () => void;
}

export const ModalStateProvider = createContext<IModalRegistry>({
  byId: {},
  order: [],
});
export const ModalSetStateProvider = createContext<Dispatch<
  SetStateAction<IModalRegistry>
> | null>(null);
export const ModalBackHandlerProvider =
  createContext<ModalBackHandlerContextValue | null>(null);
