import { useRef } from 'react';
import {
  ModalProvider,
  SharedElement,
  type ModalRef,
  type SharedElementModalRef,
} from 'react-native-epic-modal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from './components/ActionButton';
import { ConfirmationModal } from './modals/ConfirmationModal';
import { DetailsModal } from './modals/DetailsModal';
import { FilterModal } from './modals/FilterModal';
import { SharedElementTestModal } from './modals/SharedElementTestModal';
import { SharedElementTestModalTwo } from './modals/SharedElementTestModalTwo';

export default function App() {
  const filterRef = useRef<ModalRef>(null);
  const confirmationRef = useRef<ModalRef>(null);
  const detailsRef = useRef<ModalRef>(null);
  const sharedElementRef = useRef<SharedElementModalRef>(null);
  const sharedElementTwoRef = useRef<SharedElementModalRef>(null);

  return (
    <GestureHandlerRootView style={styles.root}>
      <ModalProvider>
        <SafeAreaView style={styles.screen}>
          <View style={styles.sourceCard}>
            <SharedElement id="project-icon-source">
              <View style={styles.sourceIcon}>
                <Text style={styles.sourceIconText}>EP</Text>
              </View>
            </SharedElement>
            <View style={styles.sourceCopy}>
              <Text style={styles.sourceLabel}>Shared element source</Text>
              <SharedElement id="project-title-source">
                <Text style={styles.sourceTitle}>Project overview</Text>
              </SharedElement>
            </View>
          </View>
          <Text style={styles.eyebrow}>REACT NATIVE EPIC MODAL</Text>
          <Text style={styles.title}>Current architecture</Text>
          <Text style={styles.description}>
            Modal components register themselves. ModalHost renders presented
            entries from the external store.
          </Text>
          <ActionButton
            testID="open-filter-modal"
            label="Present FilterModal"
            onPress={() => filterRef.current?.present()}
          />
          <ActionButton
            testID="open-confirmation-modal"
            label="Present second modal"
            secondary
            onPress={() => confirmationRef.current?.present()}
          />
          <ActionButton
            testID="open-details-modal"
            label="Present third modal"
            onPress={() => detailsRef.current?.present()}
          />
          <ActionButton
            testID="open-shared-element-modal"
            label="Present shared element modal"
            secondary
            onPress={() => sharedElementRef.current?.present()}
          />
        </SafeAreaView>

        <FilterModal
          ref={filterRef}
          onPresentNext={() => confirmationRef.current?.present()}
        />
        <ConfirmationModal
          ref={confirmationRef}
          onPresentNext={() => detailsRef.current?.present()}
        />
        <DetailsModal ref={detailsRef} />
        <SharedElementTestModal
          ref={sharedElementRef}
          onPresentNext={() => sharedElementTwoRef.current?.present()}
        />
        <SharedElementTestModalTwo ref={sharedElementTwoRef} />
      </ModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f4f7f5',
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  sourceIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#b9e4d8',
  },
  sourceIconText: { color: '#18594f', fontSize: 18, fontWeight: '800' },
  sourceCopy: { flex: 1, marginLeft: 14 },
  sourceLabel: {
    marginBottom: 4,
    color: '#16796f',
    fontSize: 12,
    fontWeight: '700',
  },
  sourceTitle: { color: '#17211b', fontSize: 16, fontWeight: '700' },
  eyebrow: {
    marginBottom: 12,
    color: '#16796f',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    marginBottom: 12,
    color: '#17211b',
    fontSize: 32,
    fontWeight: '800',
  },
  description: {
    marginBottom: 28,
    color: '#5d6b63',
    fontSize: 16,
    lineHeight: 23,
  },
});
