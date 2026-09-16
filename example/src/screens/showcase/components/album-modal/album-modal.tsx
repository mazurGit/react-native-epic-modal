import type { RefObject } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  SharedElement,
  SharedText,
  SharedElementModal,
  Geometry,
  Projection,
  mix,
  type ModalRef,
} from 'react-native-epic-modal';
import { s } from '../../styles';
import { Artwork } from '../artwork/artwork';
import { Button } from '../button/button';
import { TrackList } from '../track-list/track-list';

export function AlbumModal({ album }: { album: RefObject<ModalRef | null> }) {
  const insets = useSafeAreaInsets();
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
          element: <Artwork fill />,
        },
        {
          key: 'album-title',
          startId: 'orbit-player-title',
          endId: 'orbit-album-title',
          transition: mix(Geometry.zoom, Projection.linear),
        },
      ]}
    >
      <View
        style={[
          s.root,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <ScrollView contentContainerStyle={s.page}>
          <Button
            testID="close-album"
            label="←    Back to listening room"
            secondary
            onPress={() => album.current?.dismiss()}
          />
          <Text style={s.eyebrow}>SAME ELEMENTS. NEXT CHAPTER.</Text>
          <View style={s.row}>
            <SharedElement id="orbit-album-art">
              <Artwork size={112} />
            </SharedElement>
            <View style={s.flexCopy}>
              <SharedText id="orbit-album-title" style={s.trackTitle}>
                Orbit
              </SharedText>
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
      </View>
    </SharedElementModal>
  );
}
