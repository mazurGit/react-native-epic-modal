import { useContext } from 'react';
import { SharedElementContext } from '../context/shared-element-context';

export const useSharedElementRegistry = () => {
  const registry = useContext(SharedElementContext);
  if (!registry) {
    throw new Error(
      'useSharedElementRegistry must be used inside a ModalProvider'
    );
  }

  return registry;
};
