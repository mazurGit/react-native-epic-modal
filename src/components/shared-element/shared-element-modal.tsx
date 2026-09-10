import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { ModalBridge as Modal } from '../modal-bridge/modal-bridge';
import type { ModalBridgeProps, ModalRef } from '../modal-bridge/modal-bridge';
import { SharedElementHost } from './shared-element-host';

export type SharedElementModalProps = PropsWithChildren<
  Omit<ModalBridgeProps, 'hidden' | 'onLayout'> & {
    onLayout?: (event: LayoutChangeEvent) => void;
  }
>;

export type SharedElementModalRef = ModalRef;

/** Measures its content once before the modal is presented to the user. */
export const SharedElementModal = forwardRef<ModalRef, SharedElementModalProps>(
  ({ children, onLayout, ...props }, ref) => {
    const modalRef = useRef<ModalRef>(null);
    const hasMeasured = useRef(false);
    const [measuring, setMeasuring] = useState(true);

    useEffect(() => {
      modalRef.current?.present();
    }, []);

    const handleLayout = useCallback(
      (event: LayoutChangeEvent) => {
        onLayout?.(event);
        if (hasMeasured.current) return;

        hasMeasured.current = true;
        modalRef.current?.dismiss();
      },
      [onLayout]
    );

    useImperativeHandle(
      ref,
      () => ({
        present: () => {
          setMeasuring(false);
          modalRef.current?.present();
        },
        dismiss: () => modalRef.current?.dismiss(),
      }),
      []
    );

    return (
      <Modal
        {...props}
        hidden={measuring}
        onLayout={handleLayout}
        ref={modalRef}
      >
        <SharedElementHost>{children}</SharedElementHost>
      </Modal>
    );
  }
);

SharedElementModal.displayName = 'SharedElementModal';
