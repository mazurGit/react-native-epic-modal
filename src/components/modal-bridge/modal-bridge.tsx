import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useId,
  useMemo,
  useRef,
  type PropsWithChildren,
} from 'react';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import type { ModalContentRef } from '../modal/modal-content';
import type { ModalAnimationConfig } from '../modal/animation/modal-animation';
import type { ModalGestureConfig } from '../modal/gesture/modal-gesture';
import { modalManager } from '../../store/modal-manager';

export interface ModalRef {
  present: () => void;
  dismiss: () => void;
}

export type ModalBridgeProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
  animation?: ModalAnimationConfig;
  gestureConfig?: ModalGestureConfig;
  hidden?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
}>;

/** Bridges React modal props and ref actions to the external modal manager. */
export const ModalBridge = forwardRef<ModalRef, ModalBridgeProps>(
  (
    {
      style,
      backdropStyle,
      animation,
      gestureConfig,
      hidden,
      onLayout,
      children,
    },
    ref
  ) => {
    const id = useId();
    const modalProps = useMemo(
      () => ({
        style,
        backdropStyle,
        animation,
        gestureConfig,
        hidden,
        onLayout,
        children,
      }),
      [
        animation,
        backdropStyle,
        children,
        gestureConfig,
        hidden,
        onLayout,
        style,
      ]
    );

    const contentRef = useRef<ModalContentRef>(null);

    useEffect(
      () => modalManager.register({ id, props: modalProps, ref: contentRef }),
      [id, modalProps]
    );

    useImperativeHandle(
      ref,
      () => ({
        present: () => {
          contentRef.current?.present();
        },
        dismiss: () => contentRef.current?.dismiss(),
      }),
      []
    );

    return null;
  }
);

ModalBridge.displayName = 'ModalBridge';
