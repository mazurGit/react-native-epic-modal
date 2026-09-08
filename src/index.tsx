export { ModalHost } from './components/modal-host/modal-host';
export type { ModalHostProps } from './components/modal-host/modal-host';
export { ModalBridge as Modal } from './components/modal-bridge/modal-bridge';
export type {
  ModalBridgeProps as ModalProps,
  ModalRef,
} from './components/modal-bridge/modal-bridge';
export type {
  ModalAnimationConfig,
  ModalAnimationPreset,
} from './components/modal/modal-animation';
export { ModalProvider } from './components/modal-provider/modal-provider';
export type { ModalProviderProps } from './components/modal-provider/modal-provider';
export type { ModalEntry } from './store/modal-entry';
export { modalManager } from './store/external/modal-manager';
export { useModalProgress } from './hooks/use-modal-progress';
