import type { SpringConfig } from 'react-native-reanimated/lib/typescript/animation/springUtils';
import type { IGestureConfig } from './types';

export const DEFAULT_ANIMATION_CONFIG: SpringConfig = {
  damping: 75,
  stiffness: 500,
};

export const DEFAULT_GESTURE_CONFIG: Required<IGestureConfig> = {
  leftGestureAreaOffset: 50,
  topGestureAreaOffset: 200,
  swipeVelocityThreshold: 800,
  swipeProgressToClose: `0.6`,
};
