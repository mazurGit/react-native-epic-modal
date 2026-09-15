import type { RefObject } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SharedElement, type ModalRef } from 'react-native-epic-modal';
import { colors } from '../../../../common/constants/colors.constants';
import {
  animationLabels,
  enteringPresets,
} from '../../common/constants/motion.constants';
import type {
  GestureMode,
  MotionSettings,
} from '../../common/types/showcase.type';
import { s } from '../../styles';
import { Artwork } from '../artwork/artwork';
import { Button } from '../button/button';
import { Chip } from '../chip/chip';

type SectionOffsets = { layers: number; motion: number };

export function HomeScreen({
  scroll,
  sections,
  player,
  collection,
  preview,
  saved,
  motion,
  onMotionChange,
}: {
  scroll: RefObject<ScrollView | null>;
  sections: RefObject<SectionOffsets>;
  player: RefObject<ModalRef | null>;
  collection: RefObject<ModalRef | null>;
  preview: RefObject<ModalRef | null>;
  saved: string | null;
  motion: MotionSettings;
  onMotionChange: (changes: Partial<MotionSettings>) => void;
}) {
  const insets = useSafeAreaInsets();
  return (
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
      <ScrollView
        ref={scroll}
        testID="showcase-scroll"
        contentContainerStyle={s.page}
      >
        <StudioHeader sections={sections} scroll={scroll} />
        <SharedElementsCard player={player} />
        <StackCard collection={collection} saved={saved} sections={sections} />
        <MotionLab
          motion={motion}
          onMotionChange={onMotionChange}
          preview={preview}
          sections={sections}
        />
        <Text style={[s.caption, s.footer]}>
          Built with Epic Modal · Artwork drawn in React Native{'\n'}No network.
          No navigation dependency. Just motion.
        </Text>
      </ScrollView>
    </View>
  );
}

function StudioHeader({
  scroll,
  sections,
}: {
  scroll: RefObject<ScrollView | null>;
  sections: RefObject<SectionOffsets>;
}) {
  return (
    <>
      <View style={s.nav}>
        <Text style={s.logo}>
          epic<Text style={{ color: colors.lime }}>.</Text>
        </Text>
        <Text style={s.badge}>THE INTERACTION STUDIO</Text>
      </View>
      <View style={s.heroCopy}>
        <Text style={s.eyebrow}>REACT NATIVE EPIC MODAL</Text>
        <Text style={s.heroTitle}>Small API.{'\n'}Big moves.</Text>
        <Text style={s.body}>
          A little playground for the moments that make an app feel
          extraordinary.
        </Text>
      </View>
      <View style={s.wrap}>
        <Button
          label="Layers ↓"
          testID="jump-layers"
          secondary
          onPress={() =>
            scroll.current?.scrollTo({
              y: sections.current.layers,
              animated: true,
            })
          }
        />
        <Button
          label="Motion lab ↓"
          testID="jump-motion"
          secondary
          onPress={() =>
            scroll.current?.scrollTo({
              y: sections.current.motion,
              animated: true,
            })
          }
        />
      </View>
    </>
  );
}

function SharedElementsCard({
  player,
}: {
  player: RefObject<ModalRef | null>;
}) {
  return (
    <View style={s.panel}>
      <View style={s.nav}>
        <Text style={s.eyebrow}>01 / SHARED ELEMENTS</Text>
        <Text style={s.sectionNumber}>↗</Text>
      </View>
      <View style={s.row}>
        <SharedElement id="orbit-home-art">
          <Artwork size={104} />
        </SharedElement>
        <View style={s.sourceCopy}>
          <SharedElement id="orbit-home-title">
            <Text style={s.trackTitle}>Orbit</Text>
          </SharedElement>
          <Text style={s.body}>Kairo Collective</Text>
          <Text style={s.caption}>Electronic · 2026</Text>
        </View>
      </View>
      <Text style={s.body}>
        An artwork. A title. Two elements that travel together, from card to
        player to album.
      </Text>
      <Button
        testID="open-player"
        label="Open the listening room  ↗"
        onPress={() => player.current?.present()}
      />
    </View>
  );
}

