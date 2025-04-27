import type { ReactNode } from 'react';

export interface IModalComponent {
  name: string;
  node: ReactNode;
}

export type TAnimation = 'fade' | 'slide' | 'zoom';

export type TDirection = 'horizontal' | 'vertical';

export interface IModalRef {
  show: () => void;
  hide: () => void;
}

export interface IGestureConfig {
  leftGestureAreaOffset?: number;
  topGestureAreaOffset?: number;
  swipeVelocityThreshold?: number;
  swipeProgressToClose?: `0.${number}`;
}

export interface IModalProps extends Omit<IModalComponent, 'node'> {
  onEnter?: () => void;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  animation?: TAnimation;
  gestureDirection?: 'horizontal' | 'vertical';
  gestureEnabled?: boolean;
  priority?: number;
  animationConfig?: SpringConfig;
  gestureConfig?: IGestureConfig;
  hiddenStatusBar?: boolean;
}
