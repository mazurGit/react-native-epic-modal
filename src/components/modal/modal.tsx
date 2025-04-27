import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
  type PropsWithChildren,
} from 'react';
import type { IGestureConfig, IModalProps, IModalRef } from './types';
import { StatusBar, StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_GESTURE_CONFIG,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from './constants';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { getAnimationConfig } from './utils';
import { useAndroidBackHandler } from '../../hooks/hooks';

export const ModalContent = forwardRef<
  IModalRef,
  PropsWithChildren<IModalProps>
>(
  (
    {
      animationConfig = DEFAULT_ANIMATION_CONFIG,
      gestureDirection = 'horizontal',
      gestureEnabled = true,
      children,
      priority,
      style,
      onDismiss,
      onEnter,
      animation = 'fade',
      gestureConfig = DEFAULT_GESTURE_CONFIG,
      hiddenStatusBar = false,
    },
    ref
  ) => {
    const {
      swipeProgressToClose,
      swipeVelocityThreshold,
      leftGestureAreaOffset,
      topGestureAreaOffset,
    } = gestureConfig as Required<IGestureConfig>;

    const isHorizontalDirection = gestureDirection === 'horizontal';
    const [visible, setVisible] = useState(false);
    const sensitiveAreaTouched = useSharedValue(false);
    const progress = useSharedValue(0);
    const canSwipe = useDerivedValue(
      () => sensitiveAreaTouched.value && gestureEnabled,
      [gestureEnabled]
    );

    const hideWithAnimation = useCallback(() => {
      const finishCallback = () => {
        setVisible(false);
        onDismiss?.();
      };
      progress.value = withSpring(0, animationConfig, () => {
        runOnJS(finishCallback)();
      });
    }, [setVisible, onDismiss, animationConfig, progress]);

    useImperativeHandle(
      ref,
      () => ({
        show: () => {
          setVisible(true);
          onEnter?.();
          progress.value = withSpring(1, animationConfig);
        },
        hide: hideWithAnimation,
      }),
      [setVisible, onEnter, hideWithAnimation, animationConfig, progress]
    );

    const onBackPress = useCallback(() => {
      if (!visible) {
        return false;
      }
      hideWithAnimation();
      return true;
    }, [visible, hideWithAnimation]);

    useAndroidBackHandler(onBackPress, [onBackPress]);

    const pan = Gesture.Pan()
      .minDistance(1)
      .onStart((event) => {
        'worklet';
        if (event.x < leftGestureAreaOffset && isHorizontalDirection) {
          sensitiveAreaTouched.value = true;
        } else if (event.y < topGestureAreaOffset && !isHorizontalDirection) {
          sensitiveAreaTouched.value = true;
        } else {
          sensitiveAreaTouched.value = false;
        }
      })
      .onUpdate((event) => {
        'worklet';
        if (!canSwipe.value) {
          return;
        }
        const distance = isHorizontalDirection ? SCREEN_WIDTH : SCREEN_HEIGHT;
        const translation = isHorizontalDirection
          ? event.translationX
          : event.translationY;
        const swipeProgress = 1 - Math.abs(translation / distance);
        progress.value = Math.min(Math.max(swipeProgress, 0), 1);
      })
      .onEnd((event) => {
        'worklet';
        const swipeVelocity = isHorizontalDirection
          ? event.velocityX
          : event.velocityY;
        if (
          progress.value < Number(swipeProgressToClose) ||
          Math.abs(swipeVelocity) > swipeVelocityThreshold
        ) {
          progress.value = withSpring(0, animationConfig, () => {
            runOnJS(setVisible)(false);
          });
        } else {
          progress.value = withSpring(1, animationConfig);
        }
      });

    const aStyles = useAnimatedStyle(
      () => getAnimationConfig(progress, gestureDirection)[animation],
      [animation]
    );

    if (!visible) {
      return null;
    }

    return (
      <>
        <StatusBar hidden={hiddenStatusBar} />
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { zIndex: priority },
              style,
              aStyles,
            ]}
          >
            {children}
          </Animated.View>
        </GestureDetector>
      </>
    );
  }
);
