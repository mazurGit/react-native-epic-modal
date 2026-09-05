import {
  forwardRef,
  useContext,
  useCallback,
  useImperativeHandle,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { IModalProps, IModalRef } from './types';
import { StatusBar, StyleSheet, View } from 'react-native';
import { scheduleOnRN } from 'react-native-worklets';
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import { DEFAULT_ANIMATION_CONFIG, DEFAULT_GESTURE_CONFIG } from './constants';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { getAnimationConfig } from './utils';
import { ModalBackHandlerProvider } from '../../context/context';
import { ModalProgressContext } from '../../context/modal-progress-context';

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
      backdropStyle,
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
      edgeTarget,
    } = resolvedGestureConfig;

    const isHorizontalDirection = gestureDirection === 'horizontal';
    const [visible, setVisible] = useState(false);
    const visibleRef = useRef(false);
    const { width, height } = useWindowDimensions();
    const containerWidth = useSharedValue(0);
    const containerHeight = useSharedValue(0);
    const contentX = useSharedValue(0);
    const contentY = useSharedValue(0);
    const backHandler = useContext(ModalBackHandlerProvider);
    const sensitiveAreaTouched = useSharedValue(false);
    const progress = useSharedValue(0);
    const animationVersion = useSharedValue(0);
    const presented = useSharedValue(false);
    const closing = useSharedValue(false);
    const hideRequest = useSharedValue(0);
    const canSwipe = useDerivedValue(
      () => sensitiveAreaTouched.value && gestureEnabled && !closing.value,
      [closing, gestureEnabled]
    );

    const hideWithAnimation = useCallback(() => {
      hideRequest.value += 1;
    }, [hideRequest]);

    useAnimatedReaction(
      () => hideRequest.value,
      (request, previousRequest) => {
        if (request === 0 || request === previousRequest) return;
        if (!presented.value || closing.value) return;
        closing.value = true;
        const version = animationVersion.value + 1;
        animationVersion.value = version;
        progress.value = withSpring(0, animationConfig, (finished) => {
          if (!finished || animationVersion.value !== version) return;
          presented.value = false;
          closing.value = false;
          scheduleOnRN(setVisible, false);
          if (onDismiss) scheduleOnRN(onDismiss);
        });
      },
      [animationConfig, onDismiss]
    );

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
      if (!visibleRef.current) {
        return false;
      }
      hideWithAnimation();
      return true;
    }, [hideWithAnimation]);

    useEffect(() => {
      visibleRef.current = visible;
    }, [visible]);

    useEffect(() => {
      if (!backHandler) return;
      return backHandler.register(id ?? 'modal', priority ?? 1, onBackPress);
    }, [backHandler, id, onBackPress, priority]);

    const pan = Gesture.Pan()
      .minDistance(1)
      .onStart((event) => {
        'worklet';
        const left = edgeTarget === 'content' ? contentX.value : 0;
        const top = edgeTarget === 'content' ? contentY.value : 0;
        const right =
          edgeTarget === 'content'
            ? contentX.value + containerWidth.value
            : width;
        const bottom =
          edgeTarget === 'content'
            ? contentY.value + containerHeight.value
            : height;
        if (
          event.x >= left &&
          event.x <= Math.min(left + leftGestureAreaOffset, right) &&
          isHorizontalDirection
        ) {
          sensitiveAreaTouched.value = true;
        } else if (
          event.y >= top &&
          event.y <= Math.min(top + topGestureAreaOffset, bottom) &&
          !isHorizontalDirection
        ) {
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
              scheduleOnRN(setVisible, false);
              if (onDismiss) scheduleOnRN(onDismiss);
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
    const backdropAnimatedStyle = useAnimatedStyle(() => ({
      opacity: progress.value,
    }));

    const onLayout = useCallback(
      ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
        contentX.value = layout.x;
        contentY.value = layout.y;
        containerWidth.value = layout.width;
        containerHeight.value = layout.height;
      },
      [containerHeight, containerWidth, contentX, contentY]
    );

    if (!visible) {
      return null;
    }

    return (
      <>
        <StatusBar hidden={hiddenStatusBar} />
        <GestureDetector gesture={pan}>
          <View style={StyleSheet.absoluteFill}>
            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                backdropStyle,
                backdropAnimatedStyle,
              ]}
            />
            <Animated.View
              onLayout={onLayout}
              style={[
                style ?? StyleSheet.absoluteFill,
                { zIndex: priority },
                aStyles,
              ]}
            >
              <ModalProgressContext.Provider value={progress}>
                {children}
              </ModalProgressContext.Provider>
            </Animated.View>
          </View>
        </GestureDetector>
      </>
    );
  }
);
