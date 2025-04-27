import { ModalProvider, Modal, type IModalRef } from 'react-native-epic-modal';
import { Text, View, StyleSheet, Button } from 'react-native';
import { useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const ref1 = useRef<IModalRef>(null);
  const ref2 = useRef<IModalRef>(null);
  return (
    <GestureHandlerRootView>
      <ModalProvider>
        <View style={styles.container}>
          <Modal
            style={{
              backgroundColor: 'red',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            ref={ref1}
            name="first"
            priority={1}
          >
            <Text>this is modal</Text>
            <Button
              title="hide"
              onPress={() => {
                ref1.current?.hide();
              }}
            />
          </Modal>
          <Modal
            animation="zoom"
            style={{
              backgroundColor: 'yellow',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            ref={ref2}
            name="second"
            priority={0}
          >
            <Text>this is modal</Text>
            <Button
              title="hide"
              onPress={() => {
                ref2.current?.hide();
              }}
            />
            <Button
              title="test"
              onPress={() => {
                ref1.current?.show();
              }}
            />
          </Modal>
          <Button
            title="test"
            onPress={() => {
              ref1.current?.show();
            }}
          />
          <Button
            title="test2"
            onPress={() => {
              ref2.current?.show();
            }}
          />
        </View>
      </ModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
