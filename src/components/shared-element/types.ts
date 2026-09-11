import type { ReactElement } from 'react';
import type { SharedValue } from 'react-native-reanimated';

export interface SharedElementRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SharedElementNode {
  id: string;
  rect: SharedValue<SharedElementRect | null>;
  visibility: SharedValue<number>;
}

export interface SharedElementTransitionProps {
  startId: string;
  endId: string;
  children?: ReactElement;
  clip?: boolean;
  mode?: 'resize' | 'zoom';
}

export type SharedElementTransitionConfig = Omit<
  SharedElementTransitionProps,
  'children'
> & {
  key: string;
  element?: ReactElement;
};
