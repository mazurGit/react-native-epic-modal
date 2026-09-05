import type { WithSpringConfig } from 'react-native-reanimated';
import type { IGestureConfig } from './types';

export const DEFAULT_ANIMATION_CONFIG: WithSpringConfig = {
  damping: 100,
  stiffness: 500,
};

export const DEFAULT_GESTURE_CONFIG: Required<IGestureConfig> = {
  edgeTarget: 'screen',
  leftGestureAreaOffset: 50,
  topGestureAreaOffset: 200,
  swipeVelocityThreshold: 800,
  swipeProgressToClose: `0.6`,
};
