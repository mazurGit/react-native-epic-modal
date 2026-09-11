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
import type { SharedElementReadyCallback } from '../../context/shared-element-context';

interface SharedElementRectWaiter {
  ids: Set<string>;
  rects: Map<string, SharedElementRect>;
  revision: number;
  stabilityFrame?: number;
  callback: SharedElementReadyCallback;
}

export type ModalProviderProps = PropsWithChildren;

/** Provides the app-level modal integration point and mounts the modal host. */
export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [sharedElementState, setSharedElementState] = useState(() => ({
    revision: 0,
  }));
  const sharedElementNodes = useRef(new Map<string, SharedElementNode>());
  const sharedElementElements = useRef(new Map<string, ReactElement>());
  const sharedElementRectWaiters = useRef(new Set<SharedElementRectWaiter>());
  const registerSharedElement = useCallback(
    (node: SharedElementNode, element: ReactElement) => {
      const nodeKey = node.id;
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
      const nodeKey = node.id;
      if (sharedElementNodes.current.get(nodeKey) === node) {
        sharedElementElements.current.set(nodeKey, element);
      }
    },
    []
  );
  const updateSharedElementRect = useCallback(
    (node: SharedElementNode, rect: SharedElementRect) => {
      const nodeKey = node.id;
      if (sharedElementNodes.current.get(nodeKey) === node)
        node.rect.value = rect;
      sharedElementRectWaiters.current.forEach((waiter) => {
        if (!waiter.ids.has(node.id)) return;

        const previous = waiter.rects.get(node.id);
        waiter.rects.set(node.id, rect);
        if (
          previous?.x !== rect.x ||
          previous.y !== rect.y ||
          previous.width !== rect.width ||
          previous.height !== rect.height
        ) {
          waiter.revision += 1;
        }

        if (![...waiter.ids].every((id) => waiter.rects.has(id))) return;
        if (waiter.stabilityFrame !== undefined) {
          cancelAnimationFrame(waiter.stabilityFrame);
        }

        const revision = waiter.revision;
        waiter.stabilityFrame = requestAnimationFrame(() => {
          waiter.stabilityFrame = requestAnimationFrame(() => {
            waiter.stabilityFrame = undefined;
            if (revision !== waiter.revision) return;
            sharedElementRectWaiters.current.delete(waiter);
            waiter.callback();
          });
        });
      });
    },
    []
  );
  const waitForStableRects = useCallback(
    (ids: readonly string[], callback: SharedElementReadyCallback) => {
      const waiter: SharedElementRectWaiter = {
        ids: new Set(ids),
        rects: new Map(),
        revision: 0,
        callback,
      };
      sharedElementRectWaiters.current.add(waiter);
      return () => {
        sharedElementRectWaiters.current.delete(waiter);
        if (waiter.stabilityFrame !== undefined) {
          cancelAnimationFrame(waiter.stabilityFrame);
        }
      };
    },
    []
  );
  const unregisterSharedElement = useCallback((node: SharedElementNode) => {
    const nodeKey = node.id;
    if (sharedElementNodes.current.get(nodeKey) !== node) return;

    sharedElementNodes.current.delete(nodeKey);
    sharedElementElements.current.delete(nodeKey);
    setSharedElementState((current) => ({ revision: current.revision + 1 }));
  }, []);
  const sharedElementContext = useMemo(
    () => ({
      get: (id: string) => sharedElementNodes.current.get(id),
      getElement: (id: string) => sharedElementElements.current.get(id),
      register: registerSharedElement,
      updateElement: updateSharedElement,
      updateRect: updateSharedElementRect,
      waitForStableRects,
      unregister: unregisterSharedElement,
      revision: sharedElementState.revision,
    }),
    [
      registerSharedElement,
      sharedElementState.revision,
      unregisterSharedElement,
      updateSharedElement,
      updateSharedElementRect,
      waitForStableRects,
    ]
  );

  return (
    <SharedElementContext.Provider value={sharedElementContext}>
      {children}
      <ModalHost />
    </SharedElementContext.Provider>
  );
};
