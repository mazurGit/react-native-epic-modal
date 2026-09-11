import { Pressable, Text } from 'react-native';
import { styles } from './styles';

export function ActionButton({
  label,
  testID,
  secondary = false,
  onPress,
}: {
  label: string;
  testID: string;
  secondary?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={[styles.button, secondary && styles.secondaryButton]}
    >
      <Text style={secondary ? styles.secondaryText : styles.text}>
        {label}
      </Text>
    </Pressable>
  );
}
