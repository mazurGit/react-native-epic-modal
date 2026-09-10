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

export type SharedElementModalProps = PropsWithChildren<
  Omit<ModalBridgeProps, 'hidden' | 'onLayout'> & {
    onLayout?: (event: LayoutChangeEvent) => void;
  }
>;

/** Measures its content once before the modal is presented to the user. */
export const SharedElementModal = forwardRef<ModalRef, SharedElementModalProps>(
  ({ onLayout, ...props }, ref) => {
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
      />
    );
  }
);

SharedElementModal.displayName = 'SharedElementModal';
