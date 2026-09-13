import { createContext } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { SharedElementTransitionProps } from 'react-native-epic-shared-element';

export type ModalTransitionDescriptor = Omit<
  SharedElementTransitionProps,
  'progress'
> & {
  key: string;
  progress: SharedValue<number>;
};

export interface ModalTransitionContextValue {
  register: (transition: ModalTransitionDescriptor) => void;
  unregister: (key: string) => void;
}

export const ModalTransitionContext =
  createContext<ModalTransitionContextValue | null>(null);
