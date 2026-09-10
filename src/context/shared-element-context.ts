import { createContext } from 'react';
import type {
  SharedElementNode,
  SharedElementRect,
} from '../components/shared-element/types';

export interface SharedElementRegistryValue {
  get: (id: string, measurementOnly?: boolean) => SharedElementNode | undefined;
  register: (node: SharedElementNode) => void;
  updateRect: (node: SharedElementNode, rect: SharedElementRect) => void;
  unregister: (node: SharedElementNode) => void;
  revision: number;
}

export const SharedElementContext =
  createContext<SharedElementRegistryValue | null>(null);
