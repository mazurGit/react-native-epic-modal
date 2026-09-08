/** Serializable data describing a modal instance. */
export interface ModalEntry {
  id: string;
  priority?: number;
}

export type ModalEntryUpdate = Partial<Omit<ModalEntry, 'id'>>;

export interface PersistedModalState {
  version: 1;
  entries: Array<ModalEntry & { presentationOrder: number }>;
}
