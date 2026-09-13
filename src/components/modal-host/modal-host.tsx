import { Platform, StyleSheet, View } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { ModalContent } from '../modal/modal-content';
import { modalManager } from '../../store/modal-manager';
import { useModalEntries } from '../../hooks/use-modal-entries';

export type ModalHostProps = Record<never, never>;

/** Root layer for content rendered by the modal system. */
export const ModalHost = (_props: ModalHostProps) => {
  const entries = useModalEntries(modalManager);

  const content = (
    <>
      {entries.map((entry) => (
        <ModalContent
          {...entry.props}
          key={entry.id}
          id={entry.id}
          ref={entry.ref}
        />
      ))}
    </>
  );

  if (Platform.OS === 'ios') {
    return <FullWindowOverlay>{content}</FullWindowOverlay>;
  }

  return <View style={StyleSheet.absoluteFill}>{content}</View>;
};
