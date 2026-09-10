import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  SharedElement,
  SharedElementModal,
  type SharedElementModalRef,
} from 'react-native-epic-modal';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '../components/ActionButton';

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
      animation={{ entering: 'slideLeft', exiting: 'slideLeft' }}
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

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f4f7f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  eyebrow: {
    marginBottom: 8,
    color: '#16796f',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: { color: '#17211b', fontSize: 30, fontWeight: '800' },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dcebe6',
  },
  closeText: { marginTop: -3, color: '#18594f', fontSize: 28 },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#16796f',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#b9e4d8',
  },
  iconText: { color: '#18594f', fontSize: 20, fontWeight: '800' },
  transitionIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 18,
    backgroundColor: '#b9e4d8',
  },
  heroCopy: { flex: 1, marginLeft: 16 },
  heroTitle: {
    marginBottom: 6,
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  heroDescription: { color: '#d9f3ec', fontSize: 14, lineHeight: 20 },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { color: '#17211b', fontSize: 22, fontWeight: '800' },
  statLabel: { marginTop: 4, color: '#7b8981', fontSize: 12 },
  divider: { width: 1, height: 32, backgroundColor: '#e1e9e4' },
});
