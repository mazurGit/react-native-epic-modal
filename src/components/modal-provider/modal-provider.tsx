import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import type { ReactElement } from 'react';
import { ModalHost } from '../modal-host/modal-host';
import { SharedElementContext } from '../../context/shared-element-context';
import type {
  SharedElementNode,
  SharedElementRect,
} from '../shared-element/types';

export type ModalProviderProps = PropsWithChildren;

/** Provides the app-level modal integration point and mounts the modal host. */
export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [sharedElementState, setSharedElementState] = useState(() => ({
    revision: 0,
  }));
  const sharedElementNodes = useRef(new Map<string, SharedElementNode>());
  const sharedElementElements = useRef(new Map<string, ReactElement>());
  const registerSharedElement = useCallback(
    (node: SharedElementNode, element: ReactElement) => {
      const nodeKey = `${node.id}:${node.measurementOnly ? 'measurement' : 'content'}`;
      const existing = sharedElementNodes.current.get(nodeKey);
      if (existing && existing !== node) return;

      sharedElementNodes.current.set(nodeKey, node);
      setSharedElementState((current) => ({ revision: current.revision + 1 }));
      sharedElementElements.current.set(nodeKey, element);
    },
    []
  );
  const updateSharedElement = useCallback(
    (node: SharedElementNode, element: ReactElement) => {
      const nodeKey = `${node.id}:${node.measurementOnly ? 'measurement' : 'content'}`;
      if (sharedElementNodes.current.get(nodeKey) === node) {
        sharedElementElements.current.set(nodeKey, element);
      }
    },
    []
  );
  const updateSharedElementRect = useCallback(
    (node: SharedElementNode, rect: SharedElementRect) => {
      const nodeKey = `${node.id}:${node.measurementOnly ? 'measurement' : 'content'}`;
      if (sharedElementNodes.current.get(nodeKey) === node)
        node.rect.value = rect;
    },
    []
  );
  const unregisterSharedElement = useCallback((node: SharedElementNode) => {
    const nodeKey = `${node.id}:${node.measurementOnly ? 'measurement' : 'content'}`;
    if (sharedElementNodes.current.get(nodeKey) !== node) return;

    sharedElementNodes.current.delete(nodeKey);
    sharedElementElements.current.delete(nodeKey);
    setSharedElementState((current) => ({ revision: current.revision + 1 }));
  }, []);
  const sharedElementContext = useMemo(
    () => ({
      get: (id: string, measurementOnly = false) =>
        sharedElementNodes.current.get(
          `${id}:${measurementOnly ? 'measurement' : 'content'}`
        ),
      getElement: (id: string, measurementOnly = false) =>
        sharedElementElements.current.get(
          `${id}:${measurementOnly ? 'measurement' : 'content'}`
        ),
      register: registerSharedElement,
      updateElement: updateSharedElement,
      updateRect: updateSharedElementRect,
      unregister: unregisterSharedElement,
      revision: sharedElementState.revision,
    }),
    [
      registerSharedElement,
      sharedElementState.revision,
      unregisterSharedElement,
      updateSharedElement,
      updateSharedElementRect,
    ]
  );

  return (
    <SharedElementContext.Provider value={sharedElementContext}>
      {children}
      <ModalHost />
    </SharedElementContext.Provider>
  );
};
