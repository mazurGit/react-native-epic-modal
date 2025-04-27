import { useState, type FC, type PropsWithChildren } from 'react';
import {
  ModalSetStateProvider,
  ModalStateProvider,
} from '../../context/context';
import { ModalHost } from '../modal-host/modal-host';
import type { IModalComponent } from '../modal/types';

export const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<IModalComponent[]>([]);
  return (
    <ModalSetStateProvider.Provider value={setState}>
      <ModalStateProvider.Provider value={state}>
        {children}
        <ModalHost />
      </ModalStateProvider.Provider>
    </ModalSetStateProvider.Provider>
  );
};
