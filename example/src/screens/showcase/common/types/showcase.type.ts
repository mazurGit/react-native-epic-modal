import type {
  ModalEnteringAnimationPreset,
  ModalExitingAnimationPreset,
} from 'react-native-epic-modal';

export type GestureMode = 'free' | 'edge' | 'off';

export type MotionSettings = {
  entering: ModalEnteringAnimationPreset;
  exiting: ModalExitingAnimationPreset;
  duration: number;
  gesture: GestureMode;
};
