import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f4f7f5',
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  sourceIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#b9e4d8',
  },
  sourceIconText: { color: '#18594f', fontSize: 18, fontWeight: '800' },
  sourceCopy: { flex: 1, marginLeft: 14 },
  sourceLabel: {
    marginBottom: 4,
    color: '#16796f',
    fontSize: 12,
    fontWeight: '700',
  },
  sourceTitle: { color: '#17211b', fontSize: 16, fontWeight: '700' },
  eyebrow: {
    marginBottom: 12,
    color: '#16796f',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    marginBottom: 12,
    color: '#17211b',
    fontSize: 32,
    fontWeight: '800',
  },
  description: {
    marginBottom: 28,
    color: '#5d6b63',
    fontSize: 16,
    lineHeight: 23,
  },
});
