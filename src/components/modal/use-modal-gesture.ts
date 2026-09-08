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
  DEFAULT_MODAL_GESTURE,
  type ModalGestureConfig,
  type ModalGestureEdge,
} from './modal-gesture';

type UseModalGestureOptions = {
  progress: SharedValue<number>;
  config?: ModalGestureConfig;
  onDismissRequest: () => void;
  freeSwipe?: boolean;
};

type ModalGestureState = {
  gesture: GestureType;
  gestureActive: SharedValue<boolean>;
  translationX: SharedValue<number>;
  translationY: SharedValue<number>;
};

export const useModalGesture = ({
  progress,
  config,
  onDismissRequest,
  freeSwipe = false,
}: UseModalGestureOptions): ModalGestureState => {
  const { width, height } = useWindowDimensions();
  const resolvedConfig = useMemo(
    () => ({
      ...DEFAULT_MODAL_GESTURE,
      ...config,
      edges: {
        ...DEFAULT_MODAL_GESTURE.edges,
        ...config?.edges,
        offset: {
          ...DEFAULT_MODAL_GESTURE.edges.offset,
          ...config?.edges?.offset,
        },
      },
    }),
    [config]
  );
  const activeEdge = useSharedValue<ModalGestureEdge | 'immersive' | null>(
    null
  );
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const gestureActive = useSharedValue(false);

  const gesture = useMemo(() => {
    const {
      edges,
      enabled,
      immersive,
      swipeProgressToClose,
      swipeVelocityThreshold,
    } = resolvedConfig;
    const leftOffset = edges.offset.left ?? 0;
    const rightOffset = edges.offset.right ?? 0;
    const topOffset = edges.offset.top ?? 0;
    const bottomOffset = edges.offset.bottom ?? 0;

    return Gesture.Pan()
      .enabled(enabled)
      .minDistance(1)
      .onStart((event) => {
        'worklet';
        activeEdge.value = null;
        gestureActive.value = false;
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
        if (!edge) return;

        if (edge === 'immersive') {
          const isHorizontal =
            Math.abs(event.translationX) >= Math.abs(event.translationY);
          const velocity = isHorizontal ? event.velocityX : event.velocityY;
          const shouldDismiss =
            progress.value < swipeProgressToClose ||
            Math.abs(velocity) > swipeVelocityThreshold;

          if (shouldDismiss) {
            if (freeSwipe) {
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
            scheduleOnRN(onDismissRequest);
          } else {
            translationX.value = withTiming(0, { duration: 180 });
            translationY.value = withTiming(0, { duration: 180 });
            progress.value = withTiming(1, { duration: 180 }, (finished) => {
              if (finished) gestureActive.value = false;
            });
          }
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
          if (freeSwipe) {
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
          scheduleOnRN(onDismissRequest);
        } else {
          translationX.value = withTiming(0, { duration: 180 });
          translationY.value = withTiming(0, { duration: 180 });
          progress.value = withTiming(1, { duration: 180 }, (finished) => {
            if (finished) gestureActive.value = false;
          });
        }
      });
  }, [
    activeEdge,
    freeSwipe,
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
