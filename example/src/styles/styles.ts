import { StyleSheet } from 'react-native';
import { colors } from '../common/constants/colors.constants';

export const globalStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  cardDescription: { color: '#5d6b63', fontSize: 15, lineHeight: 22 },
});
