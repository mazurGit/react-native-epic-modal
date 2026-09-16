import { View } from 'react-native';
import { s } from '../../styles';

const artworkOrbits = [0.86, 0.65, 0.44, 0.23] as const;
const artworkRingThickness = 4.5;
const artworkTiltRatio = 0.882947593;
const artworkVerticalOffset = 0.11538462;

// Offline artwork, shared between the source card and both destinations.
export function Artwork({
  size = 260,
  fill = false,
}: {
  size?: number;
  fill?: boolean;
}) {
  return (
    <View
      accessibilityLabel="Orbit album artwork"
      style={[
        s.art,
        fill && s.artFill,
        !fill && {
          width: size,
          height: size,
        },
      ]}
    >
      {artworkOrbits.map((scale) => (
        <View
          key={scale}
          style={[
            s.orbit,
            {
              width: `${scale * 100}%`,
              height: `${scale * artworkTiltRatio * 100}%`,
              left: `${((1 - scale) / 2) * 100}%`,
              top: `${
                ((1 - scale * artworkTiltRatio) / 2 - artworkVerticalOffset) *
                100
              }%`,
            },
          ]}
        >
          <View
            style={[
              s.orbitCutout,
              { inset: `${artworkRingThickness / scale}%` },
            ]}
          />
        </View>
      ))}
      <View style={s.artDot} />
    </View>
  );
}
