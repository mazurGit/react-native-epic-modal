import { useEffect, type DependencyList } from 'react';
import { BackHandler, Platform } from 'react-native';

export const useAndroidBackHandler = (
  onBackPress: () => boolean,
  deps?: DependencyList
) => {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    return () => subscription.remove();
    // The hook caller may provide additional values used by its callback.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are supplied by the hook caller.
  }, [onBackPress, ...(deps ?? [])]);
};
