import { useContext, useEffect, useRef, type PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { ModalProgressContext } from '../../context/modal-progress-context';
import { ModalTransitionContext } from '../../context/modal-transition-context';
import { useSharedElementRegistry } from '../../hooks/use-shared-element-registry';
import { useSharedElementResizeStyle } from '../../hooks/use-shared-element-resize-style';
import { useSharedElementZoomStyle } from '../../hooks/use-shared-element-zoom-style';
import type { SharedElementTransitionProps } from './types';

const source_fade_start = 0.01;
const shared_element_motion_start = 0.015;

function logSharedElementProgress({
  startId,
  endId,
  progress,
  startRect,
  endRect,
}: {
  startId: string;
  endId: string;
  progress: number;
  startRect: unknown;
  endRect: unknown;
}) {
  console.info('[EpicModal][shared-element:progress]', {
    startId,
    endId,
    progress,
    startRect,
    endRect,
  });
}

/** Renders an element between the measured start and end frames. */
export function SharedElementTransition({
  startId,
  endId,
  children,
  clip = true,
  mode = 'zoom',
}: PropsWithChildren<SharedElementTransitionProps>) {
  const progress = useContext(ModalProgressContext);
  const transitionContext = useContext(ModalTransitionContext);
  const transitionKey = useRef(`transition-${Math.random()}`);

  useEffect(() => {
    if (!transitionContext || !progress) return;

    const key = transitionKey.current;
    transitionContext.register({
      key,
      startId,
      endId,
      children,
      clip,
      mode,
      progress,
    });

    return () => transitionContext.unregister(key);
  }, [children, clip, endId, mode, progress, startId, transitionContext]);

  if (transitionContext) return null;
  if (!progress) {
    throw new Error(
      'SharedElementTransition must be rendered inside a Modal component'
    );
  }

  return (
    <SharedElementTransitionView
      startId={startId}
      endId={endId}
      progress={progress}
      clip={clip}
      mode={mode}
    >
      {children}
    </SharedElementTransitionView>
  );
}

export function SharedElementTransitionView({
  startId,
  endId,
  children,
  clip = true,
  mode = 'zoom',
  progress,
}: SharedElementTransitionProps & { progress: SharedValue<number> }) {
  const { get, getElement, revision } = useSharedElementRegistry();
  const startNode = get(startId);
  const endNode = get(endId);
  const start = startNode?.rect;
  const end = endNode?.rect;
  const lastProgressBucket = useSharedValue(-1);
  const transitionElement = children ?? getElement(startId) ?? null;

  const resizeStyle = useSharedElementResizeStyle(
    progress,
    start,
    end,
    revision
  );
  const zoomStyle = useSharedElementZoomStyle(progress, start, end, revision);
  const animatedStyle = mode === 'zoom' ? zoomStyle : resizeStyle;

  useAnimatedReaction(
    () => ({
      value: progress.value,
      bucket: Math.floor(progress.value * 20),
      startRect: start?.value,
      endRect: end?.value,
    }),
    ({ value, bucket, startRect, endRect }) => {
      if (__DEV__ && bucket !== lastProgressBucket.value) {
        lastProgressBucket.value = bucket;
        scheduleOnRN(logSharedElementProgress, {
          startId,
          endId,
          progress: value,
          startRect,
          endRect,
        });
      }

      if (startNode?.visibility) {
        startNode.visibility.value = interpolate(
          value,
          [0, source_fade_start, shared_element_motion_start],
          [1, 1, 0],
          Extrapolation.CLAMP
        );
      }
      if (endNode?.visibility) {
        endNode.visibility.value = interpolate(
          value,
          [0, 0.96, 0.965],
          [0, 0, 1],
          Extrapolation.CLAMP
        );
      }
    },
    [revision]
  );

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.element, clip && styles.clipped, animatedStyle]}
    >
      {transitionElement}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  element: { position: 'absolute' },
  clipped: { overflow: 'hidden' },
});
