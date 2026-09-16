import { createContext } from 'react';
import type { SharedElementTransitionDescriptor } from 'react-native-epic-shared-element';

export type ModalTransitionDescriptor = SharedElementTransitionDescriptor;

export interface ModalTransitionContextValue {
  register: (transition: ModalTransitionDescriptor) => void;
  unregister: (key: string) => void;
}

export const ModalTransitionContext =
  createContext<ModalTransitionContextValue | null>(null);
