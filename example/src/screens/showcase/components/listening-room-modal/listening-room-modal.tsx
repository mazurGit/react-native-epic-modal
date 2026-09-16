import type { RefObject } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  SharedElement,
  SharedElementModal,
  Geometry,
  Projection,
  mix,
  type ModalRef,
} from 'react-native-epic-modal';
import { useArtworkSize } from '../../../../hooks/use-artwork-size/use-artwork-size.hook';
import { Screen } from '../../../../components/screen/screen';
import { s } from '../../styles';
import { Artwork } from '../artwork/artwork';
import { Button } from '../button/button';

export function ListeningRoomModal({
  player,
  album,
}: {
  player: RefObject<ModalRef | null>;
  album: RefObject<ModalRef | null>;
}) {
  const artworkSize = useArtworkSize();
  return (
    <SharedElementModal
      ref={player}
      animation={{
        entering: 'slideBottom',
        exiting: 'slideBottom',
        duration: 500,
      }}
      gestureConfig={{ edges: { top: 200 } }}
      transitions={[
        {
          key: 'art',
          startId: 'orbit-home-art',
          endId: 'orbit-player-art',
          transition: mix(Geometry.resize, Projection.swoosh),
          element: <Artwork fill />,
        },
        {
          key: 'title',
          startId: 'orbit-home-title',
          endId: 'orbit-player-title',
          transition: mix(Geometry.text, Projection.linear),
        },
      ]}
    >
      <Screen edges={['top', 'bottom']} style={s.root}>
        <ScrollView contentContainerStyle={s.page}>
          <View style={s.nav}>
            <Text style={s.eyebrow}>THE LISTENING ROOM</Text>
            <Button
              testID="close-player"
              label="Close ↓"
              secondary
              onPress={() => player.current?.dismiss()}
            />
          </View>
          <View style={s.centered}>
            <SharedElement id="orbit-player-art">
              <Artwork size={artworkSize} />
            </SharedElement>
            <SharedElement id="orbit-player-title">
              <Text style={[s.trackTitle, s.playerTitle]}>Orbit</Text>
            </SharedElement>
            <Text style={s.body}>Kairo Collective / Vol. 01</Text>
          </View>
          <View style={s.panel}>
            <Text style={s.eyebrow}>A CONTINUOUS CONNECTION</Text>
            <Text style={s.body}>
              The artwork and title keep their identity as the layout changes.
              Open the album to carry them into a second modal.
            </Text>
            <Text style={s.caption}>
              Drag from the top edge to dismiss. This is a motion demo; no audio
              is played.
            </Text>
          </View>
          <Button
            testID="open-album"
            label="Explore the album  ↗"
            onPress={() => album.current?.present()}
          />
        </ScrollView>
      </Screen>
    </SharedElementModal>
  );
}
