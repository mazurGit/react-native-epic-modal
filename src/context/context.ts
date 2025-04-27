import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { IModalComponent } from '../components/components';

export const ModalStateProvider = createContext<IModalComponent[]>([]);
export const ModalSetStateProvider = createContext<Dispatch<
  SetStateAction<IModalComponent[]>
> | null>(null);
