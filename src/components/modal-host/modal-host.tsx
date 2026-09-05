import { Platform, StyleSheet, View } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { useModalsContext } from '../../hooks/hooks';
import { Fragment } from 'react/jsx-runtime';
import { ModalContent } from '../modal/modal';

export const ModalHost = () => {
  const context = useModalsContext();
  const content = (
    <View style={StyleSheet.absoluteFill}>
      {context.map((modal) => (
        <Fragment key={modal.id}>
          <ModalContent id={modal.id} ref={modal.ref} {...modal.props} />
        </Fragment>
      ))}
    </View>
  );

  if (Platform.OS === 'ios') {
    return <FullWindowOverlay>{content}</FullWindowOverlay>;
  }

  return <View style={StyleSheet.absoluteFill}>{content}</View>;
};
