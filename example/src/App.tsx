import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react';
import { Modal, ModalProvider, type ModalRef } from 'react-native-epic-modal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const filterRef = useRef<ModalRef>(null);
  const confirmationRef = useRef<ModalRef>(null);
  const detailsRef = useRef<ModalRef>(null);

  return (
    <GestureHandlerRootView style={styles.root}>
      <ModalProvider>
        <SafeAreaView style={styles.screen}>
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
      </ModalProvider>
    </GestureHandlerRootView>
  );
}

const FilterModal = forwardRef<ModalRef, { onPresentNext: () => void }>(
  function FilterModalImpl({ onPresentNext }, forwardedRef) {
    const modalRef = useRef<ModalRef>(null);
    useImperativeHandle(forwardedRef, () => ({
      present: () => modalRef.current?.present(),
      dismiss: () => modalRef.current?.dismiss(),
    }));

    return (
      <Modal
        animation={{ entering: 'slideLeft', exiting: 'slideFree' }}
        gestureConfig={{ immersive: true }}
        ref={modalRef}
      >
        <ModalCard title="Filters" eyebrow="FILTER MODAL">
          <Text style={styles.cardDescription}>
            A concrete modal built on top of the generic Modal container.
          </Text>
          <ActionButton
            testID="open-confirmation-from-filter"
            label="Open confirmation above"
            onPress={onPresentNext}
            secondary
          />
          <CloseButton modalRef={modalRef} testID="close-filter-modal" />
        </ModalCard>
      </Modal>
    );
  }
);

const ConfirmationModal = forwardRef<ModalRef, { onPresentNext: () => void }>(
  function ConfirmationModalImpl({ onPresentNext }, forwardedRef) {
    const modalRef = useRef<ModalRef>(null);
    useImperativeHandle(forwardedRef, () => ({
      present: () => modalRef.current?.present(),
      dismiss: () => modalRef.current?.dismiss(),
    }));

    return (
      <Modal
        ref={modalRef}
        gestureConfig={{ edges: { top: 300 } }}
        animation={{ entering: 'slideBottom', exiting: 'slideBottom' }}
      >
        <ModalCard title="Confirmation" eyebrow="SECOND MODAL">
          <Text style={styles.cardDescription}>
            This modal is rendered above FilterModal because it was opened
            later.
          </Text>
          <ActionButton
            testID="open-details-from-confirmation"
            label="Open details above"
            onPress={onPresentNext}
            secondary
          />
          <CloseButton modalRef={modalRef} testID="close-confirmation-modal" />
        </ModalCard>
      </Modal>
    );
  }
);

const DetailsModal = forwardRef<ModalRef>(
  function DetailsModalImpl(_, forwardedRef) {
    const modalRef = useRef<ModalRef>(null);
    useImperativeHandle(forwardedRef, () => ({
      present: () => modalRef.current?.present(),
      dismiss: () => modalRef.current?.dismiss(),
    }));

    return (
      <Modal ref={modalRef} gestureConfig={{ immersive: true }}>
        <ModalCard title="Details" eyebrow="THIRD MODAL">
          <Text style={styles.cardDescription}>
            This is the top layer. Dismiss it to reveal the modal below.
          </Text>
          <CloseButton modalRef={modalRef} testID="close-details-modal" />
        </ModalCard>
      </Modal>
    );
  }
);

function ModalCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardEyebrow}>{eyebrow}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

const CloseButton = ({
  modalRef,
  testID,
}: {
  modalRef: RefObject<ModalRef | null>;
  testID: string;
}) => (
  <ActionButton
    testID={testID}
    label="Dismiss"
    onPress={() => modalRef.current?.dismiss()}
  />
);

function ActionButton({
  label,
  testID,
  secondary = false,
  onPress,
}: {
  label: string;
  testID: string;
  secondary?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={[styles.button, secondary && styles.secondaryButton]}
    >
      <Text style={secondary ? styles.secondaryButtonText : styles.buttonText}>
        {label}
      </Text>
    </Pressable>
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
  button: {
    alignItems: 'center',
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#17211b',
  },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryButton: { backgroundColor: '#dcebe6' },
  secondaryButtonText: { color: '#18594f', fontSize: 15, fontWeight: '700' },
  card: {
    width: '86%',
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  cardEyebrow: {
    marginBottom: 8,
    color: '#16796f',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardTitle: {
    marginBottom: 10,
    color: '#17211b',
    fontSize: 26,
    fontWeight: '800',
  },
  cardDescription: { color: '#5d6b63', fontSize: 15, lineHeight: 22 },
});
