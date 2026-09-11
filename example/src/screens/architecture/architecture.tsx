import { useRef } from 'react';
import {
  SharedElement,
  type ModalRef,
  type SharedElementModalRef,
} from 'react-native-epic-modal';
import { SafeAreaView, Text, View } from 'react-native';
import { ActionButton } from '../../components/action-button/action-button';
import { ConfirmationModal } from './components/confirmation-modal/confirmation-modal';
import { DetailsModal } from './components/details-modal/details-modal';
import { FilterModal } from './components/filter-modal/filter-modal';
import { SharedElementTestModal } from './components/shared-element-test-modal/shared-element-test-modal';
import { SharedElementTestModalTwo } from './components/shared-element-test-modal-two/shared-element-test-modal-two';
import { styles } from './styles';

export function Architecture() {
  const filterRef = useRef<ModalRef>(null);
  const confirmationRef = useRef<ModalRef>(null);
  const detailsRef = useRef<ModalRef>(null);
  const sharedElementRef = useRef<SharedElementModalRef>(null);
  const sharedElementTwoRef = useRef<SharedElementModalRef>(null);

  return (
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
    </SafeAreaView>
  );
}
