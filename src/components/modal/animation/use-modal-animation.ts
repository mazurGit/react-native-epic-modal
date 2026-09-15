import { useEffect } from 'react';
import {
  ReduceMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

type UseModalAnimationOptions = {
  exiting: boolean;
  enabled: boolean;
  hidden?: boolean;
  visible?: boolean;
  duration: number;
  onExitComplete?: () => void;
  onAnimationComplete?: () => void;
};

export const useModalAnimation = ({
  exiting,
  enabled,
  hidden = false,
  visible = true,
  duration,
  onExitComplete,
  onAnimationComplete,
}: UseModalAnimationOptions): SharedValue<number> => {
  const progress = useSharedValue(
    !enabled && visible && !hidden && !exiting ? 1 : 0
  );

  useEffect(() => {
    // Measurement must keep the transition at its source endpoint.
    if (!exiting && (hidden || !visible)) {
      progress.value = 0;
      onAnimationComplete?.();
      return;
    }

    if (!enabled) {
      progress.value = exiting ? 0 : 1;
      onAnimationComplete?.();
      if (exiting) onExitComplete?.();
      return;
    }

    progress.value = withTiming(
      exiting ? 0 : 1,
      { duration, reduceMotion: ReduceMotion.Never },
      (finished) => {
        if (!finished) return;
        if (onAnimationComplete) scheduleOnRN(onAnimationComplete);
        if (exiting && onExitComplete) scheduleOnRN(onExitComplete);
      }
    );
  }, [
    duration,
    enabled,
    exiting,
    hidden,
    visible,
    onAnimationComplete,
    onExitComplete,
    progress,
  ]);

  return progress;
};
