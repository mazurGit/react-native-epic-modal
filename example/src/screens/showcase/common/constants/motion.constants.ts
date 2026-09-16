import type {
  ModalEnteringAnimationPreset,
  ModalExitingAnimationPreset,
} from 'react-native-epic-modal';

export const enteringPresets: ModalEnteringAnimationPreset[] = [
  'fade',
  'zoom',
  'slideLeft',
  'slideRight',
  'slideTop',
  'slideBottom',
];

export const animationLabels: Record<ModalExitingAnimationPreset, string> = {
  fade: 'Fade',
  zoom: 'Zoom',
  slideLeft: '← Left',
  slideRight: 'Right →',
  slideTop: '↑ Top',
  slideBottom: 'Bottom ↓',
};
