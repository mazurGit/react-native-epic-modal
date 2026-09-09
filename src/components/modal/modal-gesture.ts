export type ModalGestureEdge = 'left' | 'right' | 'top' | 'bottom';

type ModalGesturePresetKind = 'immersive';

type InternalModalGestureConfig = ModalGestureConfig & {
  preset?: ModalGesturePresetKind;
};

export type ModalGestureConfig = {
  enabled?: boolean;
  edges?: {
    offset?: Partial<Record<ModalGestureEdge, number>>;
  };
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

const createModalGesturePreset = (
  preset?: ModalGesturePresetKind,
  config?: ModalGestureConfig
): ModalGestureConfig => ({
  ...config,
  ...(preset ? { preset } : {}),
});

export const resolveModalGestureConfig = (
  config?: ModalGestureConfig
): ResolvedModalGestureConfig => {
  const internalConfig = config as InternalModalGestureConfig | undefined;

  return {
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
    immersive: internalConfig?.preset === 'immersive',
  };
};

export const MODAL_GESTURE_PRESETS = {
  immersive: createModalGesturePreset('immersive'),
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
