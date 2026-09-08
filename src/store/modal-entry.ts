import type { ReactNode } from 'react';

/** A single item rendered by the modal host. */
export interface ModalEntry {
  id: string;
  priority?: number;
  render: () => ReactNode;
}
