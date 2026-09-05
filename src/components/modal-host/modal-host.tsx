import { Platform, StyleSheet, View } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { useModalsContext } from '../../hooks/hooks';
import { Fragment } from 'react/jsx-runtime';

export const ModalHost = () => {
  const context = useModalsContext();
  const content = (
    <View style={StyleSheet.absoluteFillObject}>
      {context.map((modal) => (
        <Fragment key={modal.id}>{modal.node}</Fragment>
      ))}
    </View>
  );

  if (Platform.OS === 'ios') {
    return <FullWindowOverlay>{content}</FullWindowOverlay>;
  }

  return <View style={StyleSheet.absoluteFillObject}>{content}</View>;
};
