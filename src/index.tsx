export { ModalHost } from './components/modal-host/modal-host';
export type { ModalHostProps } from './components/modal-host/modal-host';
export { ModalBridge as Modal } from './components/modal-bridge/modal-bridge';
export { SharedElementModal } from './components/shared-element/shared-element-modal';
export { SharedElementHost } from './components/shared-element/shared-element-host';
export { SharedElement } from './components/shared-element/shared-element';
export { SharedElementTransition } from './components/shared-element/shared-element-transition';
export type {
  ModalBridgeProps as ModalProps,
  ModalRef,
} from './components/modal-bridge/modal-bridge';
export type { SharedElementModalProps } from './components/shared-element/shared-element-modal';
export type { SharedElementModalRef } from './components/shared-element/shared-element-modal';
export type { SharedElementHostProps } from './components/shared-element/shared-element-host';
export type { SharedElementProps } from './components/shared-element/shared-element';
export type { SharedElementTransitionProps } from './components/shared-element/types';
export type { SharedElementTransitionConfig } from './components/shared-element/types';
export type {
  SharedElementNode,
  SharedElementRect,
} from './components/shared-element/types';
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
