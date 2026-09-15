import {
  Extrapolation,
  interpolate,
  type SharedValue,
} from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import type {
  ModalEnteringAnimationPreset,
  ModalExitingAnimationPreset,
} from './modal-animation';

export const getModalAnimationStyle = (
  progress: SharedValue<number>,
  enteringPreset: ModalEnteringAnimationPreset,
  exitingPreset: ModalExitingAnimationPreset,
  exiting: boolean,
  gestureActive: SharedValue<boolean>,
  width: number,
  height: number
): ViewStyle => {
  'worklet';

  const upper_bound = 0.95;

  const preset =
    exiting || gestureActive.value ? exitingPreset : enteringPreset;

  if (preset === 'zoom') {
    return {
      opacity: progress.value,
      transform: [
        {
          scale: interpolate(
            progress.value,
            [0, upper_bound],
            [0.92, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  }

  if (preset === 'slideLeft' || preset === 'slideRight') {
    const distance = preset === 'slideLeft' ? -width : width;

    return {
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, upper_bound],
            [distance, 0],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  }

  if (preset === 'slideTop' || preset === 'slideBottom') {
    const distance = preset === 'slideTop' ? -height : height;

    return {
      transform: [
        {
          translateY: interpolate(
            progress.value,
            [0, upper_bound],
            [distance, 0],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  }

  return { opacity: progress.value };
};
