import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import type { SharedElementRect } from '../components/shared-element/types';

const progress_bounds = [0.05, 0.95];

export function useSharedElementZoomStyle(
  progress: SharedValue<number>,
  start: SharedValue<SharedElementRect | null> | undefined,
  end: SharedValue<SharedElementRect | null> | undefined,
  revision: number
) {
  return useAnimatedStyle(() => {
    const startRect = start?.value;
    const endRect = end?.value;

    if (!startRect || !endRect) return { opacity: 0 };

    const scale = endRect.height / startRect.height;

    return {
      opacity: interpolate(
        progress.value,
        [0, 0.001, 0.999, 1],
        [0, 1, 1, 0],
        Extrapolation.CLAMP
      ),
      left: interpolate(
        progress.value,
        progress_bounds,
        [startRect.x, endRect.x],
        Extrapolation.CLAMP
      ),
      top: interpolate(
        progress.value,
        progress_bounds,
        [startRect.y, endRect.y],
        Extrapolation.CLAMP
      ),
      width: startRect.width,
      height: startRect.height,
      transformOrigin: 'top left',
      transform: [
        {
          scale: interpolate(
            progress.value,
            progress_bounds,
            [1, scale],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  }, [revision]);
}
