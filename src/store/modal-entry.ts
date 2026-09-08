/** Serializable data describing a modal instance. */
export interface ModalEntry {
  id: string;
}

export interface PersistedModalState {
  version: 1;
  entries: Array<ModalEntry & { presentationOrder: number }>;
}
