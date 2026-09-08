export type ModalAnimationPreset = 'fade' | 'zoom';

export interface ModalAnimationConfig {
  entering?: ModalAnimationPreset;
  exiting?: ModalAnimationPreset;
  duration?: number;
}

export const DEFAULT_MODAL_ANIMATION: Required<ModalAnimationConfig> = {
  entering: 'fade',
  exiting: 'fade',
  duration: 250,
};
