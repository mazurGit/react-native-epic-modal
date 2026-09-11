import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Modal, type ModalRef } from 'react-native-epic-modal';
import { Text } from 'react-native';
import { ActionButton } from '../../../../components/action-button/action-button';
import { CloseButton } from '../../../../components/close-button/close-button';
import { ModalCard } from '../../../../components/modal-card/modal-card';
import { globalStyles } from '../../../../styles/styles';

export const FilterModal = forwardRef<ModalRef, { onPresentNext: () => void }>(
  function FilterModalImpl({ onPresentNext }, forwardedRef) {
    const modalRef = useRef<ModalRef>(null);
    useImperativeHandle(forwardedRef, () => ({
      present: () => modalRef.current?.present(),
      dismiss: () => modalRef.current?.dismiss(),
    }));

    return (
      <Modal
        animation={{ entering: 'slideLeft', exiting: 'slideFree' }}
        gestureConfig={{ immersive: true, dismissBehavior: 'followGesture' }}
        ref={modalRef}
      >
        <ModalCard title="Filters" eyebrow="FILTER MODAL">
          <Text style={globalStyles.cardDescription}>
            A concrete modal built on top of the generic Modal container.
          </Text>
          <ActionButton
            testID="open-confirmation-from-filter"
            label="Open confirmation above"
            onPress={onPresentNext}
            secondary
          />
          <CloseButton modalRef={modalRef} testID="close-filter-modal" />
        </ModalCard>
      </Modal>
    );
  }
);
