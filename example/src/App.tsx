import { ModalProvider, Modal, type IModalRef } from 'react-native-epic-modal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button, View, Text, StyleSheet } from 'react-native';
import { useRef } from 'react';

export default function App() {
  const basicModalRef = useRef<IModalRef>(null);
  const stackedFirstModalRef = useRef<IModalRef>(null);
  const stackedSecondModalRef = useRef<IModalRef>(null);
  const stackedThirdModalRef = useRef<IModalRef>(null);
  const swipeHorizontalModalRef = useRef<IModalRef>(null);
  const swipeVerticalModalRef = useRef<IModalRef>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ModalProvider>
        <View style={styles.container}>
          <Text style={styles.title}>Epic Modal Full Demo</Text>

          <Button
            title="Open Basic Modal"
            onPress={() => basicModalRef.current?.show()}
          />
          <View style={styles.spacer} />

          <Button
            title="Open Stacked Modals"
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
            onPress={() => swipeHorizontalModalRef.current?.show()}
          />
          <View style={styles.spacer} />

          <Button
            title="Open Swipe (Vertical)"
            onPress={() => swipeVerticalModalRef.current?.show()}
          />

          {/* Basic Modal */}
          <Modal
            ref={basicModalRef}
            name="basic-modal"
            animation="fade"
            style={[
              styles.modal,
              {
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 5,
              },
            ]}
          >
            <Text style={styles.modalTitle}>Basic Modal</Text>
            <Button
              title="Close"
              onPress={() => basicModalRef.current?.hide()}
            />
          </Modal>

          {/* Stacked Modals */}
          <Modal
            ref={stackedFirstModalRef}
            name="stacked-first"
            priority={1}
            animation="slide"
            style={[styles.modal, { backgroundColor: '#add8e6' }]} // Light Blue
          >
            <Text style={styles.modalTitle}>
              First Stacked Modal (Priority 1)
            </Text>
            <Button
              title="Close"
              onPress={() => stackedFirstModalRef.current?.hide()}
            />
          </Modal>

          <Modal
            ref={stackedSecondModalRef}
            name="stacked-second"
            priority={2}
            animation="zoom"
            style={[styles.modal, { backgroundColor: '#fff9b0' }]} // Light Yellow
          >
            <Text style={styles.modalTitle}>
              Second Stacked Modal (Priority 2)
            </Text>
            <Button
              title="Close"
              onPress={() => stackedSecondModalRef.current?.hide()}
            />
          </Modal>

          <Modal
            ref={stackedThirdModalRef}
            name="stacked-third"
            priority={3}
            animation="fade"
            style={[styles.modal, { backgroundColor: '#b0f2b6' }]} // Light Green
          >
            <Text style={styles.modalTitle}>
              Third Stacked Modal (Priority 3)
            </Text>
            <Button
              title="Close"
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
            style={[styles.modal, { backgroundColor: '#d8b0ff' }]} // Light Purple
          >
            <Text style={styles.modalTitle}>Swipe left/right to dismiss</Text>
            <Button
              title="Or Close"
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
            style={[styles.modal, { backgroundColor: '#ffb6b9' }]} // Light Coral
          >
            <Text style={styles.modalTitle}>Swipe down to dismiss</Text>
            <Button
              title="Or Close"
              onPress={() => swipeVerticalModalRef.current?.hide()}
            />
          </Modal>
        </View>
      </ModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
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
  modalTitle: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
});
