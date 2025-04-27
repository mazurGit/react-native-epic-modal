import { StyleSheet, View } from 'react-native';
import { useModalsContext } from '../../hooks/hooks';
import { Fragment } from 'react/jsx-runtime';

export const ModalHost = () => {
  const context = useModalsContext();
  return (
    <View style={StyleSheet.absoluteFillObject}>
      {context.map((modal) => (
        <Fragment key={modal.name}>{modal.node}</Fragment>
      ))}
    </View>
  );
};
