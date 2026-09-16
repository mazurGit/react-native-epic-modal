import { Pressable, Text } from 'react-native';
import { s } from '../../styles';

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        s.chip,
        selected && s.chipSelected,
        pressed && s.pressed,
      ]}
    >
      <Text style={[s.chipText, selected && s.dark]}>{label}</Text>
    </Pressable>
  );
}
