import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';
import {
  ModalBackHandlerProvider,
  ModalSetStateProvider,
  ModalStateProvider,
} from '../../context/context';
import { useAndroidBackHandler } from '../../hooks/use-android-back-handler';
import { ModalHost } from '../modal-host/modal-host';
import type { IModalRegistry } from '../modal/types';

export const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<IModalRegistry>({
    byId: {},
    order: [],
  });
  const handlers = useRef(
    new Map<
      string,
      { priority: number; order: number; handler: () => boolean }
    >()
  );
  const order = useRef(0);
  const registerBackHandler = useCallback(
    (id: string, priority: number, handler: () => boolean) => {
      const entry = { priority, order: order.current++, handler };
      handlers.current.set(id, entry);
      return () => {
        if (handlers.current.get(id) === entry) handlers.current.delete(id);
      };
    },
    []
  );
  const onBackPress = useCallback(() => {
    const entries = [...handlers.current.values()].sort(
      (a, b) => b.priority - a.priority || b.order - a.order
    );
    return entries.some(({ handler }) => handler());
  }, []);
  useAndroidBackHandler(onBackPress);
  const backHandlerContext = useMemo(
    () => ({ register: registerBackHandler }),
    [registerBackHandler]
  );
  return (
    <ModalSetStateProvider.Provider value={setState}>
      <ModalStateProvider.Provider value={state}>
        <ModalBackHandlerProvider.Provider value={backHandlerContext}>
          {children}
          <ModalHost />
        </ModalBackHandlerProvider.Provider>
      </ModalStateProvider.Provider>
    </ModalSetStateProvider.Provider>
  );
};
