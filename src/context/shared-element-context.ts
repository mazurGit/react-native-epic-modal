import { createContext } from 'react';
import type {
  SharedElementNode,
  SharedElementRect,
} from '../components/shared-element/types';
import type { ReactElement } from 'react';

export interface SharedElementRegistryValue {
  get: (id: string, measurementOnly?: boolean) => SharedElementNode | undefined;
  getElement: (
    id: string,
    measurementOnly?: boolean
  ) => ReactElement | undefined;
  register: (node: SharedElementNode, element: ReactElement) => void;
  updateElement: (node: SharedElementNode, element: ReactElement) => void;
  updateRect: (node: SharedElementNode, rect: SharedElementRect) => void;
  unregister: (node: SharedElementNode) => void;
  revision: number;
}

export const SharedElementContext =
  createContext<SharedElementRegistryValue | null>(null);
