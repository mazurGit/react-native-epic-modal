import { Pressable, Text } from 'react-native';
import { styles } from './styles';

interface ModalButtonProps {
  label: string;
  testID: string;
  onPress: () => void;
}

export function ModalButton({ label, testID, onPress }: ModalButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      testID={testID}
      onPress={onPress}
      style={styles.actionButton}
    >
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}
