import { forwardRef, useImperativeHandle, type PropsWithChildren } from 'react';
import { StyleSheet, type LayoutChangeEvent } from 'react-native';
import type { SharedElementTransitionProps } from 'react-native-epic-shared-element';
import { ModalBridge as Modal } from '../modal-bridge/modal-bridge';
import type { ModalBridgeProps, ModalRef } from '../modal-bridge/modal-bridge';
import { SharedElementTransition } from './shared-element-transition';
import { useSharedElementPresentation } from './use-shared-element-presentation';

export type SharedElementTransitionConfig = Omit<
  SharedElementTransitionProps,
  'children' | 'progress'
> & { key: string };

export type SharedElementModalProps = PropsWithChildren<
  Omit<ModalBridgeProps, 'hidden'> & {
    onLayout?: (event: LayoutChangeEvent) => void;
    transitions?: readonly SharedElementTransitionConfig[];
  }
>;

export type SharedElementModalRef = ModalRef;

/** Modal surface with shared-element transition definitions. */
export const SharedElementModal = forwardRef<ModalRef, SharedElementModalProps>(
  (
    {
      children,
      onLayout,
      style,
      transitions = [],
      animationEnabled = true,
      ...props
    },
    ref
  ) => {
    const { modalRef, measuring, present, dismiss } =
      useSharedElementPresentation(transitions);

    useImperativeHandle(ref, () => ({ present, dismiss }), [dismiss, present]);

    return (
      <Modal
        {...props}
        hidden={measuring}
        animationEnabled={animationEnabled && !measuring}
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
        ({
          key,
          startId,
          endId,
          element,
          clip,
          mode,
          contentType,
          transition,
        }) => {
          return (
            <SharedElementTransition
              key={key}
              startId={startId}
              element={element}
              endId={endId}
              clip={clip}
              mode={mode}
              contentType={contentType}
              transition={transition}
            />
          );
        }
      )}
    </>
  );
}

SharedElementModal.displayName = 'SharedElementModal';
