import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useId,
  useMemo,
  useRef,
  type PropsWithChildren,
} from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ModalView } from '../modal/modal';
import type { ModalAnimationConfig } from '../modal/modal-animation';
import type { ModalGestureConfig } from '../modal/modal-gesture';
import { modalManager } from '../../store/external/modal-manager';

export interface ModalRef {
  present: () => void;
  dismiss: () => void;
}

export type ModalBridgeProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
  animation?: ModalAnimationConfig;
  gestureConfig?: ModalGestureConfig;
}>;

/** Bridges React modal props and ref actions to the external modal manager. */
export const ModalBridge = forwardRef<ModalRef, ModalBridgeProps>(
  ({ style, backdropStyle, animation, gestureConfig, children }, ref) => {
    const id = useId();
    const modalProps = useMemo(
      () => ({ style, backdropStyle, animation, gestureConfig, children }),
      [animation, backdropStyle, children, gestureConfig, style]
    );

    const latestProps = useRef(modalProps);
    latestProps.current = modalProps;

    const dismiss = useCallback(() => modalManager.dismiss(id), [id]);
    const completeDismiss = useCallback(
      () => modalManager.completeDismiss(id),
      [id]
    );

    const render = useCallback(() => {
      const {
        children: currentChildren,
        style: currentStyle,
        backdropStyle: currentBackdropStyle,
        animation: currentAnimation,
        gestureConfig: currentGestureConfig,
      } = latestProps.current;

      return (
        <ModalView
          animation={currentAnimation}
          gestureConfig={currentGestureConfig}
          exiting={modalManager.isExiting(id)}
          onExitComplete={completeDismiss}
          onDismissRequest={dismiss}
          style={currentStyle}
          backdropStyle={currentBackdropStyle}
        >
          {currentChildren}
        </ModalView>
      );
    }, [completeDismiss, dismiss, id]);

    useEffect(() => modalManager.register({ id, render }), [id, render]);

    useEffect(() => {
      modalManager.notify(id);
    }, [id, modalProps]);

    useImperativeHandle(
      ref,
      () => ({
        present: () => {
          modalManager.present({
            id,
          });
        },
        dismiss: () => modalManager.dismiss(id),
      }),
      [id]
    );

    return null;
  }
);

ModalBridge.displayName = 'ModalBridge';
