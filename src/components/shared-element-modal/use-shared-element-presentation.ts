import { useCallback, useEffect, useRef, useState } from 'react';
import { useSharedElementRegistry } from 'react-native-epic-shared-element';
import type { ModalRef } from '../modal-bridge/modal-bridge';

type TransitionEndpoints = { startId: string; endId: string };

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
  transitions: readonly TransitionEndpoints[]
) {
  const modalRef = useRef<ModalRef>(null);
  const { waitForStableRects } = useSharedElementRegistry();
  const [measuring, setMeasuring] = useState(false);
  const presentationRequested = useRef(false);
  const measurementIds = useMeasurementIds(transitions);

  useEffect(() => {
    if (!measuring || !presentationRequested.current) return;

    const cancelWait = waitForStableRects(measurementIds, () => {
      if (!presentationRequested.current) return;
      presentationRequested.current = false;
      setMeasuring(false);
    });
    const frame = requestAnimationFrame(() => modalRef.current?.present());

    return () => {
      cancelAnimationFrame(frame);
      cancelWait();
    };
  }, [measurementIds, measuring, waitForStableRects]);

  const present = useCallback(() => {
    presentationRequested.current = true;
    setMeasuring(true);
  }, []);

  const dismiss = useCallback(() => {
    presentationRequested.current = false;
    setMeasuring(false);
    modalRef.current?.dismiss();
  }, []);

  return { modalRef, measuring, present, dismiss };
}
