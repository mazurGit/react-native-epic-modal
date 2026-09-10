import { createContext } from 'react';
import type { ReactElement } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { SharedElementTransitionProps } from '../components/shared-element/types';
import type { SharedElementProps } from '../components/shared-element/shared-element';

export interface ModalTransitionDescriptor
  extends SharedElementTransitionProps {
  key: string;
  progress: SharedValue<number>;
}

export interface ModalMeasurementDescriptor extends SharedElementProps {
  key: string;
  children: ReactElement;
}

export interface ModalTransitionContextValue {
  register: (transition: ModalTransitionDescriptor) => void;
  unregister: (key: string) => void;
  registerMeasurement: (measurement: ModalMeasurementDescriptor) => void;
  unregisterMeasurement: (key: string) => void;
}

export const ModalTransitionContext =
  createContext<ModalTransitionContextValue | null>(null);
