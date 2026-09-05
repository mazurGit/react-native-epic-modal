import { ModalProvider, Modal, type IModalRef } from 'react-native-epic-modal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button, View, Text, StyleSheet } from 'react-native';
import { useRef, useState } from 'react';

export default function App() {
  const [enterCount, setEnterCount] = useState(0);
  const [dismissCount, setDismissCount] = useState(0);
  const basicModalRef = useRef<IModalRef>(null);
  const stackedFirstModalRef = useRef<IModalRef>(null);
  const stackedSecondModalRef = useRef<IModalRef>(null);
  const stackedThirdModalRef = useRef<IModalRef>(null);
  const swipeHorizontalModalRef = useRef<IModalRef>(null);
  const swipeVerticalModalRef = useRef<IModalRef>(null);

  return (
    <GestureHandlerRootView style={styles.root}>
      <ModalProvider>
        <View style={styles.container}>
          <Text style={styles.title}>Epic Modal Full Demo</Text>
          <Text testID="enter-count">Enter count: {enterCount}</Text>
          <Text testID="dismiss-count">Dismiss count: {dismissCount}</Text>

          <Button
            title="Open Basic Modal"
            testID="open-basic-modal"
            onPress={() => basicModalRef.current?.show()}
          />
          <View style={styles.spacer} />

          <Button
            title="Open Stacked Modals"
            testID="open-stacked-modals"
            onPress={() => {
              stackedFirstModalRef.current?.show();
              setTimeout(() => {
                stackedSecondModalRef.current?.show();
                setTimeout(() => {
                  stackedThirdModalRef.current?.show();
                }, 300);
              }, 300);
            }}
          />
          <View style={styles.spacer} />

          <Button
            title="Open Swipe (Horizontal)"
            testID="open-horizontal-modal"
            onPress={() => swipeHorizontalModalRef.current?.show()}
          />
          <View style={styles.spacer} />

          <Button
            title="Open Swipe (Vertical)"
            testID="open-vertical-modal"
            onPress={() => swipeVerticalModalRef.current?.show()}
          />

          {/* Basic Modal */}
          <Modal
            ref={basicModalRef}
            name="basic-modal"
            animation="fade"
            style={[styles.modal, styles.basicModal]}
            onEnter={() => setEnterCount((count) => count + 1)}
            onDismiss={() => setDismissCount((count) => count + 1)}
          >
            <Text style={styles.modalTitle}>Basic Modal</Text>
            <Button
              title="Close"
              testID="close-basic-modal"
              onPress={() => basicModalRef.current?.hide()}
            />
          </Modal>

          {/* Stacked Modals */}
          <Modal
            ref={stackedFirstModalRef}
            name="stacked-first"
            priority={1}
            animation="slide"
            style={[styles.modal, styles.firstStackedModal]} // Light Blue
          >
            <Text style={styles.modalTitle}>
              First Stacked Modal (Priority 1)
            </Text>
            <Button
              title="Close"
              testID="close-stacked-first"
              onPress={() => stackedFirstModalRef.current?.hide()}
            />
          </Modal>

          <Modal
            ref={stackedSecondModalRef}
            name="stacked-second"
            priority={2}
            animation="zoom"
            style={[styles.modal, styles.secondStackedModal]} // Light Yellow
          >
            <Text style={styles.modalTitle}>
              Second Stacked Modal (Priority 2)
            </Text>
            <Button
              title="Close"
              testID="close-stacked-second"
              onPress={() => stackedSecondModalRef.current?.hide()}
            />
          </Modal>

          <Modal
            ref={stackedThirdModalRef}
            name="stacked-third"
            priority={3}
            animation="fade"
            style={[styles.modal, styles.thirdStackedModal]} // Light Green
          >
            <Text style={styles.modalTitle}>
              Third Stacked Modal (Priority 3)
            </Text>
            <Button
              title="Close"
              testID="close-stacked-third"
              onPress={() => stackedThirdModalRef.current?.hide()}
            />
          </Modal>

          {/* Swipe Horizontal Modal */}
          <Modal
            ref={swipeHorizontalModalRef}
            name="swipe-horizontal-modal"
            animation="slide"
            gestureEnabled
            gestureDirection="horizontal"
            style={[styles.modal, styles.horizontalModal]} // Light Purple
          >
            <Text style={styles.modalTitle}>Swipe left/right to dismiss</Text>
            <Button
              title="Or Close"
              testID="close-horizontal-modal"
              onPress={() => swipeHorizontalModalRef.current?.hide()}
            />
          </Modal>

          {/* Swipe Vertical Modal */}
          <Modal
            ref={swipeVerticalModalRef}
            name="swipe-vertical-modal"
            animation="slide"
            gestureEnabled
            gestureDirection="vertical"
            style={[styles.modal, styles.verticalModal]} // Light Coral
          >
            <Text style={styles.modalTitle}>Swipe down to dismiss</Text>
            <Button
              title="Or Close"
              testID="close-vertical-modal"
              onPress={() => swipeVerticalModalRef.current?.hide()}
            />
          </Modal>
        </View>
      </ModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40 },
  spacer: { height: 20 },
  modal: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basicModal: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  firstStackedModal: {
    backgroundColor: '#add8e6',
  },
  secondStackedModal: {
    backgroundColor: '#fff9b0',
  },
  thirdStackedModal: {
    backgroundColor: '#b0f2b6',
  },
  horizontalModal: {
    backgroundColor: '#d8b0ff',
  },
  verticalModal: {
    backgroundColor: '#ffb6b9',
  },
  modalTitle: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
});
