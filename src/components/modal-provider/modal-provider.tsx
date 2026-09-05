import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';
import { BackHandler, Platform } from 'react-native';
import {
  ModalBackHandlerProvider,
  ModalSetStateProvider,
  ModalStateProvider,
} from '../../context/context';
import { ModalHost } from '../modal-host/modal-host';
import type { IModalComponent } from '../modal/types';

export const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<IModalComponent[]>([]);
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
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        const entries = [...handlers.current.values()].sort(
          (a, b) => b.priority - a.priority || b.order - a.order
        );
        return entries.some(({ handler }) => handler());
      }
    );
    return () => subscription.remove();
  }, []);
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
