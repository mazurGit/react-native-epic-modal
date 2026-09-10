import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  Modal,
  ModalProvider,
  SharedElementModal,
  type ModalRef,
  type SharedElementModalRef,
} from 'react-native-epic-modal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const filterRef = useRef<ModalRef>(null);
  const confirmationRef = useRef<ModalRef>(null);
  const detailsRef = useRef<ModalRef>(null);
  const sharedElementRef = useRef<SharedElementModalRef>(null);

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
        <SharedElementTestModal ref={sharedElementRef} />
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
        gestureConfig={{ immersive: true, dismissBehavior: 'followGesture' }}
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

const SharedElementTestModal = forwardRef<SharedElementModalRef>(
  function SharedElementTestModalImpl(_, forwardedRef) {
    const modalRef = useRef<SharedElementModalRef>(null);
    useImperativeHandle(forwardedRef, () => ({
      present: () => modalRef.current?.present(),
      dismiss: () => modalRef.current?.dismiss(),
    }));

    return (
      <SharedElementModal ref={modalRef} gestureConfig={{ immersive: true }}>
        <View style={styles.sharedScreen}>
          <View style={styles.sharedHeader}>
            <View>
              <Text style={styles.sharedEyebrow}>SHARED ELEMENT</Text>
              <Text style={styles.sharedTitle}>Project overview</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              testID="close-shared-element-modal"
              onPress={() => modalRef.current?.dismiss()}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>

          <View style={styles.sharedHero}>
            <View style={styles.heroIcon}>
              <Text style={styles.heroIconText}>EP</Text>
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>Epic workspace</Text>
              <Text style={styles.heroDescription}>
                A measured destination screen ready for a shared transition.
              </Text>
            </View>
          </View>

          <View style={styles.sharedStats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Components</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>08</Text>
              <Text style={styles.statLabel}>Transitions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>96%</Text>
              <Text style={styles.statLabel}>Ready</Text>
            </View>
          </View>

          <ActionButton
            testID="close-shared-element-modal-action"
            label="Close screen"
            onPress={() => modalRef.current?.dismiss()}
          />
        </View>
      </SharedElementModal>
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
  sharedScreen: {
    width: '100%',
    height: '100%',
    padding: 24,
    backgroundColor: '#f4f7f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sharedHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  sharedEyebrow: {
    marginBottom: 8,
    color: '#16796f',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  sharedTitle: {
    color: '#17211b',
    fontSize: 30,
    fontWeight: '800',
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dcebe6',
  },
  closeButtonText: {
    marginTop: -3,
    color: '#18594f',
    fontSize: 28,
    fontWeight: '400',
  },
  sharedHero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#16796f',
  },
  heroIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    marginRight: 16,
    borderRadius: 18,
    backgroundColor: '#b9e4d8',
  },
  heroIconText: { color: '#18594f', fontSize: 20, fontWeight: '800' },
  heroCopy: { flex: 1 },
  heroTitle: {
    marginBottom: 6,
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  heroDescription: { color: '#d9f3ec', fontSize: 14, lineHeight: 20 },
  sharedStats: {
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
  statDivider: { width: 1, height: 32, backgroundColor: '#e1e9e4' },
});
