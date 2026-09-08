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
};

export const useModalGesture = ({
  progress,
  config,
  onDismissRequest,
}: UseModalGestureOptions): GestureType => {
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

  return useMemo(() => {
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

        if (immersive) {
          activeEdge.value = 'immersive';
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
      })
      .onUpdate((event) => {
        'worklet';
        const edge = activeEdge.value;
        if (!edge) return;

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
            scheduleOnRN(onDismissRequest);
          } else {
            progress.value = withTiming(1, { duration: 180 });
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
          scheduleOnRN(onDismissRequest);
        } else {
          progress.value = withTiming(1, { duration: 180 });
        }
      });
  }, [activeEdge, height, onDismissRequest, progress, resolvedConfig, width]);
};
