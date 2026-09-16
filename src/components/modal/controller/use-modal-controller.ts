import { useCallback, useState } from 'react';
import { modalManager } from '../../../store/modal-manager';

export const useModalController = (id: string) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const present = useCallback(() => {
    setExiting(false);
    setVisible(true);
    modalManager.present(id);
  }, [id]);

  const dismiss = useCallback(() => {
    if (!visible || exiting) return;
    setExiting(true);
  }, [exiting, visible]);

  const completeDismiss = useCallback(() => {
    setVisible(false);
    setExiting(false);
  }, []);

  return { visible, exiting, present, dismiss, completeDismiss };
};
