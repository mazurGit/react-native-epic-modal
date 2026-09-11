import { useContext, useEffect, useRef, type PropsWithChildren } from 'react';
import type { ReactElement } from 'react';
import { type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
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
  throttle?: number;
  trackFrame?: boolean;
  pointerEvents?: ViewProps['pointerEvents'];
  style?: StyleProp<ViewStyle>;
}

export function SharedElement({
  id,
  throttle = 16,
  trackFrame = false,
  pointerEvents,
  style,
  children,
}: PropsWithChildren<SharedElementProps & { children: ReactElement }>) {
  return (
    <SharedElementView
      id={id}
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
  }, [children, id, rect, register, unregister, visibility]);

  useEffect(() => {
    const node = nodeRef.current;
    if (node) updateElement(node, children);
  }, [children, updateElement]);

  return (
    <AnimatedNativeSharedElement
      collapsable={false}
      pointerEvents={pointerEvents}
      ancestorTag={ancestorTag ?? undefined}
      throttle={throttle}
      trackFrame={trackFrame}
      style={[visibilityStyle, style]}
      onFrame={(event) => {
        const node = nodeRef.current;
        if (!node) return;

        const nextRect = event.nativeEvent;
        if (__DEV__) {
          console.info('[EpicModal][shared-element:frame]', {
            id,
            ancestorTag,
            rect: nextRect,
          });
        }
        updateRect(node, nextRect);
      }}
    >
      {children}
    </AnimatedNativeSharedElement>
  );
}

const AnimatedNativeSharedElement =
  Animated.createAnimatedComponent(NativeSharedElement);
