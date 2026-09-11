import { View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useModalProgress } from 'react-native-epic-modal';
import { s } from '../../styles';

export function ProgressArt() {
  const progress = useModalProgress();
  const artStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + progress.value * 0.7,
    transform: [
      { scale: 0.65 + progress.value * 0.5 },
      { rotate: `${(1 - progress.value) * 360}deg` },
    ],
  }));
  const meterStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleX: interpolate(progress.value, [0, 0.7, 1], [0, 0, 1]) },
    ],
  }));

  return (
    <View style={s.centered}>
      <Animated.View style={artStyle}>
        <View style={s.progressOrbit}>
          <View style={s.progressRing} />
          <View style={s.progressDot} />
        </View>
      </Animated.View>
      <View style={s.progressTrack}>
        <Animated.View style={[s.progressFill, meterStyle]} />
      </View>
    </View>
  );
}
