import type { ReactNode, Ref } from 'react';

export interface IModalComponent {
  id: string;
  props: IModalProps;
  ref: Ref<IModalRef>;
}

export interface IModalRegistry {
  byId: Record<string, IModalComponent>;
  order: string[];
}

export type TAnimation = 'fade' | 'slide' | 'zoom';

export type TDirection = 'horizontal' | 'vertical';

export interface IModalRef {
  show: () => void;
  hide: () => void;
}

export interface IGestureConfig {
  edgeTarget?: 'screen' | 'content';
  leftGestureAreaOffset?: number;
  topGestureAreaOffset?: number;
  swipeVelocityThreshold?: number;
  swipeProgressToClose?: `0.${number}`;
}

export interface IModalProps {
  name: string;
  children?: ReactNode;
  id?: string;
  onEnter?: () => void;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
  animation?: TAnimation;
  gestureDirection?: 'horizontal' | 'vertical';
  gestureEnabled?: boolean;
  priority?: number;
  animationConfig?: SpringConfig;
  gestureConfig?: IGestureConfig;
  hiddenStatusBar?: boolean;
}
