export type ModalGestureEdge = 'left' | 'right' | 'top' | 'bottom';

export type ModalGestureConfig = {
  enabled?: boolean;
  edges?: {
    offset?: Partial<Record<ModalGestureEdge, number>>;
  };
  swipeVelocityThreshold?: number;
  swipeProgressToClose?: number;
  /** Internal marker used by the immersive preset. */
  immersive?: boolean;
};

export const DEFAULT_MODAL_GESTURE: Required<
  Omit<ModalGestureConfig, 'edges'>
> & {
  edges: Required<NonNullable<ModalGestureConfig['edges']>>;
} = {
  enabled: true,
  immersive: false,
  edges: {
    offset: {
      left: 50,
      right: 50,
      top: 100,
      bottom: 0,
    },
  },
  swipeVelocityThreshold: 800,
  swipeProgressToClose: 0.6,
};

export const MODAL_GESTURE_PRESETS = {
  immersive: { immersive: true },
  horizontal: {
    edges: { offset: { left: 50, right: 50, top: 0, bottom: 0 } },
  },
  vertical: {
    edges: { offset: { left: 0, right: 0, top: 100, bottom: 100 } },
  },
  left: { edges: { offset: { left: 50, right: 0, top: 0, bottom: 0 } } },
  right: { edges: { offset: { left: 0, right: 50, top: 0, bottom: 0 } } },
  top: { edges: { offset: { left: 0, right: 0, top: 100, bottom: 0 } } },
  bottom: { edges: { offset: { left: 0, right: 0, top: 0, bottom: 100 } } },
} satisfies Record<string, ModalGestureConfig>;
