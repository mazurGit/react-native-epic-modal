import { useMemo, type PropsWithChildren } from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
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
import { ModalTransitionLayer } from './modal-transition-layer';
import { SharedElementHost } from '../shared-element/shared-element-host';

export type ModalViewProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
  animation?: ModalAnimationConfig;
  gestureConfig?: ModalGestureConfig;
  visible?: boolean;
  exiting?: boolean;
  onExitComplete?: () => void;
  onDismissRequest?: () => void;
  hidden?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
}>;

/** Modal surface. Its progress is shared with modal content and future gestures. */
export const ModalView = ({
  children,
  style,
  backdropStyle,
  animation,
  gestureConfig,
  visible = true,
  exiting = false,
  onExitComplete,
  onDismissRequest,
  hidden = false,
  onLayout,
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
    enabled: visible || exiting,
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

  return (
    <View
      accessibilityElementsHidden={hidden}
      importantForAccessibility={hidden ? 'no-hide-descendants' : 'auto'}
      pointerEvents={hidden ? 'none' : 'auto'}
      style={[StyleSheet.absoluteFill, hidden && styles.hidden]}
    >
      <GestureDetector gesture={gestureHandler}>
        <SharedElementHost
          pointerEvents={hidden ? 'none' : 'auto'}
          style={StyleSheet.absoluteFill}
        >
          <View style={StyleSheet.absoluteFill}>
            <Animated.View
              style={[styles.backdrop, backdropStyle, backdropAnimatedStyle]}
            />
            <ModalTransitionLayer>
              <Animated.View
                onLayout={onLayout}
                style={[styles.content, style, contentAnimatedStyle]}
              >
                <ModalProgressContext.Provider value={progress}>
                  {children}
                </ModalProgressContext.Provider>
              </Animated.View>
            </ModalTransitionLayer>
          </View>
        </SharedElementHost>
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
  hidden: {
    opacity: 0,
  },
});
