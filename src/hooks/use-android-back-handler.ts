import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import type { DependencyList } from 'react-native-reanimated/lib/typescript/hook';

export const useAndroidBackHandler = (
  onBackPress: () => boolean,
  deps?: DependencyList
) => {
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    return () => subscription.remove();
    // eslint-disable-next-line
      }, deps);
};
