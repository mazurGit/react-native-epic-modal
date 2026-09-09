export type ModalGestureEdge = 'left' | 'right' | 'top' | 'bottom';

export type ModalGestureConfig = {
  enabled?: boolean;
  immersive?: boolean;
  edges?: Partial<Record<ModalGestureEdge, number>>;
  swipeVelocityThreshold?: number;
  swipeProgressToClose?: number;
};

export type ResolvedModalGestureConfig = Required<
  Omit<ModalGestureConfig, 'edges'>
> & {
  edges: Required<NonNullable<ModalGestureConfig['edges']>>;
  immersive: boolean;
};

export const DEFAULT_MODAL_GESTURE: Required<
  Omit<ModalGestureConfig, 'edges'>
> & {
  edges: Required<NonNullable<ModalGestureConfig['edges']>>;
} = {
  enabled: true,
  immersive: false,
  edges: {
    left: 50,
    right: 50,
    top: 100,
    bottom: 0,
  },
  swipeVelocityThreshold: 800,
  swipeProgressToClose: 0.6,
};

export const resolveModalGestureConfig = (
  config?: ModalGestureConfig
): ResolvedModalGestureConfig => {
  return {
    ...DEFAULT_MODAL_GESTURE,
    ...config,
    edges: {
      ...DEFAULT_MODAL_GESTURE.edges,
      ...config?.edges,
    },
    immersive: config?.immersive ?? false,
  };
};
