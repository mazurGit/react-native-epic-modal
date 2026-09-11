import type { RefObject } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import {
  SharedElement,
  SharedElementModal,
  type ModalRef,
} from 'react-native-epic-modal';
import { s } from '../../styles';
import { Artwork } from '../artwork/artwork';
import { Button } from '../button/button';
import { TrackList } from '../track-list/track-list';

export function AlbumModal({ album }: { album: RefObject<ModalRef | null> }) {
  return (
    <SharedElementModal
      ref={album}
      animation={{
        entering: 'slideLeft',
        exiting: 'slideRight',
        duration: 500,
      }}
      gestureConfig={{ edges: { left: 36 } }}
      transitions={[
        {
          key: 'album-art',
          startId: 'orbit-player-art',
          endId: 'orbit-album-art',
          mode: 'resize',
          element: <Artwork fill />,
        },
        {
          key: 'album-title',
          startId: 'orbit-player-title',
          endId: 'orbit-album-title',
        },
      ]}
    >
      <SafeAreaView style={s.root}>
        <ScrollView contentContainerStyle={s.page}>
          <Button
            testID="close-album"
            label="← Back to listening room"
            secondary
            onPress={() => album.current?.dismiss()}
          />
          <Text style={s.eyebrow}>SAME ELEMENTS. NEXT CHAPTER.</Text>
          <View style={s.row}>
            <SharedElement id="orbit-album-art">
              <Artwork size={112} />
            </SharedElement>
            <View style={s.flexCopy}>
              <SharedElement id="orbit-album-title">
                <Text style={s.trackTitle}>Orbit</Text>
              </SharedElement>
              <Text style={s.body}>
                The complete sessions{'\n'}4 tracks · 18 min
              </Text>
            </View>
          </View>
          <TrackList />
          <Text style={s.body}>
            Swipe right from the left edge. The shared elements return to the
            player, then back to their original card when you close it.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </SharedElementModal>
  );
}
