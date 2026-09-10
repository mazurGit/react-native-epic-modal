import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { StyleSheet, type LayoutChangeEvent } from 'react-native';
import { ModalBridge as Modal } from '../modal-bridge/modal-bridge';
import type { ModalBridgeProps, ModalRef } from '../modal-bridge/modal-bridge';
import { SharedElementTransition } from './shared-element-transition';
import type { SharedElementTransitionConfig } from './types';

export type SharedElementModalProps = PropsWithChildren<
  Omit<ModalBridgeProps, 'hidden' | 'onLayout'> & {
    onLayout?: (event: LayoutChangeEvent) => void;
    transitions?: readonly SharedElementTransitionConfig[];
  }
>;

export type SharedElementModalRef = ModalRef;

/** Measures its content once before the modal is presented to the user. */
export const SharedElementModal = forwardRef<ModalRef, SharedElementModalProps>(
  ({ children, onLayout, style, transitions = [], ...props }, ref) => {
    const modalRef = useRef<ModalRef>(null);
    const hasMeasured = useRef(false);
    const [measuring, setMeasuring] = useState(true);

    const handleLayout = useCallback(
      (event: LayoutChangeEvent) => {
        onLayout?.(event);
        if (hasMeasured.current) return;

        hasMeasured.current = true;
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
        style={[StyleSheet.absoluteFill, style]}
        hidden={measuring}
        keepMounted
        onLayout={handleLayout}
        ref={modalRef}
      >
        <SharedElementModalContent transitions={transitions}>
          {children}
        </SharedElementModalContent>
      </Modal>
    );
  }
);

function SharedElementModalContent({
  children,
  transitions,
}: PropsWithChildren<{
  transitions: readonly SharedElementTransitionConfig[];
}>) {
  return (
    <>
      {children}
      {transitions.map(({ key, startId, endId, element, clip, mode }) => {
        if (!element) {
          return (
            <SharedElementTransition
              key={key}
              startId={startId}
              endId={endId}
              clip={clip}
              mode={mode}
            />
          );
        }

        return (
          <SharedElementTransition
            key={key}
            startId={startId}
            endId={endId}
            clip={clip}
            mode={mode}
          >
            {element}
          </SharedElementTransition>
        );
      })}
    </>
  );
}

SharedElementModal.displayName = 'SharedElementModal';
