import { useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { ModalProgressContext } from '../../context/modal-progress-context';
import {
  DEFAULT_MODAL_ANIMATION,
  type ModalAnimationConfig,
} from './modal-animation';
import { getModalAnimationStyle } from './modal-animation-utils';
import { useModalAnimation } from './use-modal-animation';

export type ModalViewProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
  animation?: ModalAnimationConfig;
  exiting?: boolean;
  onExitComplete?: () => void;
}>;

/** Modal surface. Its progress is shared with modal content and future gestures. */
export const ModalView = ({
  children,
  style,
  backdropStyle,
  animation,
  exiting = false,
  onExitComplete,
}: ModalViewProps) => {
  const resolvedAnimation = useMemo(
    () => ({ ...DEFAULT_MODAL_ANIMATION, ...animation }),
    [animation]
  );
  const progress = useModalAnimation({
    duration: resolvedAnimation.duration,
    exiting,
    onExitComplete,
  });

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() =>
    getModalAnimationStyle(
      progress,
      exiting ? resolvedAnimation.exiting : resolvedAnimation.entering
    )
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.backdrop, backdropStyle, backdropAnimatedStyle]}
      />
      <ModalProgressContext.Provider value={progress}>
        <Animated.View style={[styles.content, style, contentAnimatedStyle]}>
          {children}
        </Animated.View>
      </ModalProgressContext.Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  content: {
    zIndex: 1,
  },
});
