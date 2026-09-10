import { interpolate, type SharedValue } from 'react-native-reanimated';
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
  height: number,
  translationX: SharedValue<number>,
  translationY: SharedValue<number>
): ViewStyle => {
  'worklet';

  const preset =
    exiting || gestureActive.value ? exitingPreset : enteringPreset;

  if (preset === 'zoom') {
    return {
      opacity: progress.value,
      transform: [{ scale: interpolate(progress.value, [0, 1], [0.92, 1]) }],
    };
  }

  if (preset === 'slideFree') {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
      ],
    };
  }

  if (preset === 'slideLeft' || preset === 'slideRight') {
    const distance = preset === 'slideLeft' ? -width : width;

    return {
      transform: [
        { translateX: interpolate(progress.value, [0, 1], [distance, 0]) },
      ],
    };
  }

  if (preset === 'slideTop' || preset === 'slideBottom') {
    const distance = preset === 'slideTop' ? -height : height;

    return {
      transform: [
        { translateY: interpolate(progress.value, [0, 1], [distance, 0]) },
      ],
    };
  }

  return { opacity: progress.value };
};
