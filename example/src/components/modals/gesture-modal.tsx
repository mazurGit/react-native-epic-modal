import { Modal, type IModalRef } from 'react-native-epic-modal';
import type { RefObject } from 'react';
import { Text, View } from 'react-native';
import { ModalButton } from './modal-button';
import { ModalCard } from './modal-card';
import { styles } from './styles';

interface GestureModalProps {
  modalRef: RefObject<IModalRef | null>;
  direction: 'horizontal' | 'vertical';
}

export function GestureModal({ modalRef, direction }: GestureModalProps) {
  const isVertical = direction === 'vertical';
  const title = isVertical
    ? 'Swipe down to dismiss'
    : 'Swipe left/right to dismiss';

  return (
    <Modal
      ref={modalRef}
      name={`swipe-${direction}-modal`}
      animation="slide"
      gestureEnabled
      gestureDirection={direction}
      gestureConfig={{ edgeTarget: 'content' }}
      style={styles.modal}
      backdropStyle={styles.backdrop}
    >
      <ModalCard
        eyebrow="GESTURE LAB"
        marker={isVertical ? 'V' : 'H'}
        title={title}
        description={
          isVertical
            ? 'Pull down from the top edge to dismiss this vertical presentation.'
            : 'Start the gesture from the edge of the screen to move this surface away.'
        }
        accent={isVertical ? '#e11d48' : '#7c3aed'}
      >
        {isVertical && (
          <View style={styles.gestureHint}>
            <Text style={styles.gestureHintArrow}>↓</Text>
            <Text style={styles.gestureHintText}>Swipe from the top edge</Text>
          </View>
        )}
        <ModalButton
          label="Close manually"
          testID={`close-${direction}-modal`}
          onPress={() => modalRef.current?.hide()}
        />
      </ModalCard>
    </Modal>
  );
}
