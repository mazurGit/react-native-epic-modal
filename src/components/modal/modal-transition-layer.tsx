import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ModalTransitionContext,
  type ModalMeasurementDescriptor,
  type ModalTransitionDescriptor,
} from '../../context/modal-transition-context';
import { SharedElementView } from '../shared-element/shared-element';
import { SharedElementTransitionView } from '../shared-element/shared-element-transition';

export function ModalTransitionLayer({ children }: PropsWithChildren) {
  const [transitions, setTransitions] = useState<ModalTransitionDescriptor[]>(
    []
  );
  const [measurements, setMeasurements] = useState<
    ModalMeasurementDescriptor[]
  >([]);
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
  const registerMeasurement = useCallback(
    (measurement: ModalMeasurementDescriptor) => {
      setMeasurements((current) => {
        const index = current.findIndex(({ key }) => key === measurement.key);
        if (index === -1) return [...current, measurement];
        const next = current.slice();
        next[index] = measurement;
        return next;
      });
    },
    []
  );
  const unregisterMeasurement = useCallback((key: string) => {
    setMeasurements((current) =>
      current.filter((measurement) => measurement.key !== key)
    );
  }, []);
  const context = useMemo(
    () => ({
      register,
      unregister,
      registerMeasurement,
      unregisterMeasurement,
    }),
    [register, registerMeasurement, unregister, unregisterMeasurement]
  );

  return (
    <ModalTransitionContext.Provider value={context}>
      {children}
      <View pointerEvents="box-none" style={styles.overlay}>
        {measurements.map(({ key, ...measurement }) => (
          <SharedElementView key={key} {...measurement} measurementOnly />
        ))}
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
