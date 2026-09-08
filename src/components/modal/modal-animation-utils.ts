import { interpolate, type SharedValue } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import type { ModalAnimationPreset } from './modal-animation';

export const getModalAnimationStyle = (
  progress: SharedValue<number>,
  preset: ModalAnimationPreset
): ViewStyle => {
  'worklet';

  if (preset === 'zoom') {
    return {
      opacity: progress.value,
      transform: [{ scale: interpolate(progress.value, [0, 1], [0.92, 1]) }],
    };
  }

  return { opacity: progress.value };
};
