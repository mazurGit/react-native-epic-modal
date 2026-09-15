import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { SharedElementTransitionLayer } from 'react-native-epic-shared-element';
import {
  ModalTransitionContext,
  type ModalTransitionDescriptor,
} from '../../context/modal-transition-context';

export function ModalTransitionLayer({
  active,
  children,
}: PropsWithChildren<{ active: boolean }>) {
  const [transitions, setTransitions] = useState<ModalTransitionDescriptor[]>(
    []
  );
  const register = useCallback((transition: ModalTransitionDescriptor) => {
    setTransitions((current) => {
      const index = current.findIndex(({ key }) => key === transition.key);
      if (index === -1) return [...current, transition];
      const next = current.slice();
      next[index] = transition;
      return next;
    });
  }, []);
  const unregister = useCallback((key: string) => {
    setTransitions((current) =>
      current.filter((transition) => transition.key !== key)
    );
  }, []);
  const context = useMemo(
    () => ({ register, unregister }),
    [register, unregister]
  );

  return (
    <ModalTransitionContext.Provider value={context}>
      <SharedElementTransitionLayer
        active={active}
        transitions={transitions}
        style={styles.overlay}
      >
        {children}
      </SharedElementTransitionLayer>
    </ModalTransitionContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: { zIndex: 1000 },
});
