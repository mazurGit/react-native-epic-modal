export type ModalEnteringAnimationPreset =
  | 'fade'
  | 'zoom'
  | 'slideLeft'
  | 'slideRight'
  | 'slideTop'
  | 'slideBottom';

export type ModalExitingAnimationPreset =
  | ModalEnteringAnimationPreset
  | 'slideFree';

export type ModalAnimationPreset = ModalExitingAnimationPreset;

export interface ModalAnimationConfig {
  entering?: ModalEnteringAnimationPreset;
  exiting?: ModalExitingAnimationPreset;
  duration?: number;
}

export const DEFAULT_MODAL_ANIMATION: Required<ModalAnimationConfig> = {
  entering: 'fade',
  exiting: 'fade',
  duration: 250,
};
