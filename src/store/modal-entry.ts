export type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };

/** Serializable data describing a modal instance. */
export interface ModalEntry {
  id: string;
  priority?: number;
  params?: { [key: string]: JsonValue };
}

export interface PersistedModalState {
  version: 1;
  entries: Array<ModalEntry & { presentationOrder: number }>;
}
