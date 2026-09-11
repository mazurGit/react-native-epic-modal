import { createContext } from 'react';
import type {
  SharedElementNode,
  SharedElementRect,
} from '../components/shared-element/types';
import type { ReactElement } from 'react';

export type SharedElementReadyCallback = () => void;

export interface SharedElementRegistryValue {
  get: (id: string) => SharedElementNode | undefined;
  getElement: (id: string) => ReactElement | undefined;
  register: (node: SharedElementNode, element: ReactElement) => void;
  updateElement: (node: SharedElementNode, element: ReactElement) => void;
  updateRect: (node: SharedElementNode, rect: SharedElementRect) => void;
  waitForStableRects: (
    ids: readonly string[],
    callback: SharedElementReadyCallback
  ) => () => void;
  unregister: (node: SharedElementNode) => void;
  revision: number;
}

export const SharedElementContext =
  createContext<SharedElementRegistryValue | null>(null);
