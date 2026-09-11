import { createContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { SharedElementTransitionProps } from '../components/shared-element/types';

export interface ModalTransitionDescriptor
  extends SharedElementTransitionProps {
  key: string;
  progress: SharedValue<number>;
}

export interface ModalTransitionContextValue {
  register: (transition: ModalTransitionDescriptor) => void;
  unregister: (key: string) => void;
}

export const ModalTransitionContext =
  createContext<ModalTransitionContextValue | null>(null);
