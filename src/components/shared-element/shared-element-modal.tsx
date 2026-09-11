import {
  forwardRef,
  useCallback,
  useEffect,
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
import { useSharedElementRegistry } from '../../hooks/use-shared-element-registry';

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
    const { waitForStableRects } = useSharedElementRegistry();
    const presentationRequested = useRef(false);
    const [measuring, setMeasuring] = useState(false);

    useEffect(() => {
      if (!measuring || !presentationRequested.current) return;

      const releaseWhenReady = () => {
        if (!presentationRequested.current) return;
        presentationRequested.current = false;
        setMeasuring(false);
      };

      const unsubscribe = waitForStableRects(
        transitions.map(({ endId }) => endId),
        releaseWhenReady
      );

      const frame = requestAnimationFrame(() => {
        modalRef.current?.present();
      });

      return () => {
        cancelAnimationFrame(frame);
        unsubscribe();
      };
    }, [measuring, transitions, waitForStableRects]);

    const handleLayout = useCallback(
      (event: LayoutChangeEvent) => {
        onLayout?.(event);
        if (
          !presentationRequested.current ||
          !measuring ||
          transitions.length > 0
        )
          return;

        requestAnimationFrame(() => {
          presentationRequested.current = false;
          setMeasuring(false);
        });
      },
      [measuring, onLayout, transitions.length]
    );

    useImperativeHandle(
      ref,
      () => ({
        present: () => {
          presentationRequested.current = true;
          setMeasuring(true);
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
        animationEnabled={!measuring}
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
