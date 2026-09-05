import { interpolate, type SharedValue } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import type { TAnimation, TDirection } from './types';

export const getAnimationConfig = (
  progress: SharedValue<number>,
  direction: TDirection,
  width: number,
  height: number
): Record<TAnimation, ViewStyle> => {
  'worklet';

  const isHorizontalDirection = direction === 'horizontal';
  return {
    zoom: {
      transform: [{ scale: progress.value }],
      opacity: progress.value,
    },
    slide: {
      transform: [
        isHorizontalDirection
          ? {
              translateX: interpolate(progress.value, [0, 1], [width, 0]),
            }
          : {
              translateY: interpolate(progress.value, [0, 1], [height, 0]),
            },
      ],
    },
    fade: {
      opacity: progress.value,
    },
  };
};
