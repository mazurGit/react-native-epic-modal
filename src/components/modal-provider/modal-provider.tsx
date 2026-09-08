import type { PropsWithChildren, ReactNode } from 'react';
import type { ModalEntry } from '../../store/modal-entry';
import { ModalHost } from '../modal-host/modal-host';

export type ModalProviderProps = PropsWithChildren<{
  renderEntry: (entry: ModalEntry) => ReactNode;
}>;

/** Provides the app-level modal integration point and mounts the modal host. */
export const ModalProvider = ({
  children,
  renderEntry,
}: ModalProviderProps) => {
  return (
    <>
      {children}
      <ModalHost renderEntry={renderEntry} />
    </>
  );
};
