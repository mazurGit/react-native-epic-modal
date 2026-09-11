import { forwardRef, useImperativeHandle, type PropsWithChildren } from 'react';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { ModalView } from './modal-view';
import type { ModalAnimationConfig } from './animation/modal-animation';
import type { ModalGestureConfig } from './gesture/modal-gesture';
import { useModalController } from './controller/use-modal-controller';

export type ModalContentProps = PropsWithChildren<{
  id: string;
  style?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
  animation?: ModalAnimationConfig;
  gestureConfig?: ModalGestureConfig;
  animationEnabled?: boolean;
  hidden?: boolean;
  keepMounted?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
}>;

export interface ModalContentRef {
  present: () => void;
  dismiss: () => void;
}

export const ModalContent = forwardRef<ModalContentRef, ModalContentProps>(
  (
    {
      id,
      children,
      style,
      backdropStyle,
      animation,
      gestureConfig,
      animationEnabled,
      hidden,
      keepMounted = false,
      onLayout,
    },
    ref
  ) => {
    const { visible, exiting, present, dismiss, completeDismiss } =
      useModalController(id);

    useImperativeHandle(ref, () => ({ present, dismiss }), [dismiss, present]);

    if (!visible && !keepMounted) return null;

    return (
      <ModalView
        animation={animation}
        animationEnabled={animationEnabled}
        gestureConfig={gestureConfig}
        visible={visible}
        exiting={exiting}
        onExitComplete={completeDismiss}
        onDismissRequest={dismiss}
        hidden={hidden || !visible}
        onLayout={onLayout}
        style={style}
        backdropStyle={backdropStyle}
      >
        {children}
      </ModalView>
    );
  }
);

ModalContent.displayName = 'ModalContent';
