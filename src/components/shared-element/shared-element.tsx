import { useContext, useEffect, useRef, type PropsWithChildren } from 'react';
import type { ReactElement } from 'react';
import {
  StyleSheet,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SharedElementHostContext } from '../../context/shared-element-host-context';
import { useSharedElementRegistry } from '../../hooks/use-shared-element-registry';
import { NativeSharedElement } from '../../native/epic-shared-element';
import type { SharedElementNode, SharedElementRect } from './types';

export interface SharedElementProps {
  id: string;
  measurementOnly?: boolean;
  throttle?: number;
  trackFrame?: boolean;
  pointerEvents?: ViewProps['pointerEvents'];
  style?: StyleProp<ViewStyle>;
}

export function SharedElement({
  id,
  measurementOnly = false,
  throttle = 16,
  trackFrame = false,
  pointerEvents,
  style,
  children,
}: PropsWithChildren<SharedElementProps & { children: ReactElement }>) {
  const { register, updateRect, unregister } = useSharedElementRegistry();
  const ancestorTag = useContext(SharedElementHostContext);
  const rect = useSharedValue<SharedElementRect | null>(null);
  const visibility = useSharedValue(1);
  const nodeRef = useRef<SharedElementNode | null>(null);
  const frameCount = useRef(0);
  const lastFrame = useRef<SharedElementRect | null>(null);
  const visibilityStyle = useAnimatedStyle(() => ({
    opacity: visibility.value,
  }));

  useEffect(() => {
    const node: SharedElementNode = {
      id,
      measurementOnly,
      rect,
      visibility,
    };
    nodeRef.current = node;
    register(node);

    return () => {
      if (nodeRef.current === node) {
        nodeRef.current = null;
      }
      unregister(node);
    };
  }, [id, measurementOnly, rect, register, unregister, visibility]);

  return (
    <AnimatedNativeSharedElement
      collapsable={false}
      pointerEvents={pointerEvents ?? (measurementOnly ? 'none' : 'auto')}
      ancestorTag={ancestorTag ?? undefined}
      throttle={throttle}
      trackFrame={trackFrame}
      style={[visibilityStyle, style, measurementOnly && styles.hidden]}
      onFrame={(event) => {
        const node = nodeRef.current;
        if (!node) return;

        const frame = event.nativeEvent;
        const previousFrame = lastFrame.current;
        const hasChanged =
          !previousFrame ||
          previousFrame.x !== frame.x ||
          previousFrame.y !== frame.y ||
          previousFrame.width !== frame.width ||
          previousFrame.height !== frame.height;

        if (__DEV__ && hasChanged) {
          frameCount.current += 1;
          lastFrame.current = frame;
          console.log('[SharedElement] measured frame', {
            id,
            measurementOnly,
            ancestorTag,
            frameNumber: frameCount.current,
            ...frame,
          });
        }

        updateRect(node, frame);
      }}
    >
      {children}
    </AnimatedNativeSharedElement>
  );
}

const AnimatedNativeSharedElement =
  Animated.createAnimatedComponent(NativeSharedElement);

const styles = StyleSheet.create({
  hidden: { opacity: 0 },
});
