import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { type GestureType } from 'react-native-gesture-handler';
import { type SharedValue } from 'react-native-reanimated';
import {
  type ModalGestureConfig,
  resolveModalGestureConfig,
} from './modal-gesture';
import { createModalPanGesture } from './create-modal-pan-gesture';
import {
  useModalGestureRuntime,
  type ModalGestureRuntime,
} from './modal-gesture-runtime';

type UseModalGestureOptions = {
  progress: SharedValue<number>;
  config?: ModalGestureConfig;
  onDismissRequest?: () => void;
};

type ModalGestureState = Pick<
  ModalGestureRuntime,
  'gestureActive' | 'translationX' | 'translationY'
> & {
  gesture: GestureType;
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
  const runtime = useModalGestureRuntime(progress);
  const gesture = useMemo(
    () =>
      createModalPanGesture({
        width,
        height,
        config: resolvedConfig,
        runtime,
        onDismissRequest,
      }),
    [height, onDismissRequest, resolvedConfig, runtime, width]
  );

  return {
    gesture,
    gestureActive: runtime.gestureActive,
    translationX: runtime.translationX,
    translationY: runtime.translationY,
  };
};
