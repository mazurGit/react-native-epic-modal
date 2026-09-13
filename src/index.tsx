export { ModalHost } from './components/modal-host/modal-host';
export type { ModalHostProps } from './components/modal-host/modal-host';
export { ModalBridge as Modal } from './components/modal-bridge/modal-bridge';
export { SharedElementModal } from './components/shared-element/shared-element-modal';
export {
  SharedElementProvider,
  SharedElementHost,
  SharedElement,
  SharedElementPresets,
} from 'react-native-epic-shared-element';
export { SharedElementTransition } from './components/shared-element/shared-element-transition';
export type {
  ModalBridgeProps as ModalProps,
  ModalRef,
} from './components/modal-bridge/modal-bridge';
export type { SharedElementModalProps } from './components/shared-element/shared-element-modal';
export type { SharedElementModalRef } from './components/shared-element/shared-element-modal';
export type {
  SharedElementHostProps,
  SharedElementProps,
  SharedElementProviderProps,
  SharedElementNode,
  SharedElementRect,
  SharedElementTransitionConfig as SharedElementPackageTransitionConfig,
} from 'react-native-epic-shared-element';
export type { SharedElementTransitionConfig } from './components/shared-element/shared-element-modal';
export type { SharedElementTransitionProps } from './components/shared-element/shared-element-transition';
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
