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
import { modalManager } from '../../store/external/modal-manager';

export interface ModalRef {
  present: () => void;
  dismiss: () => void;
}

export type ModalBridgeProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
  animation?: ModalAnimationConfig;
}>;

/** Bridges React modal props and ref actions to the external modal manager. */
export const ModalBridge = forwardRef<ModalRef, ModalBridgeProps>(
  ({ style, backdropStyle, animation, children }, ref) => {
    const id = useId();
    const modalProps = useMemo(
      () => ({ style, backdropStyle, animation, children }),
      [animation, backdropStyle, children, style]
    );

    const latestProps = useRef(modalProps);
    latestProps.current = modalProps;

    const render = useCallback(() => {
      const {
        children: currentChildren,
        style: currentStyle,
        backdropStyle: currentBackdropStyle,
        animation: currentAnimation,
      } = latestProps.current;

      return (
        <ModalView
          animation={currentAnimation}
          exiting={modalManager.isExiting(id)}
          onExitComplete={() => modalManager.completeDismiss(id)}
          style={currentStyle}
          backdropStyle={currentBackdropStyle}
        >
          {currentChildren}
        </ModalView>
      );
    }, [id]);

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
