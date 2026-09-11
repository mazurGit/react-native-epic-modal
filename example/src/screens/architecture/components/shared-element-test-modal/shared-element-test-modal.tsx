import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  SharedElement,
  SharedElementModal,
  type SharedElementModalRef,
} from 'react-native-epic-modal';
import { Pressable, Text, View } from 'react-native';
import { ActionButton } from '../../../../components/action-button/action-button';
import { styles } from './styles';

export interface SharedElementTestModalProps {
  onPresentNext: () => void;
}

export const SharedElementTestModal = forwardRef<
  SharedElementModalRef,
  SharedElementTestModalProps
>(function SharedElementTestModalImpl({ onPresentNext }, forwardedRef) {
  const modalRef = useRef<SharedElementModalRef>(null);
  useImperativeHandle(forwardedRef, () => ({
    present: () => modalRef.current?.present(),
    dismiss: () => modalRef.current?.dismiss(),
  }));

  return (
    <SharedElementModal
      ref={modalRef}
      gestureConfig={{ immersive: true }}
      animation={{ entering: 'slideLeft', exiting: 'slideBottom' }}
      transitions={[
        {
          key: 'project-icon',
          startId: 'project-icon-source',
          endId: 'project-icon-destination',
          clip: false,
        },
        {
          key: 'project-title',
          startId: 'project-title-source',
          endId: 'project-title-destination',
        },
      ]}
    >
      <View style={styles.screen}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>SHARED ELEMENT</Text>
            <SharedElement id="project-title-destination">
              <Text style={styles.title}>Project overview</Text>
            </SharedElement>
          </View>
          <Pressable
            accessibilityRole="button"
            testID="close-shared-element-modal"
            onPress={() => modalRef.current?.dismiss()}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </View>
        <View style={styles.hero}>
          <SharedElement id="project-icon-destination">
            <View style={styles.icon}>
              <Text style={styles.iconText}>EP</Text>
            </View>
          </SharedElement>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Epic workspace</Text>
            <Text style={styles.heroDescription}>
              A measured destination screen ready for a shared transition.
            </Text>
          </View>
        </View>
        <View style={styles.stats}>
          <Stat value="24" label="Components" />
          <View style={styles.divider} />
          <Stat value="08" label="Transitions" />
          <View style={styles.divider} />
          <Stat value="96%" label="Ready" />
        </View>
        <ActionButton
          testID="close-shared-element-modal-action"
          label="Close screen"
          onPress={() => modalRef.current?.dismiss()}
        />
        <ActionButton
          label="Open next screen"
          testID="open-next-shared-element-modal"
          secondary
          onPress={onPresentNext}
        />
      </View>
    </SharedElementModal>
  );
});

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
