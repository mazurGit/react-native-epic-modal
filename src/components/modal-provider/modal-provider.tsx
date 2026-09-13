import type { PropsWithChildren } from 'react';
import { SharedElementProvider } from 'react-native-epic-shared-element';
import { ModalHost } from '../modal-host/modal-host';

export type ModalProviderProps = PropsWithChildren;

/** Provides the app-level modal integration point and mounts the modal host. */
export const ModalProvider = ({ children }: ModalProviderProps) => {
  return (
    <SharedElementProvider>
      {children}
      <ModalHost />
    </SharedElementProvider>
  );
};
