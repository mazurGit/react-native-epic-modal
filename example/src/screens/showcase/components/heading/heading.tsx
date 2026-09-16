import type { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';
import { s } from '../../styles';

export function Heading({
  label,
  title,
  children,
}: PropsWithChildren<{ label: string; title: string }>) {
  return (
    <View style={s.heading}>
      <Text style={s.eyebrow}>{label}</Text>
      <Text style={s.title}>{title}</Text>
      {children && <Text style={s.body}>{children}</Text>}
    </View>
  );
}
