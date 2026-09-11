import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Modal, type ModalRef } from 'react-native-epic-modal';
import { Text } from 'react-native';
import { CloseButton } from '../../../../components/close-button/close-button';
import { ModalCard } from '../../../../components/modal-card/modal-card';
import { globalStyles } from '../../../../styles/styles';

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
          <Text style={globalStyles.cardDescription}>
            This is the top layer. Dismiss it to reveal the modal below.
          </Text>
          <CloseButton modalRef={modalRef} testID="close-details-modal" />
        </ModalCard>
      </Modal>
    );
  }
);
