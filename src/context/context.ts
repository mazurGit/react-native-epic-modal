import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { IModalComponent } from '../components/components';

export interface ModalBackHandlerContextValue {
  register: (
    id: string,
    priority: number,
    handler: () => boolean
  ) => () => void;
}

export const ModalStateProvider = createContext<IModalComponent[]>([]);
export const ModalSetStateProvider = createContext<Dispatch<
  SetStateAction<IModalComponent[]>
> | null>(null);
export const ModalBackHandlerProvider =
  createContext<ModalBackHandlerContextValue | null>(null);
