import { Pressable, Text } from 'react-native';
import { s } from '../../styles';

export function Button({
  label,
  onPress,
  testID,
  secondary = false,
}: {
  label: string;
  onPress: () => void;
  testID?: string;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        pressed && s.pressed,
      ]}
    >
      <Text style={[s.buttonText, secondary && s.light]}>{label}</Text>
    </Pressable>
  );
}
