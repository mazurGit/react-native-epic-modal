export { ModalHost } from './components/modal-host/modal-host';
export type { ModalHostProps } from './components/modal-host/modal-host';
export { ModalBridge as Modal } from './components/modal-bridge/modal-bridge';
export type {
  ModalBridgeProps as ModalProps,
  ModalRef,
} from './components/modal-bridge/modal-bridge';
export type {
  ModalAnimationConfig,
  ModalEnteringAnimationPreset,
  ModalExitingAnimationPreset,
  ModalAnimationPreset,
} from './components/modal/animation/modal-animation';
export type {
  ModalGestureConfig,
  ModalGestureDismissBehavior,
  ModalGestureEdge,
} from './components/modal/gesture/modal-gesture';
export { ModalProvider } from './components/modal-provider/modal-provider';
export type { ModalProviderProps } from './components/modal-provider/modal-provider';
export { modalManager } from './store/modal-manager';
export { useModalProgress } from './hooks/use-modal-progress';
