import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type PropsWithChildren,
} from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ModalView } from '../modal/modal';
import { modalManager } from '../../store/external/modal-manager';

export interface ModalRef {
  present: () => void;
  dismiss: () => void;
}

export type ModalBridgeProps = PropsWithChildren<{
  id: string;
  style?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
}>;

/** Bridges React modal props and ref actions to the external modal manager. */
export const ModalBridge = forwardRef<ModalRef, ModalBridgeProps>(
  ({ id, style, backdropStyle, children }, ref) => {
    const modalProps = useMemo(
      () => ({ style, backdropStyle, children }),
      [backdropStyle, children, style]
    );

    const latestProps = useRef(modalProps);
    latestProps.current = modalProps;

    const render = useCallback(() => {
      const {
        children: currentChildren,
        style: currentStyle,
        backdropStyle: currentBackdropStyle,
      } = latestProps.current;

      return (
        <ModalView style={currentStyle} backdropStyle={currentBackdropStyle}>
          {currentChildren}
        </ModalView>
      );
    }, []);

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
