import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  SharedElement,
  SharedElementModal,
  type SharedElementModalRef,
} from 'react-native-epic-modal';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '../components/ActionButton';

export const SharedElementTestModalTwo = forwardRef<SharedElementModalRef>(
  function SharedElementTestModalTwoImpl(_, forwardedRef) {
    const modalRef = useRef<SharedElementModalRef>(null);
    useImperativeHandle(forwardedRef, () => ({
      present: () => modalRef.current?.present(),
      dismiss: () => modalRef.current?.dismiss(),
    }));

    return (
      <SharedElementModal
        ref={modalRef}
        gestureConfig={{ immersive: true }}
        transitions={[
          {
            key: 'project-icon-modal-a-to-b',
            startId: 'project-icon-destination',
            endId: 'project-icon-modal-b',
            clip: false,
          },
          {
            key: 'project-title-modal-a-to-b',
            startId: 'project-title-destination',
            endId: 'project-title-modal-b',
          },
        ]}
      >
        <View style={styles.screen}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>SHARED ELEMENT</Text>
              <SharedElement id="project-title-modal-b">
                <Text style={styles.title}>Project overview</Text>
              </SharedElement>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => modalRef.current?.dismiss()}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          <View style={styles.hero}>
            <SharedElement id="project-icon-modal-b">
              <View style={styles.icon}>
                <Text style={styles.iconText}>EP</Text>
              </View>
            </SharedElement>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>Epic workspace</Text>
              <Text style={styles.heroDescription}>
                The shared element came from the previous modal.
              </Text>
            </View>
          </View>
          <ActionButton
            label="Close details"
            onPress={() => modalRef.current?.dismiss()}
          />
        </View>
      </SharedElementModal>
    );
  }
);

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#eef4f1',
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
    backgroundColor: '#18594f',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: '#b9e4d8',
  },
  iconText: { color: '#18594f', fontSize: 26, fontWeight: '800' },
  heroCopy: { flex: 1, marginLeft: 16 },
  heroTitle: {
    marginBottom: 6,
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  heroDescription: { color: '#d9f3ec', fontSize: 14, lineHeight: 20 },
});
