import { useEffect } from 'react';
import {
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
};

export const useModalAnimation = ({
  exiting,
  enabled,
  hidden = false,
  visible = true,
  duration,
  onExitComplete,
}: UseModalAnimationOptions): SharedValue<number> => {
  const progress = useSharedValue(
    !enabled && visible && !hidden && !exiting ? 1 : 0
  );

  useEffect(() => {
    // Measurement must keep the transition at its source endpoint.
    if (!exiting && (hidden || !visible)) {
      progress.value = 0;
      return;
    }

    if (!enabled) {
      progress.value = exiting ? 0 : 1;
      if (exiting) onExitComplete?.();
      return;
    }

    progress.value = withTiming(exiting ? 0 : 1, { duration }, (finished) => {
      if (finished && exiting && onExitComplete) {
        scheduleOnRN(onExitComplete);
      }
    });
  }, [duration, enabled, exiting, hidden, visible, onExitComplete, progress]);

  return progress;
};
