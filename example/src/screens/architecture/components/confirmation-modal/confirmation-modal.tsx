import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Modal, type ModalRef } from 'react-native-epic-modal';
import { Text } from 'react-native';
import { ActionButton } from '../../../../components/action-button/action-button';
import { CloseButton } from '../../../../components/close-button/close-button';
import { ModalCard } from '../../../../components/modal-card/modal-card';
import { globalStyles } from '../../../../styles/styles';

export const ConfirmationModal = forwardRef<
  ModalRef,
  { onPresentNext: () => void }
>(function ConfirmationModalImpl({ onPresentNext }, forwardedRef) {
  const modalRef = useRef<ModalRef>(null);
  useImperativeHandle(forwardedRef, () => ({
    present: () => modalRef.current?.present(),
    dismiss: () => modalRef.current?.dismiss(),
  }));

  return (
    <Modal
      ref={modalRef}
      gestureConfig={{ edges: { top: 300 } }}
      animation={{ entering: 'slideBottom', exiting: 'slideBottom' }}
    >
      <ModalCard title="Confirmation" eyebrow="SECOND MODAL">
        <Text style={globalStyles.cardDescription}>
          This modal is rendered above FilterModal because it was opened later.
        </Text>
        <ActionButton
          testID="open-details-from-confirmation"
          label="Open details above"
          onPress={onPresentNext}
          secondary
        />
        <CloseButton modalRef={modalRef} testID="close-confirmation-modal" />
      </ModalCard>
    </Modal>
  );
});
