import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Modal, type ModalRef } from 'react-native-epic-modal';
import { Text } from 'react-native';
import { CloseButton } from '../components/CloseButton';
import { ModalCard } from '../components/ModalCard';
import { styles } from '../styles';

export const DetailsModal = forwardRef<ModalRef>(
  function DetailsModalImpl(_, forwardedRef) {
    const modalRef = useRef<ModalRef>(null);
    useImperativeHandle(forwardedRef, () => ({
      present: () => modalRef.current?.present(),
      dismiss: () => modalRef.current?.dismiss(),
    }));

    return (
      <Modal ref={modalRef} gestureConfig={{ immersive: true }}>
        <ModalCard title="Details" eyebrow="THIRD MODAL">
          <Text style={styles.cardDescription}>
            This is the top layer. Dismiss it to reveal the modal below.
          </Text>
          <CloseButton modalRef={modalRef} testID="close-details-modal" />
        </ModalCard>
      </Modal>
    );
  }
);
