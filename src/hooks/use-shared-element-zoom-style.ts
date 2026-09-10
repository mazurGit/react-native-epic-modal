import {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import type { SharedElementRect } from '../components/shared-element/types';

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

    return {
      opacity: interpolate(progress.value, [0, 0.001, 0.999, 1], [0, 1, 1, 0]),
      left: interpolate(
        progress.value,
        [0, 1],
        [startRect.x, endRect.x + (endRect.width - startRect.width) / 2]
      ),
      top: interpolate(
        progress.value,
        [0, 1],
        [startRect.y, endRect.y + (endRect.height - startRect.height) / 2]
      ),
      width: startRect.width,
      height: startRect.height,
      transform: [
        {
          scaleX: interpolate(
            progress.value,
            [0, 1],
            [1, endRect.width / startRect.width]
          ),
        },
        {
          scaleY: interpolate(
            progress.value,
            [0, 1],
            [1, endRect.height / startRect.height]
          ),
        },
      ],
    };
  }, [revision]);
}
