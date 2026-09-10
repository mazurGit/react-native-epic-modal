import type { SharedValue } from 'react-native-reanimated';

export interface SharedElementRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SharedElementNode {
  id: string;
  measurementOnly: boolean;
  rect: SharedValue<SharedElementRect | null>;
  visibility: SharedValue<number>;
}
