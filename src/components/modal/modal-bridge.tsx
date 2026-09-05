import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  type PropsWithChildren,
} from 'react';
import type { IModalProps, IModalRef } from './types';
import { useModal } from '../../hooks/hooks';

const ModalBridge = forwardRef<IModalRef, PropsWithChildren<IModalProps>>(
  (
    {
      children,
      name,
      style,
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
    const { addUpdateModal, removeModal } = useModal();
    const instanceId = useId();
    const modalProps = useMemo(
      () => ({
        name,
        children,
        style,
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

    useEffect(() => {
      addUpdateModal({
        id: instanceId,
        props: modalProps,
        ref,
      });
      return () => {
        removeModal(instanceId);
      };
    }, [instanceId, addUpdateModal, removeModal, ref, modalProps]);

    return null;
  }
);

export { ModalBridge as Modal };
