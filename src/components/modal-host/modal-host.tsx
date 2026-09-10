import { Fragment } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { ModalContent } from '../modal/modal-content';
import { modalManager } from '../../store/external/modal-manager';
import { useModalEntries } from '../../store/hooks/use-modal-entries';

export type ModalHostProps = Record<never, never>;

/** Root layer for content rendered by the modal system. */
export const ModalHost = (_props: ModalHostProps) => {
  const entries = useModalEntries(modalManager);

  const content = (
    <>
      {entries.map((entry) => (
        <Fragment key={entry.id}>
          <ModalContent {...entry.props} id={entry.id} ref={entry.ref} />
        </Fragment>
      ))}
    </>
  );

  if (Platform.OS === 'ios') {
    return <FullWindowOverlay>{content}</FullWindowOverlay>;
  }

  return <View style={StyleSheet.absoluteFill}>{content}</View>;
};