function StackCard({
  collection,
  saved,
  sections,
}: {
  collection: RefObject<ModalRef | null>;
  saved: string | null;
  sections: RefObject<SectionOffsets>;
}) {
  return (
    <View
      style={s.panel}
      onLayout={(event) => {
        sections.current.layers = event.nativeEvent.layout.y;
      }}
    >
      <Text style={s.eyebrow}>02 / LAYERS WITH MEMORY</Text>
      <View style={s.row}>
        <View style={s.flexCopy}>
          <Text style={s.sectionTitle}>Go a little deeper.</Text>
          <Text style={s.body}>
            Choose a collection, confirm, celebrate. Close each layer to pick up
            where you left off.
          </Text>
        </View>
        <View accessibilityElementsHidden style={s.stackArt}>
          {[0, 1, 2].map((n) => (
            <View
              key={n}
              style={[
                s.stackLayer,
                {
                  backgroundColor: ['#353040', '#645782', '#C2AFFA'][n],
                  top: n * 12,
                  left: n * 6,
                },
              ]}
            />
          ))}
        </View>
      </View>
      {saved && (
        <Text testID="saved-collection" style={s.savedText}>
          ✓ Orbit saved to {saved}
        </Text>
      )}
      <Button
        testID="open-collection"
        label="Build a modal stack  +"
        secondary
        onPress={() => collection.current?.present()}
      />
    </View>
  );
}

function MotionLab({
  motion,
  onMotionChange,
  preview,
  sections,
}: {
  motion: MotionSettings;
  onMotionChange: (changes: Partial<MotionSettings>) => void;
  preview: RefObject<ModalRef | null>;
  sections: RefObject<SectionOffsets>;
}) {
  const gestures: Record<GestureMode, string> = {
    free: 'Anywhere',
    edge: 'Left edge',
    off: 'Button only',
  };
  return (
    <View
      style={s.panel}
      onLayout={(event) => {
        sections.current.motion = event.nativeEvent.layout.y;
      }}
    >
      <Text style={s.eyebrow}>03 / MOTION LAB</Text>
      <Text style={s.sectionTitle}>Make it your own.</Text>
      <OptionGroup
        label="ENTER ANIMATION"
        values={enteringPresets}
        selected={motion.entering}
        onSelect={(entering) => onMotionChange({ entering })}
      />
      <OptionGroup
        label="EXIT ANIMATION"
        values={enteringPresets}
        selected={motion.exiting}
        onSelect={(exiting) => onMotionChange({ exiting })}
      />
      <Text style={s.caption}>DURATION</Text>
      <View style={s.wrap}>
        {[250, 450, 900].map((duration) => (
          <Chip
            key={duration}
            label={`${duration} ms`}
            selected={duration === motion.duration}
            onPress={() => onMotionChange({ duration })}
          />
        ))}
      </View>
      <Text style={s.caption}>DISMISS GESTURE</Text>
      <View style={s.wrap}>
        {(Object.keys(gestures) as GestureMode[]).map((gesture) => (
          <Chip
            key={gesture}
            label={gestures[gesture]}
            selected={gesture === motion.gesture}
            onPress={() => onMotionChange({ gesture })}
          />
        ))}
      </View>
      <Button
        testID="open-motion-preview"
        label="Play this transition  ↗"
        onPress={() => preview.current?.present()}
      />
    </View>
  );
}

function OptionGroup<T extends keyof typeof animationLabels>({
  label,
  values,
  selected,
  onSelect,
}: {
  label: string;
  values: readonly T[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <>
      <Text style={s.caption}>{label}</Text>
      <View style={s.wrap}>
        {values.map((value) => (
          <Chip
            key={value}
            label={animationLabels[value]}
            selected={value === selected}
            onPress={() => onSelect(value)}
          />
        ))}
      </View>
    </>
  );
}
