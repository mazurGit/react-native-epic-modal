import { useWindowDimensions } from 'react-native';

export function useArtworkSize(): number {
  const { width, height } = useWindowDimensions();
  return Math.max(120, Math.min(width - 96, height * 0.34, 320));
}
