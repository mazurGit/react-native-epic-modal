import { useCallback, useMemo, type PropsWithChildren } from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { ModalProgressContext } from '../../context/modal-progress-context';
import {
  DEFAULT_MODAL_ANIMATION,
  type ModalAnimationConfig,
} from './animation/modal-animation';
import { getModalAnimationStyle } from './animation/modal-animation-utils';
import type { ModalGestureConfig } from './gesture/modal-gesture';
import { resolveModalGestureConfig } from './gesture/modal-gesture';
import { useModalAnimation } from './animation/use-modal-animation';
import { useModalGesture } from './gesture/use-modal-gesture';

export type ModalViewProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
  animation?: ModalAnimationConfig;
  gestureConfig?: ModalGestureConfig;
  exiting?: boolean;
  onExitComplete?: () => void;
  onDismissRequest?: () => void;
}>;

/** Modal surface. Its progress is shared with modal content and future gestures. */
export const ModalView = ({
  children,
  style,
  backdropStyle,
  animation,
  gestureConfig,
  exiting = false,
  onExitComplete,
  onDismissRequest,
}: ModalViewProps) => {
  const { width, height } = useWindowDimensions();
  const resolvedAnimation = useMemo(
    () => ({ ...DEFAULT_MODAL_ANIMATION, ...animation }),
    [animation]
  );
  const resolvedGesture = useMemo(
    () => resolveModalGestureConfig(gestureConfig),
    [gestureConfig]
  );
  const progress = useModalAnimation({
    duration: resolvedAnimation.duration,
    exiting,
    onExitComplete,
  });
  const {
    gesture: gestureHandler,
    gestureActive,
    translationX,
    translationY,
  } = useModalGesture({
    config: resolvedGesture,
    onDismissRequest: onDismissRequest,
    progress,
  });

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() =>
    getModalAnimationStyle(
      progress,
      resolvedAnimation.entering,
      resolvedAnimation.exiting,
      exiting,
      gestureActive,
      width,
      height,
      translationX,
      translationY
    )
  );

  const Content = useCallback(
    () => (
      <ModalProgressContext.Provider value={progress}>
        <Animated.View style={[styles.content, style, contentAnimatedStyle]}>
          {children}
        </Animated.View>
      </ModalProgressContext.Provider>
    ),
    [children, contentAnimatedStyle, progress, style]
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      <GestureDetector gesture={gestureHandler}>
        <View style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[styles.backdrop, backdropStyle, backdropAnimatedStyle]}
          />
          <Content />
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  content: {
    zIndex: 1,
  },
});
