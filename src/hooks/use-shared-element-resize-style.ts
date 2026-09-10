import {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import type { SharedElementRect } from '../components/shared-element/types';

export function useSharedElementResizeStyle(
  progress: SharedValue<number>,
  start: SharedValue<SharedElementRect | null> | undefined,
  end: SharedValue<SharedElementRect | null> | undefined,
  revision: number
) {
  return useAnimatedStyle(() => {
    const startRect = start?.value;
    const endRect = end?.value;

    if (!startRect || !endRect) return { opacity: 0 };

    return {
      opacity: interpolate(progress.value, [0, 0.001, 0.999, 1], [0, 1, 1, 0]),
      left: interpolate(progress.value, [0, 1], [startRect.x, endRect.x]),
      top: interpolate(progress.value, [0, 1], [startRect.y, endRect.y]),
      width: interpolate(
        progress.value,
        [0, 1],
        [startRect.width, endRect.width]
      ),
      height: interpolate(
        progress.value,
        [0, 1],
        [startRect.height, endRect.height]
      ),
    };
  }, [revision]);
}
