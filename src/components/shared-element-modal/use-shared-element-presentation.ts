import { useCallback, useEffect, useRef, useState } from 'react';
import { useSharedElementRegistry } from 'react-native-epic-shared-element';
import type { ModalRef } from '../modal-bridge/modal-bridge';
import { waitForSharedElements } from './wait-for-shared-elements';

type TransitionEndpoints = { startId: string; endId: string };

export const DEFAULT_MEASUREMENT_TIMEOUT = 1000;

function useMeasurementIds(
  transitions: readonly TransitionEndpoints[]
): readonly string[] {
  const ids = [
    ...new Set(transitions.flatMap(({ startId, endId }) => [startId, endId])),
  ].sort();
  const stableIds = useRef(ids);

  if (
    ids.length !== stableIds.current.length ||
    ids.some((id, index) => id !== stableIds.current[index])
  ) {
    stableIds.current = ids;
  }

  return stableIds.current;
}

export function useSharedElementPresentation(
  transitions: readonly TransitionEndpoints[],
  measurementTimeout: number,
  onMeasurementTimeout?: (ids: readonly string[]) => void
) {
  const modalRef = useRef<ModalRef>(null);
  const { waitForStableRects } = useSharedElementRegistry();
  const [measuring, setMeasuring] = useState(false);
  const [transitionsEnabled, setTransitionsEnabled] = useState(false);
  const presentationRequested = useRef(false);
  const onMeasurementTimeoutRef = useRef(onMeasurementTimeout);
  onMeasurementTimeoutRef.current = onMeasurementTimeout;
  const measurementIds = useMeasurementIds(transitions);

  useEffect(() => {
    if (!measuring || !presentationRequested.current) return;

    const finishMeasurement = (ready: boolean) => {
      if (!presentationRequested.current) return;
      presentationRequested.current = false;
      setTransitionsEnabled(ready);
      setMeasuring(false);
    };
    const cancelWait = waitForSharedElements(
      waitForStableRects,
      measurementIds,
      measurementTimeout,
      () => finishMeasurement(true),
      () => {
        onMeasurementTimeoutRef.current?.(measurementIds);
        finishMeasurement(false);
      }
    );
    const frame = requestAnimationFrame(() => modalRef.current?.present());

    return () => {
      cancelAnimationFrame(frame);
      cancelWait();
    };
  }, [measurementIds, measurementTimeout, measuring, waitForStableRects]);

  const present = useCallback(() => {
    presentationRequested.current = true;
    setTransitionsEnabled(false);
    setMeasuring(true);
  }, []);

  const dismiss = useCallback(() => {
    presentationRequested.current = false;
    setMeasuring(false);
    modalRef.current?.dismiss();
  }, []);

  return { modalRef, measuring, transitionsEnabled, present, dismiss };
}
