import {
  forwardRef,
  useContext,
  useCallback,
  useImperativeHandle,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { IModalProps, IModalRef } from './types';
import { StatusBar, StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import { DEFAULT_ANIMATION_CONFIG, DEFAULT_GESTURE_CONFIG } from './constants';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { getAnimationConfig } from './utils';
import { ModalBackHandlerProvider } from '../../context/context';

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
      id,
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
    const resolvedGestureConfig = {
      ...DEFAULT_GESTURE_CONFIG,
      ...gestureConfig,
    };
    const {
      swipeProgressToClose,
      swipeVelocityThreshold,
      leftGestureAreaOffset,
      topGestureAreaOffset,
    } = resolvedGestureConfig;

    const isHorizontalDirection = gestureDirection === 'horizontal';
    const [visible, setVisible] = useState(false);
    const { width, height } = useWindowDimensions();
    const containerWidth = useSharedValue(0);
    const containerHeight = useSharedValue(0);
    const backHandler = useContext(ModalBackHandlerProvider);
    const sensitiveAreaTouched = useSharedValue(false);
    const progress = useSharedValue(0);
    const animationVersion = useSharedValue(0);
    const presented = useSharedValue(false);
    const closing = useSharedValue(false);
    const canSwipe = useDerivedValue(
      () => sensitiveAreaTouched.value && gestureEnabled && !closing.value,
      [closing, gestureEnabled]
    );

    const hideWithAnimation = useCallback(() => {
      if (!presented.value || closing.value) return;
      closing.value = true;
      const version = animationVersion.value + 1;
      animationVersion.value = version;
      const finishCallback = () => {
        if (animationVersion.value !== version) return;
        presented.value = false;
        closing.value = false;
        setVisible(false);
        onDismiss?.();
      };
      progress.value = withSpring(0, animationConfig, () => {
        if (animationVersion.value === version) runOnJS(finishCallback)();
      });
    }, [
      animationConfig,
      animationVersion,
      closing,
      onDismiss,
      presented,
      progress,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        show: () => {
          animationVersion.value += 1;
          presented.value = true;
          closing.value = false;
          setVisible(true);
          onEnter?.();
          progress.value = withSpring(1, animationConfig);
        },
        hide: hideWithAnimation,
      }),
      [
        animationVersion,
        animationConfig,
        hideWithAnimation,
        onEnter,
        presented,
        progress,
        closing,
      ]
    );

    const onBackPress = useCallback(() => {
      if (!visible) {
        return false;
      }
      hideWithAnimation();
      return true;
    }, [visible, hideWithAnimation]);

    useEffect(() => {
      if (!backHandler) return;
      return backHandler.register(id ?? 'modal', priority ?? 1, onBackPress);
    }, [backHandler, id, onBackPress, priority]);

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
        const distance = isHorizontalDirection
          ? containerWidth.value || width
          : containerHeight.value || height;
        const translation = isHorizontalDirection
          ? event.translationX
          : event.translationY;
        const swipeProgress = 1 - Math.max(translation, 0) / distance;
        progress.value = Math.min(Math.max(swipeProgress, 0), 1);
      })
      .onEnd((event) => {
        'worklet';
        const swipeVelocity = isHorizontalDirection
          ? event.velocityX
          : event.velocityY;
        if (
          progress.value < Number(swipeProgressToClose) ||
          swipeVelocity > swipeVelocityThreshold
        ) {
          if (closing.value) return;
          closing.value = true;
          const version = animationVersion.value + 1;
          animationVersion.value = version;
          progress.value = withSpring(0, animationConfig, () => {
            if (animationVersion.value === version && presented.value) {
              presented.value = false;
              closing.value = false;
              runOnJS(setVisible)(false);
              if (onDismiss) runOnJS(onDismiss)();
            }
          });
        } else {
          progress.value = withSpring(1, animationConfig);
        }
      });

    const aStyles = useAnimatedStyle(
      () =>
        getAnimationConfig(
          progress,
          gestureDirection,
          containerWidth.value || width,
          containerHeight.value || height
        )[animation],
      [animation, gestureDirection, height, width]
    );

    const onLayout = useCallback(
      ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
        containerWidth.value = layout.width;
        containerHeight.value = layout.height;
      },
      [containerHeight, containerWidth]
    );

    if (!visible) {
      return null;
    }

    return (
      <>
        <StatusBar hidden={hiddenStatusBar} />
        <GestureDetector gesture={pan}>
          <Animated.View
            onLayout={onLayout}
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
