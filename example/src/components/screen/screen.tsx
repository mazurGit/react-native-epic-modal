import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';
import {
  useSafeAreaInsetsStyle,
  type ExtendedEdge,
} from '../../hooks/use-safe-area-insets-style';

export type ScreenProps = PropsWithChildren<
  Omit<ViewProps, 'style'> & {
    edges?: readonly ExtendedEdge[];
    style?: ViewProps['style'];
  }
>;

export function Screen({
  children,
  edges = ['top', 'bottom'],
  style,
  ...props
}: ScreenProps) {
  return (
    <View style={[style, useSafeAreaInsetsStyle(edges)]} {...props}>
      {children}
    </View>
  );
}
