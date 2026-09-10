import { useMemo } from 'react';
import {
  useDerivedValue,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import type { ModalGestureEdge } from './modal-gesture';

export type ModalGesturePhase = 'idle' | 'tracking' | 'settling' | 'dismissing';

export type ModalGestureRuntime = {
  phase: SharedValue<ModalGesturePhase>;
  edge: SharedValue<ModalGestureEdge | 'immersive' | null>;
  axis: SharedValue<'x' | 'y' | null>;
  progress: SharedValue<number>;
  translationX: SharedValue<number>;
  translationY: SharedValue<number>;
  gestureActive: SharedValue<boolean>;
};

export const useModalGestureRuntime = (
  progress: SharedValue<number>
): ModalGestureRuntime => {
  const phase = useSharedValue<ModalGesturePhase>('idle');
  const edge = useSharedValue<ModalGestureEdge | 'immersive' | null>(null);
  const axis = useSharedValue<'x' | 'y' | null>(null);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const gestureActive = useDerivedValue(() => phase.value !== 'idle');

  return useMemo(
    () => ({
      phase,
      edge,
      axis,
      progress,
      translationX,
      translationY,
      gestureActive,
    }),
    [axis, edge, gestureActive, phase, progress, translationX, translationY]
  );
};
