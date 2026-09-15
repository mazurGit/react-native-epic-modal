import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  SharedElement,
  SharedElementModal,
  type ModalRef,
} from 'react-native-epic-modal';
import { useSharedElementRegistry } from 'react-native-epic-shared-element';
import { colors } from '../../common/constants/colors.constants';
import { Button } from '../showcase/components/button/button';

const photos = [
  {
    id: 'forest',
    title: 'Into the quiet',
    subtitle: 'A little further from everything.',
    source: require('../../../assets/gallery/forest.jpg'),
  },
  {
    id: 'mountains',
    title: 'Higher ground',
    subtitle: 'Take the long way home.',
    source: require('../../../assets/gallery/mountains.jpg'),
  },
  {
    id: 'coast',
    title: 'Slow mornings',
    subtitle: 'Leave room for the unexpected.',
    source: require('../../../assets/gallery/coast.jpg'),
  },
  {
    id: 'canopy',
    title: 'Wild places',
    subtitle: 'Something worth looking up for.',
    source: require('../../../assets/gallery/canopy.jpg'),
  },
  {
    id: 'trail',
    title: 'The long trail',
    subtitle: 'Follow the path beyond the familiar.',
    source: require('../../../assets/gallery/forest.jpg'),
  },
  {
    id: 'summit',
    title: 'Above the clouds',
    subtitle: 'A wider view changes the way home.',
    source: require('../../../assets/gallery/mountains.jpg'),
  },
  {
    id: 'tide',
    title: 'Between tides',
    subtitle: 'The shoreline never holds still.',
    source: require('../../../assets/gallery/coast.jpg'),
  },
  {
    id: 'treetops',
    title: 'Under the canopy',
    subtitle: 'Light finds a way through the leaves.',
    source: require('../../../assets/gallery/canopy.jpg'),
  },
] as const;

const sourceId = (index: number) => `gallery-${photos[index]!.id}`;

export function Gallery() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const modal = useRef<ModalRef>(null);
  const { get } = useSharedElementRegistry();
  const [selected, setSelected] = useState(0);
  const [openRequest, setOpenRequest] = useState(0);
  const photo = photos[selected]!;
  const gridWidth = Math.min(width - 40, 640);
  // Keep all four return targets on screen, including on compact devices.
  const cardWidth = (gridWidth - 12) / 2;
  const cardHeight = Math.max(
    60,
    Math.min(cardWidth * 1.15, (height - insets.top - insets.bottom - 300) / 2)
  );
  const photoWidth = Math.max(
    60,
    Math.min(width - 40, (height - insets.top - insets.bottom - 230) * 0.8)
  );

  useEffect(() => {
    if (openRequest > 0) modal.current?.present();
  }, [openRequest]);

  const browse = (next: number) => {
    if (next < 0 || next >= photos.length) return;
    // The completed opening transition is unmounted. This viewer owns the
    // hidden thumbnail until dismissal; transfer that ownership when browsing.
    const previousNode = get(sourceId(selected));
    const nextNode = get(sourceId(next));
    if (previousNode) previousNode.visibility.value = 1;
    if (nextNode) nextNode.visibility.value = 0;
    setSelected(next);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
        }}
      >
        <View style={[styles.page, { width: gridWidth }]}>
          <Text style={styles.eyebrow}>FIELD NOTES / VOLUME 01</Text>
          <Text style={styles.heading}>A closer look.</Text>
          <Text style={styles.description}>
            Four moments worth keeping. Tap a photograph to step inside.
          </Text>
          <View style={styles.grid}>
            {photos.map((item, index) => (
              <Pressable
                key={item.id}
                testID={`gallery-open-${item.id}`}
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.title}`}
                onPress={() => {
                  setSelected(index);
                  setOpenRequest((value) => value + 1);
                }}
                style={{ width: cardWidth }}
              >
                <SharedElement id={sourceId(index)} borderRadius={16}>
                  <Image
                    source={item.source}
                    fadeDuration={0}
                    style={[
                      styles.rounded,
                      {
                        width: cardWidth,
                        height: cardHeight,
                      },
                    ]}
                  />
                </SharedElement>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.number}>0{index + 1} / FIELD NOTES</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.footnote}>
            Shared photos · Browse & return · Gesture dismissal
          </Text>
        </View>
      </ScrollView>
      <SharedElementModal
        ref={modal}
        animation={{
          entering: 'slideBottom',
          exiting: 'slideBottom',
          duration: 420,
        }}
        gestureConfig={{ edges: { top: 200 }, swipeProgressToClose: 0.3 }}
        transitions={[
          {
            key: 'gallery-photo',
            startId: sourceId(selected),
            endId: 'gallery-detail',
            mode: 'resize',
            element: (
              <Image
                source={photo.source}
                resizeMode="cover"
                fadeDuration={0}
                style={styles.transitionImage}
              />
            ),
          },
        ]}
      >
        <View
          style={[
            styles.viewer,
            { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 },
          ]}
        >
          <View style={styles.toolbar}>
            <Text style={styles.eyebrow}>FIELD NOTES / 0{selected + 1}</Text>
            <Button
              testID="gallery-close"
              label="Close ↓"
              secondary
              onPress={() => modal.current?.dismiss()}
            />
          </View>
          <View style={styles.pictureArea}>
            <SharedElement id="gallery-detail" borderRadius={16}>
              <Image
                source={photo.source}
                fadeDuration={0}
                style={[
                  styles.rounded,
                  {
                    width: photoWidth,
                    height: photoWidth * 1.25,
                  },
                ]}
              />
            </SharedElement>
          </View>
          <Text style={styles.detailTitle}>{photo.title}</Text>
          <Text style={styles.description}>{photo.subtitle}</Text>
          <View style={styles.toolbar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous photo"
              accessibilityState={{ disabled: selected === 0 }}
              disabled={selected === 0}
              testID="gallery-previous"
              onPress={() => browse(selected - 1)}
              style={[styles.step, selected === 0 && styles.disabled]}
            >
              <Text style={styles.stepText}>← Previous</Text>
            </Pressable>
            <Text style={styles.number}>
              {selected + 1} / {photos.length}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next photo"
              accessibilityState={{ disabled: selected === photos.length - 1 }}
              disabled={selected === photos.length - 1}
              testID="gallery-next"
              onPress={() => browse(selected + 1)}
              style={[
                styles.step,
                selected === photos.length - 1 && styles.disabled,
              ]}
            >
              <Text style={styles.stepText}>Next →</Text>
            </Pressable>
          </View>
          <Text style={styles.hint}>
            Drag from the top edge to return to the gallery.
          </Text>
        </View>
      </SharedElementModal>
    </View>
  );
}

const styles = StyleSheet.create({
  rounded: { borderRadius: 16 },
  root: { flex: 1, backgroundColor: colors.bg },
  page: { alignSelf: 'center', gap: 12 },
  eyebrow: {
    color: colors.lime,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '700',
  },
  heading: {
    color: colors.text,
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1.5,
  },
  description: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 6 },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  number: { color: colors.muted, fontSize: 10, letterSpacing: 1, marginTop: 4 },
  footnote: {
    color: colors.muted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  viewer: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    gap: 10,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pictureArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  detailTitle: { color: colors.text, fontSize: 28, fontWeight: '700' },
  transitionImage: { width: '100%', height: '100%' },
  step: { padding: 14, borderRadius: 14, backgroundColor: colors.panel },
  stepText: { color: colors.text, fontWeight: '600' },
  disabled: { opacity: 0.3 },
  hint: { color: colors.muted, fontSize: 11, textAlign: 'center' },
});
