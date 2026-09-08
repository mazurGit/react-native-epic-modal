import { useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { ModalProgressContext } from '../../context/modal-progress-context';
import {
  DEFAULT_MODAL_ANIMATION,
  type ModalAnimationConfig,
} from './modal-animation';
import { getModalAnimationStyle } from './modal-animation-utils';
import type { ModalGestureConfig } from './modal-gesture';
import { useModalAnimation } from './use-modal-animation';
import { useModalGesture } from './use-modal-gesture';

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
  const resolvedAnimation = useMemo(
    () => ({ ...DEFAULT_MODAL_ANIMATION, ...animation }),
    [animation]
  );
  const progress = useModalAnimation({
    duration: resolvedAnimation.duration,
    exiting,
    onExitComplete,
  });
  const gesture = useModalGesture({
    config: gestureConfig,
    onDismissRequest: onDismissRequest ?? (() => undefined),
    progress,
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

  const immersive = gestureConfig?.immersive ?? false;
  const backdrop = (
    <Animated.View
      pointerEvents={immersive ? 'auto' : 'none'}
      style={[styles.backdrop, backdropStyle, backdropAnimatedStyle]}
    />
  );
  const content = (
    <ModalProgressContext.Provider value={progress}>
      <Animated.View style={[styles.content, style, contentAnimatedStyle]}>
        {children}
      </Animated.View>
    </ModalProgressContext.Provider>
  );

  return (
    <View style={styles.container}>
      {immersive ? (
        <>
          <GestureDetector gesture={gesture}>{backdrop}</GestureDetector>
          {content}
        </>
      ) : (
        <GestureDetector gesture={gesture}>
          <View style={styles.gestureSurface}>
            {backdrop}
            {content}
          </View>
        </GestureDetector>
      )}
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
  gestureSurface: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
