import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function ModalCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '86%',
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  eyebrow: {
    marginBottom: 8,
    color: '#16796f',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    marginBottom: 10,
    color: '#17211b',
    fontSize: 26,
    fontWeight: '800',
  },
});
