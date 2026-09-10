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
import { ModalTransitionContext } from '../../context/modal-transition-context';
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
  const transitionContext = useContext(ModalTransitionContext);
  const measurementKey = useRef(`measurement-${Math.random()}`);

  useEffect(() => {
    if (!measurementOnly || !transitionContext) return;

    const key = measurementKey.current;
    transitionContext.registerMeasurement({
      key,
      id,
      measurementOnly,
      throttle,
      trackFrame,
      pointerEvents,
      style,
      children,
    });

    return () => transitionContext.unregisterMeasurement(key);
  }, [
    children,
    id,
    measurementOnly,
    pointerEvents,
    style,
    throttle,
    trackFrame,
    transitionContext,
  ]);

  if (measurementOnly && transitionContext) return null;

  return (
    <SharedElementView
      id={id}
      measurementOnly={measurementOnly}
      throttle={throttle}
      trackFrame={trackFrame}
      pointerEvents={pointerEvents}
      style={style}
    >
      {children}
    </SharedElementView>
  );
}

export function SharedElementView({
  id,
  measurementOnly = false,
  throttle = 16,
  trackFrame = false,
  pointerEvents,
  style,
  children,
}: PropsWithChildren<SharedElementProps & { children: ReactElement }>) {
  const { register, updateElement, updateRect, unregister } =
    useSharedElementRegistry();
  const ancestorTag = useContext(SharedElementHostContext);
  const rect = useSharedValue<SharedElementRect | null>(null);
  const visibility = useSharedValue(1);
  const nodeRef = useRef<SharedElementNode | null>(null);
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
    register(node, children);

    return () => {
      if (nodeRef.current === node) {
        nodeRef.current = null;
      }
      unregister(node);
    };
  }, [id, measurementOnly, rect, register, unregister, visibility]);

  useEffect(() => {
    const node = nodeRef.current;
    if (node) updateElement(node, children);
  }, [children, updateElement]);

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

        updateRect(node, event.nativeEvent);
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
