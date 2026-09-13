import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type PropsWithChildren,
} from 'react';
import { StyleSheet, type LayoutChangeEvent } from 'react-native';
import type { SharedElementTransitionProps } from 'react-native-epic-shared-element';
import { ModalBridge as Modal } from '../modal-bridge/modal-bridge';
import type { ModalBridgeProps, ModalRef } from '../modal-bridge/modal-bridge';
import { SharedElementTransition } from './shared-element-transition';

export type SharedElementTransitionConfig = Omit<
  SharedElementTransitionProps,
  'children' | 'progress'
> & { key: string };

export type SharedElementModalProps = PropsWithChildren<
  ModalBridgeProps & {
    onLayout?: (event: LayoutChangeEvent) => void;
    transitions?: readonly SharedElementTransitionConfig[];
  }
>;

export type SharedElementModalRef = ModalRef;

/** Modal surface with shared-element transition definitions. */
export const SharedElementModal = forwardRef<ModalRef, SharedElementModalProps>(
  ({ children, onLayout, style, transitions = [], ...props }, ref) => {
    const modalRef = useRef<ModalRef>(null);

    useImperativeHandle(
      ref,
      () => ({
        present: () => modalRef.current?.present(),
        dismiss: () => modalRef.current?.dismiss(),
      }),
      []
    );

    return (
      <Modal
        {...props}
        style={[StyleSheet.absoluteFill, style]}
        onLayout={onLayout}
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
      {transitions.map(
        ({ key, startId, endId, element, clip, mode, transition }) => {
          return (
            <SharedElementTransition
              key={key}
              startId={startId}
              element={element}
              endId={endId}
              clip={clip}
              mode={mode}
              transition={transition}
            />
          );
        }
      )}
    </>
  );
}

SharedElementModal.displayName = 'SharedElementModal';
