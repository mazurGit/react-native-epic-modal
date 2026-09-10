import { Pressable, StyleSheet, Text } from 'react-native';

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

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#17211b',
  },
  text: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryButton: { backgroundColor: '#dcebe6' },
  secondaryText: { color: '#18594f', fontSize: 15, fontWeight: '700' },
});
