import { forwardRef, useEffect, type PropsWithChildren } from 'react';
import type { IModalProps, IModalRef } from './types';
import { useModal } from '../../hooks/hooks';
import { ModalContent } from './modal';

const ModalBridge = forwardRef<IModalRef, PropsWithChildren<IModalProps>>(
  (
    {
      style,
      children,
      name,
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

    useEffect(() => {
      addUpdateModal({
        name,
        node: (
          <ModalContent
            gestureDirection={gestureDirection}
            gestureEnabled={gestureEnabled}
            animation={animation}
            onDismiss={onDismiss}
            onEnter={onEnter}
            name={name}
            style={style}
            priority={priority}
            ref={ref}
            animationConfig={animationConfig}
            gestureConfig={gestureConfig}
            hiddenStatusBar={hiddenStatusBar}
          >
            {children}
          </ModalContent>
        ),
      });
      return () => {
        removeModal(name);
      };
    }, [
      animationConfig,
      gestureDirection,
      gestureEnabled,
      children,
      priority,
      name,
      animation,
      onDismiss,
      onEnter,
      gestureConfig,
      hiddenStatusBar,
      addUpdateModal,
      removeModal,
      style,
      ref,
    ]);

    return null;
  }
);

export { ModalBridge as Modal };
