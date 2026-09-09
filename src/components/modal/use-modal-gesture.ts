import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { Gesture, type GestureType } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import {
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import {
  type ModalGestureConfig,
  type ModalGestureEdge,
  resolveModalGestureConfig,
} from './modal-gesture';

type UseModalGestureOptions = {
  progress: SharedValue<number>;
  config?: ModalGestureConfig;
  onDismissRequest?: () => void;
};

type ModalGestureState = {
  gesture: GestureType;
  gestureActive: SharedValue<boolean>;
  translationX: SharedValue<number>;
  translationY: SharedValue<number>;
};

const animateGestureBack = (
  progress: SharedValue<number>,
  gestureActive: SharedValue<boolean>,
  translationX: SharedValue<number>,
  translationY: SharedValue<number>
) => {
  'worklet';
  translationX.value = withTiming(0, { duration: 180 });
  translationY.value = withTiming(0, { duration: 180 });
  progress.value = withTiming(1, { duration: 180 }, (finished) => {
    if (finished) gestureActive.value = false;
  });
};

export const useModalGesture = ({
  progress,
  config,
  onDismissRequest,
}: UseModalGestureOptions): ModalGestureState => {
  const { width, height } = useWindowDimensions();
  const resolvedConfig = useMemo(
    () => resolveModalGestureConfig(config),
    [config]
  );
  const activeEdge = useSharedValue<ModalGestureEdge | 'immersive' | null>(
    null
  );
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const gestureActive = useSharedValue(false);
  const gestureCompleted = useSharedValue(false);
  const dismissRequested = useSharedValue(false);

  const gesture = useMemo(() => {
    const {
      edges,
      enabled,
      immersive,
      swipeProgressToClose,
      swipeVelocityThreshold,
    } = resolvedConfig;
    const leftOffset = edges.left ?? 0;
    const rightOffset = edges.right ?? 0;
    const topOffset = edges.top ?? 0;
    const bottomOffset = edges.bottom ?? 0;

    return Gesture.Pan()
      .enabled(enabled)
      .minDistance(1)
      .onStart((event) => {
        'worklet';
        activeEdge.value = null;
        gestureActive.value = false;
        gestureCompleted.value = false;
        dismissRequested.value = false;
        translationX.value = 0;
        translationY.value = 0;

        if (immersive) {
          activeEdge.value = 'immersive';
          gestureActive.value = true;
          return;
        }

        if (leftOffset > 0 && event.x <= leftOffset) {
          activeEdge.value = 'left';
        } else if (rightOffset > 0 && event.x >= width - rightOffset) {
          activeEdge.value = 'right';
        } else if (topOffset > 0 && event.y <= topOffset) {
          activeEdge.value = 'top';
        } else if (bottomOffset > 0 && event.y >= height - bottomOffset) {
          activeEdge.value = 'bottom';
        }
        gestureActive.value = activeEdge.value !== null;
      })
      .onUpdate((event) => {
        'worklet';
        const edge = activeEdge.value;
        if (!edge) return;

        translationX.value = event.translationX;
        translationY.value = event.translationY;

        if (edge === 'immersive') {
          const isHorizontal =
            Math.abs(event.translationX) >= Math.abs(event.translationY);
          const distance = isHorizontal ? width : height;
          const translation = isHorizontal
            ? event.translationX
            : event.translationY;
          progress.value = Math.min(
            Math.max(1 - Math.abs(translation) / distance, 0),
            1
          );
          return;
        }

        const isHorizontalEdge = edge === 'left' || edge === 'right';
        const distance = isHorizontalEdge ? width : height;
        const translation = isHorizontalEdge
          ? event.translationX
          : event.translationY;
        const signedTranslation =
          edge === 'left' || edge === 'top' ? translation : -translation;

        progress.value = Math.min(
          Math.max(1 - Math.max(signedTranslation, 0) / distance, 0),
          1
        );
      })
      .onEnd((event) => {
        'worklet';
        const edge = activeEdge.value;
        activeEdge.value = null;
        if (!edge) {
          gestureCompleted.value = true;
          return;
        }

        if (edge === 'immersive') {
          const isHorizontal =
            Math.abs(event.translationX) >= Math.abs(event.translationY);
          const velocity = isHorizontal ? event.velocityX : event.velocityY;
          const shouldDismiss =
            progress.value < swipeProgressToClose ||
            Math.abs(velocity) > swipeVelocityThreshold;

          if (shouldDismiss) {
            dismissRequested.value = true;
            if (resolvedConfig.dismissBehavior === 'followGesture') {
              const signedDirection = isHorizontal
                ? event.translationX || event.velocityX
                : event.translationY || event.velocityY;
              const distance = isHorizontal ? width : height;
              const target = Math.sign(signedDirection || 1) * distance;

              if (isHorizontal) {
                translationX.value = withTiming(target, { duration: 250 });
                translationY.value = withTiming(0, { duration: 250 });
              } else {
                translationX.value = withTiming(0, { duration: 250 });
                translationY.value = withTiming(target, { duration: 250 });
              }
            }
            onDismissRequest && scheduleOnRN(onDismissRequest);
          } else {
            animateGestureBack(
              progress,
              gestureActive,
              translationX,
              translationY
            );
          }
          gestureCompleted.value = true;
          return;
        }

        const isHorizontalEdge = edge === 'left' || edge === 'right';
        const velocity = isHorizontalEdge ? event.velocityX : event.velocityY;
        const signedVelocity =
          edge === 'left' || edge === 'top' ? velocity : -velocity;
        const shouldDismiss =
          progress.value < swipeProgressToClose ||
          signedVelocity > swipeVelocityThreshold;

        if (shouldDismiss) {
          dismissRequested.value = true;
          if (resolvedConfig.dismissBehavior === 'followGesture') {
            const isHorizontal =
              Math.abs(event.translationX) >= Math.abs(event.translationY);
            const signedDirection = isHorizontal
              ? event.translationX || event.velocityX
              : event.translationY || event.velocityY;
            const distance = isHorizontal ? width : height;
            const target = Math.sign(signedDirection || 1) * distance;

            if (isHorizontal) {
              translationX.value = withTiming(target, { duration: 250 });
              translationY.value = withTiming(0, { duration: 250 });
            } else {
              translationX.value = withTiming(0, { duration: 250 });
              translationY.value = withTiming(target, { duration: 250 });
            }
          }
          onDismissRequest && scheduleOnRN(onDismissRequest);
        } else {
          animateGestureBack(
            progress,
            gestureActive,
            translationX,
            translationY
          );
        }
        gestureCompleted.value = true;
      })
      .onFinalize(() => {
        'worklet';
        activeEdge.value = null;
        if (!gestureCompleted.value && !dismissRequested.value) {
          animateGestureBack(
            progress,
            gestureActive,
            translationX,
            translationY
          );
        }
      });
  }, [
    activeEdge,
    dismissRequested,
    gestureCompleted,
    gestureActive,
    height,
    onDismissRequest,
    progress,
    resolvedConfig,
    translationX,
    translationY,
    width,
  ]);

  return { gesture, gestureActive, translationX, translationY };
};
