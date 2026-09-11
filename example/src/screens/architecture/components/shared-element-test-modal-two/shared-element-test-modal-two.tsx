import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  SharedElement,
  SharedElementModal,
  type SharedElementModalRef,
} from 'react-native-epic-modal';
import { Pressable, Text, View } from 'react-native';
import { ActionButton } from '../../../../components/action-button/action-button';
import { styles } from './styles';

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
            testID="close-next-shared-element-modal"
            onPress={() => modalRef.current?.dismiss()}
          />
        </View>
      </SharedElementModal>
    );
  }
);
