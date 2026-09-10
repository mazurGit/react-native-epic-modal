import {
  requireNativeComponent,
  type NativeSyntheticEvent,
  type ViewProps,
} from 'react-native';
import type { SharedElementRect } from '../components/shared-element/types';

export interface NativeSharedElementProps extends ViewProps {
  ancestorTag?: number;
  throttle?: number;
  trackFrame?: boolean;
  onFrame?: (event: NativeSyntheticEvent<SharedElementRect>) => void;
}

export const NativeSharedElement =
  requireNativeComponent<NativeSharedElementProps>('EpicSharedElementView');
