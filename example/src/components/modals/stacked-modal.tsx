import { Modal, type IModalRef } from 'react-native-epic-modal';
import type { RefObject } from 'react';
import { ModalButton } from './modal-button';
import { ModalCard } from './modal-card';
import { styles } from './styles';

interface StackedModalProps {
  modalRef: RefObject<IModalRef | null>;
  priority: number;
  title: string;
  marker: string;
  eyebrow: string;
  description: string;
  accent: string;
  testID: string;
  label: string;
}

export function StackedModal({
  modalRef,
  priority,
  title,
  marker,
  eyebrow,
  description,
  accent,
  testID,
  label,
}: StackedModalProps) {
  return (
    <Modal
      ref={modalRef}
      name={`stacked-${priority}`}
      priority={priority}
      animation={priority === 2 ? 'zoom' : priority === 1 ? 'slide' : 'fade'}
      style={styles.modal}
      backdropStyle={styles.backdrop}
    >
      <ModalCard
        eyebrow={eyebrow}
        marker={marker}
        title={title}
        description={description}
        accent={accent}
      >
        <ModalButton
          label={label}
          testID={testID}
          onPress={() => modalRef.current?.hide()}
        />
      </ModalCard>
    </Modal>
  );
}
