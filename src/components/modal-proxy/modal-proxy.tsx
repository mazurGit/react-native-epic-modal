import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
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

export type ModalProxyProps = PropsWithChildren<{
  id: string;
  priority?: number;
  style?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
}>;

/** Connects a modal component to the external modal manager. */
export const ModalProxy = forwardRef<ModalRef, ModalProxyProps>(
  ({ id, priority, style, backdropStyle, children }, ref) => {
    const latestProps = useRef({ priority });
    latestProps.current = { priority };

    const render = useCallback(
      () => (
        <ModalView style={style} backdropStyle={backdropStyle}>
          {children}
        </ModalView>
      ),
      [backdropStyle, children, style]
    );

    useEffect(() => modalManager.register({ id, render }), [id, render]);

    useEffect(() => {
      modalManager.update(id, { priority });
    }, [id, priority]);

    useImperativeHandle(
      ref,
      () => ({
        present: () => {
          modalManager.present({
            id,
            priority: latestProps.current.priority,
          });
        },
        dismiss: () => modalManager.dismiss(id),
      }),
      [id]
    );

    return null;
  }
);

ModalProxy.displayName = 'ModalProxy';
