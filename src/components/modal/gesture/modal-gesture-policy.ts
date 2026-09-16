import type { ModalGestureEdge } from './modal-gesture';

export type EdgeOffsets = Required<Record<ModalGestureEdge, number>>;

export const getActiveEdge = (
  x: number,
  y: number,
  width: number,
  height: number,
  offsets: EdgeOffsets
): ModalGestureEdge | null => {
  'worklet';
  if (offsets.left > 0 && x <= offsets.left) return 'left';
  if (offsets.right > 0 && x >= width - offsets.right) return 'right';
  if (offsets.top > 0 && y <= offsets.top) return 'top';
  if (offsets.bottom > 0 && y >= height - offsets.bottom) return 'bottom';
  return null;
};

export const getAxisForEdge = (edge: ModalGestureEdge): 'x' | 'y' => {
  'worklet';
  return edge === 'left' || edge === 'right' ? 'x' : 'y';
};

export const getEdgeDirection = (edge: ModalGestureEdge): 1 | -1 => {
  'worklet';
  return edge === 'left' || edge === 'top' ? 1 : -1;
};

export const getProgress = (
  translation: number,
  distance: number,
  direction: number
): number => {
  'worklet';
  return Math.min(
    Math.max(1 - Math.max(translation * direction, 0) / distance, 0),
    1
  );
};

export const shouldDismiss = (
  progress: number,
  dismissVelocity: number,
  progressThreshold: number,
  velocityThreshold: number
): boolean => {
  'worklet';
  return progress < progressThreshold || dismissVelocity > velocityThreshold;
};
