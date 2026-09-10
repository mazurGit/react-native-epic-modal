import { Gesture, type GestureType } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { withTiming } from 'react-native-reanimated';
import type { ResolvedModalGestureConfig } from './modal-gesture';
import type { ModalGestureRuntime } from './modal-gesture-runtime';
import {
  getActiveEdge,
  getAxisForEdge,
  getEdgeDirection,
  getProgress,
  shouldDismiss,
  type EdgeOffsets,
} from './modal-gesture-policy';

type CreateModalPanGestureOptions = {
  width: number;
  height: number;
  config: ResolvedModalGestureConfig;
  runtime: ModalGestureRuntime;
  onDismissRequest?: () => void;
};

const getOffsets = (config: ResolvedModalGestureConfig): EdgeOffsets => ({
  left: config.edges.left ?? 0,
  right: config.edges.right ?? 0,
  top: config.edges.top ?? 0,
  bottom: config.edges.bottom ?? 0,
});

const animateBack = (runtime: ModalGestureRuntime) => {
  'worklet';
  runtime.phase.value = 'settling';
  runtime.translationX.value = withTiming(0, { duration: 180 });
  runtime.translationY.value = withTiming(0, { duration: 180 });
  runtime.progress.value = withTiming(1, { duration: 180 }, (finished) => {
    if (finished) runtime.phase.value = 'idle';
  });
};

const animateFollowGesture = (
  runtime: ModalGestureRuntime,
  axis: 'x' | 'y',
  direction: number,
  distance: number
) => {
  'worklet';
  runtime.phase.value = 'dismissing';
  const target = direction * distance;
  if (axis === 'x') {
    runtime.translationX.value = withTiming(target, { duration: 250 });
    runtime.translationY.value = withTiming(0, { duration: 250 });
  } else {
    runtime.translationX.value = withTiming(0, { duration: 250 });
    runtime.translationY.value = withTiming(target, { duration: 250 });
  }
};

const finishGesture = (
  runtime: ModalGestureRuntime,
  config: ResolvedModalGestureConfig,
  onDismissRequest: (() => void) | undefined,
  axis: 'x' | 'y',
  direction: number,
  distance: number,
  dismissVelocity: number
) => {
  'worklet';
  if (
    !shouldDismiss(
      runtime.progress.value,
      dismissVelocity,
      config.swipeProgressToClose,
      config.swipeVelocityThreshold
    )
  ) {
    animateBack(runtime);
    return;
  }

  if (config.dismissBehavior === 'followGesture') {
    animateFollowGesture(runtime, axis, direction, distance);
  } else {
    runtime.phase.value = 'dismissing';
  }
  if (onDismissRequest) scheduleOnRN(onDismissRequest);
};

const createImmersivePanGesture = ({
  width,
  height,
  config,
  runtime,
  onDismissRequest,
}: CreateModalPanGestureOptions): GestureType =>
  Gesture.Pan()
    .enabled(config.enabled)
    .minDistance(1)
    .onStart(() => {
      'worklet';
      runtime.phase.value = 'tracking';
      runtime.edge.value = 'immersive';
      runtime.axis.value = null;
      runtime.translationX.value = 0;
      runtime.translationY.value = 0;
    })
    .onUpdate((event) => {
      'worklet';
      runtime.translationX.value = event.translationX;
      runtime.translationY.value = event.translationY;
      if (!runtime.axis.value) {
        runtime.axis.value =
          Math.abs(event.translationX) >= Math.abs(event.translationY)
            ? 'x'
            : 'y';
      }
      const axis = runtime.axis.value;
      const horizontal = axis === 'x';
      const translation = horizontal ? event.translationX : event.translationY;
      runtime.progress.value = Math.min(
        Math.max(1 - Math.abs(translation) / (horizontal ? width : height), 0),
        1
      );
    })
    .onEnd((event) => {
      'worklet';
      const axis = runtime.axis.value ?? 'x';
      const horizontal = axis === 'x';
      const velocity = horizontal ? event.velocityX : event.velocityY;
      const translation = horizontal ? event.translationX : event.translationY;
      finishGesture(
        runtime,
        config,
        onDismissRequest,
        axis,
        Math.sign(translation || velocity) || 1,
        horizontal ? width : height,
        Math.abs(velocity)
      );
    })
    .onFinalize(() => {
      'worklet';
      runtime.edge.value = null;
      if (runtime.phase.value === 'tracking') animateBack(runtime);
    });

const createEdgePanGesture = ({
  width,
  height,
  config,
  runtime,
  onDismissRequest,
}: CreateModalPanGestureOptions): GestureType => {
  const offsets = getOffsets(config);
  return Gesture.Pan()
    .enabled(config.enabled)
    .minDistance(1)
    .onStart((event) => {
      'worklet';
      runtime.edge.value = getActiveEdge(
        event.x,
        event.y,
        width,
        height,
        offsets
      );
      runtime.phase.value = runtime.edge.value ? 'tracking' : 'idle';
      runtime.axis.value = runtime.edge.value
        ? getAxisForEdge(runtime.edge.value)
        : null;
      runtime.translationX.value = 0;
      runtime.translationY.value = 0;
    })
    .onUpdate((event) => {
      'worklet';
      const edge = runtime.edge.value;
      const axis = runtime.axis.value;
      if (!edge || edge === 'immersive' || !axis) return;
      runtime.translationX.value = event.translationX;
      runtime.translationY.value = event.translationY;
      const translation =
        axis === 'x' ? event.translationX : event.translationY;
      runtime.progress.value = getProgress(
        translation,
        axis === 'x' ? width : height,
        getEdgeDirection(edge)
      );
    })
    .onEnd((event) => {
      'worklet';
      const edge = runtime.edge.value;
      const axis = runtime.axis.value;
      if (!edge || edge === 'immersive' || !axis) return;
      const horizontal = axis === 'x';
      const direction = getEdgeDirection(edge);
      const velocity = horizontal ? event.velocityX : event.velocityY;
      finishGesture(
        runtime,
        config,
        onDismissRequest,
        axis,
        direction,
        horizontal ? width : height,
        velocity * direction
      );
    })
    .onFinalize(() => {
      'worklet';
      runtime.edge.value = null;
      if (runtime.phase.value === 'tracking') animateBack(runtime);
    });
};

export const createModalPanGesture = (
  options: CreateModalPanGestureOptions
): GestureType =>
  options.config.immersive
    ? createImmersivePanGesture(options)
    : createEdgePanGesture(options);
