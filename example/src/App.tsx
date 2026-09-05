import { ModalProvider, type IModalRef } from 'react-native-epic-modal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useRef, useState } from 'react';
import { DemoModals } from './components/demo-modals';

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
          <Text style={styles.kicker}>MOTION SYSTEM / 01</Text>
          <Text style={styles.title}>Epic Modal Full Demo</Text>
          <Text style={styles.subtitle}>
            Explore layered surfaces, gestures, and shared animation progress.
          </Text>
          <View style={styles.statusRow}>
            <Text testID="enter-count" style={styles.statusText}>
              Enter count: {enterCount}
            </Text>
            <Text testID="dismiss-count" style={styles.statusText}>
              Dismiss count: {dismissCount}
            </Text>
          </View>
          <Text style={styles.sectionLabel}>TRY A PRESENTATION</Text>

          <Pressable
            testID="open-basic-modal"
            onPress={() => basicModalRef.current?.show()}
            style={styles.openButton}
          >
            <Text style={styles.openButtonText}>Open Basic Modal</Text>
          </Pressable>
          <View style={styles.spacer} />

          <Pressable
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
            style={styles.openButton}
          >
            <Text style={styles.openButtonText}>Open Stacked Modals</Text>
          </Pressable>
          <View style={styles.spacer} />

          <Pressable
            testID="open-horizontal-modal"
            onPress={() => swipeHorizontalModalRef.current?.show()}
            style={styles.openButton}
          >
            <Text style={styles.openButtonText}>Open Swipe (Horizontal)</Text>
          </Pressable>
          <View style={styles.spacer} />

          <Pressable
            testID="open-vertical-modal"
            onPress={() => swipeVerticalModalRef.current?.show()}
            style={styles.openButton}
          >
            <Text style={styles.openButtonText}>Open Swipe (Vertical)</Text>
          </Pressable>

          <DemoModals
            basicModalRef={basicModalRef}
            stackedFirstModalRef={stackedFirstModalRef}
            stackedSecondModalRef={stackedSecondModalRef}
            stackedThirdModalRef={stackedThirdModalRef}
            swipeHorizontalModalRef={swipeHorizontalModalRef}
            swipeVerticalModalRef={swipeVerticalModalRef}
            onEnter={() => setEnterCount((count) => count + 1)}
            onDismiss={() => setDismissCount((count) => count + 1)}
          />
        </View>
      </ModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f3f5f2',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#17211b',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: 12,
  },
  kicker: {
    color: '#0f766e',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  subtitle: {
    color: '#667269',
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 18,
    maxWidth: 310,
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  statusText: {
    color: '#6b756d',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionLabel: {
    alignSelf: 'flex-start',
    color: '#819087',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  openButton: {
    alignItems: 'center',
    backgroundColor: '#17211b',
    borderRadius: 14,
    minWidth: 250,
    paddingHorizontal: 22,
    paddingVertical: 15,
  },
  openButtonText: {
    color: '#f6faf5',
    fontSize: 15,
    fontWeight: '700',
  },
  spacer: { height: 20 },
});
