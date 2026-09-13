import {
  useContext,
  useEffect,
  useRef,
  type ComponentProps,
  type PropsWithChildren,
} from 'react';
import {
  SharedElementTransition as SharedElementTransitionPrimitive,
  type SharedElementTransitionProps as PrimitiveTransitionProps,
} from 'react-native-epic-shared-element';
import { ModalProgressContext } from '../../context/modal-progress-context';
import { ModalTransitionContext } from '../../context/modal-transition-context';
export type SharedElementTransitionProps = Omit<
  PrimitiveTransitionProps,
  'progress'
>;

/** Connects the modal progress value to the standalone shared-element package. */
export function SharedElementTransition({
  startId,
  endId,
  children,
  element,
  clip = true,
  mode = 'zoom',
  transition,
}: PropsWithChildren<SharedElementTransitionProps>) {
  const progress = useContext(ModalProgressContext);
  const transitionContext = useContext(ModalTransitionContext);
  const transitionKey = useRef(`transition-${Math.random()}`);

  if (!progress) {
    throw new Error(
      'SharedElementTransition must be rendered inside a Modal component'
    );
  }

  useEffect(() => {
    if (!transitionContext) return;

    const key = transitionKey.current;
    transitionContext.register({
      key,
      startId,
      endId,
      children: element ?? children,
      clip,
      mode,
      transition,
      progress,
    });

    return () => transitionContext.unregister(key);
  }, [
    children,
    clip,
    element,
    endId,
    mode,
    progress,
    startId,
    transition,
    transitionContext,
  ]);

  if (transitionContext) return null;

  return (
    <SharedElementTransitionPrimitive
      startId={startId}
      endId={endId}
      element={element}
      clip={clip}
      mode={mode}
      transition={transition}
      progress={progress}
    >
      {children}
    </SharedElementTransitionPrimitive>
  );
}

export function SharedElementTransitionView(
  props: SharedElementTransitionProps & {
    progress: ComponentProps<
      typeof SharedElementTransitionPrimitive
    >['progress'];
  }
) {
  const {
    startId,
    endId,
    children,
    element,
    clip = true,
    mode = 'zoom',
    transition,
    progress,
  } = props;

  return (
    <SharedElementTransitionPrimitive
      startId={startId}
      endId={endId}
      element={element}
      clip={clip}
      mode={mode}
      transition={transition}
      progress={progress}
    >
      {children}
    </SharedElementTransitionPrimitive>
  );
}
