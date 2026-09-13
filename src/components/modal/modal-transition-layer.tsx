import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ModalTransitionContext,
  type ModalTransitionDescriptor,
} from '../../context/modal-transition-context';
import { SharedElementTransitionView } from '../shared-element-modal/shared-element-transition';

export function ModalTransitionLayer({ children }: PropsWithChildren) {
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
      {children}
      <View pointerEvents="box-none" style={styles.overlay}>
        {transitions.map(({ key, ...transition }) => (
          <SharedElementTransitionView key={key} {...transition} />
        ))}
      </View>
    </ModalTransitionContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFill, zIndex: 1000 },
});
