import { useContext } from 'react';
import { ModalProgressContext } from '../context/modal-progress-context';

/** Returns the shared transition progress of the nearest modal. */
export const useModalProgress = () => {
  const progress = useContext(ModalProgressContext);

  if (!progress) {
    throw new Error('useModalProgress must be used inside a Modal component');
  }

  return progress;
};
