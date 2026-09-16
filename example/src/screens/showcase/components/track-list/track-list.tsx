import { Text, View } from 'react-native';
import { tracks } from '../../../../mock/tracks.mock';
import { s } from '../../styles';

export function TrackList() {
  return (
    <>
      {tracks.map(([title, duration], index) => (
        <View key={title} style={[s.row, s.trackRow]}>
          <Text style={s.sectionNumber}>0{index + 1}</Text>
          <Text style={[s.sectionTitle, s.trackName]}>{title}</Text>
          <Text style={s.caption}>{duration}</Text>
        </View>
      ))}
    </>
  );
}
