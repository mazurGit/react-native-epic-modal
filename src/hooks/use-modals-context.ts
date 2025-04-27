import { useContext } from 'react';
import { ModalStateProvider } from '../context/context';

export const useModalsContext = () => {
  return useContext(ModalStateProvider);
};
