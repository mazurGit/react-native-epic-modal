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
  duration: number;
  onExitComplete?: () => void;
};

export const useModalAnimation = ({
  exiting,
  enabled,
  duration,
  onExitComplete,
}: UseModalAnimationOptions): SharedValue<number> => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!enabled) {
      progress.value = 0;
      return;
    }

    progress.value = withTiming(exiting ? 0 : 1, { duration }, (finished) => {
      if (finished && exiting && onExitComplete) {
        scheduleOnRN(onExitComplete);
      }
    });
  }, [duration, enabled, exiting, onExitComplete, progress]);

  return progress;
};
