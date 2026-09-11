import { ModalProvider } from 'react-native-epic-modal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { Navigation } from './navigation/navigation';
import { globalStyles } from './styles/styles';

export function App() {
  return (
    <GestureHandlerRootView style={globalStyles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#101113" />
      <ModalProvider>
        <Navigation />
      </ModalProvider>
    </GestureHandlerRootView>
  );
}
