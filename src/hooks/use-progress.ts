import { useContext } from 'react';
import { ModalProgressContext } from '../context/modal-progress-context';

export const useProgress = () => {
  const progress = useContext(ModalProgressContext);
  if (!progress) {
    throw new Error('useProgress must be used inside a Modal component');
  }

  return progress;
};
