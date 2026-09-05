import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  type PropsWithChildren,
} from 'react';
import type { IModalProps, IModalRef } from './types';
import { useModal } from '../../hooks/hooks';

const ModalBridge = forwardRef<IModalRef, PropsWithChildren<IModalProps>>(
  (
    {
      children,
      name,
      id,
      style,
      backdropStyle,
      onDismiss,
      onEnter,
      animation,
      gestureDirection,
      gestureEnabled,
      priority = 1,
      animationConfig,
      gestureConfig,
      hiddenStatusBar = false,
    },
    ref
  ) => {
    const { registerModal, updateModal, removeModal } = useModal();
    const instanceId = id ?? name;
    const modalProps = useMemo(
      () => ({
        name,
        children,
        style,
        backdropStyle,
        onDismiss,
        onEnter,
        animation,
        gestureDirection,
        gestureEnabled,
        priority,
        animationConfig,
        gestureConfig,
        hiddenStatusBar,
      }),
      [
        animation,
        animationConfig,
        backdropStyle,
        children,
        gestureConfig,
        gestureDirection,
        gestureEnabled,
        hiddenStatusBar,
        name,
        onDismiss,
        onEnter,
        priority,
        style,
      ]
    );
    const initialModalProps = useRef(modalProps).current;

    useEffect(() => {
      registerModal({
        id: instanceId,
        props: initialModalProps,
        ref,
      });
      return () => {
        removeModal(instanceId);
      };
    }, [initialModalProps, instanceId, registerModal, removeModal, ref]);

    useEffect(() => {
      updateModal(instanceId, modalProps);
    }, [instanceId, modalProps, updateModal]);

    return null;
  }
);

export { ModalBridge as Modal };
