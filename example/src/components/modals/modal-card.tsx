import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

interface ModalCardProps {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  children: ReactNode;
}

export function ModalCard({
  eyebrow,
  title,
  description,
  accent,
  children,
}: ModalCardProps) {
  return (
    <View style={styles.modalBackdrop}>
      <View style={[styles.card, { borderTopColor: accent }]}>
        <View style={[styles.eyebrow, { backgroundColor: accent }]}>
          <Text style={styles.eyebrowText}>{eyebrow}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {children}
      </View>
    </View>
  );
}
