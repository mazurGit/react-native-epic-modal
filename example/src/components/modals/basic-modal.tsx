import { Modal, type IModalRef } from 'react-native-epic-modal';
import { Text, View } from 'react-native';
import type { RefObject } from 'react';
import { ModalButton } from './modal-button';
import { ModalCard } from './modal-card';
import { styles } from './styles';

interface BasicModalProps {
  modalRef: RefObject<IModalRef | null>;
  onEnter: () => void;
  onDismiss: () => void;
}

export function BasicModal({ modalRef, onEnter, onDismiss }: BasicModalProps) {
  return (
    <Modal
      ref={modalRef}
      name="basic-modal"
      animation="fade"
      style={styles.modal}
      backdropStyle={styles.backdrop}
      onEnter={onEnter}
      onDismiss={onDismiss}
    >
      <ModalCard
        eyebrow="READY TO GO"
        marker="01"
        title="Basic Modal"
        description="A focused surface for confirmations, details, and quick decisions."
        accent="#0f766e"
      >
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>STATUS</Text>
          <Text style={styles.detailValue}>ACTIVE</Text>
        </View>
        <ModalButton
          label="Close modal"
          testID="close-basic-modal"
          onPress={() => modalRef.current?.hide()}
        />
      </ModalCard>
    </Modal>
  );
}
