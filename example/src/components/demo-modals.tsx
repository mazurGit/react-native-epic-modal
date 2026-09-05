import type { IModalRef } from 'react-native-epic-modal';
import type { RefObject } from 'react';
import { BasicModal, GestureModal, StackedModal } from './modals';

interface DemoModalsProps {
  basicModalRef: RefObject<IModalRef | null>;
  stackedFirstModalRef: RefObject<IModalRef | null>;
  stackedSecondModalRef: RefObject<IModalRef | null>;
  stackedThirdModalRef: RefObject<IModalRef | null>;
  swipeHorizontalModalRef: RefObject<IModalRef | null>;
  swipeVerticalModalRef: RefObject<IModalRef | null>;
  onEnter: () => void;
  onDismiss: () => void;
}

export function DemoModals({
  basicModalRef,
  stackedFirstModalRef,
  stackedSecondModalRef,
  stackedThirdModalRef,
  swipeHorizontalModalRef,
  swipeVerticalModalRef,
  onEnter,
  onDismiss,
}: DemoModalsProps) {
  return (
    <>
      <BasicModal
        modalRef={basicModalRef}
        onEnter={onEnter}
        onDismiss={onDismiss}
      />
      <StackedModal
        modalRef={stackedFirstModalRef}
        priority={1}
        marker="01"
        title="First Stacked Modal (Priority 1)"
        eyebrow="LAYER 01"
        description="The base layer stays mounted while higher priority surfaces appear above it."
        accent="#2563eb"
        testID="close-stacked-first"
        label="Close first layer"
      />
      <StackedModal
        modalRef={stackedSecondModalRef}
        priority={2}
        marker="02"
        title="Second Stacked Modal (Priority 2)"
        eyebrow="LAYER 02"
        description="Priority controls the visual depth and back-button dismissal order."
        accent="#d97706"
        testID="close-stacked-second"
        label="Close second layer"
      />
      <StackedModal
        modalRef={stackedThirdModalRef}
        priority={3}
        marker="03"
        title="Third Stacked Modal (Priority 3)"
        eyebrow="LAYER 03"
        description="The top layer can dismiss independently and reveal the modal below it."
        accent="#16a34a"
        testID="close-stacked-third"
        label="Close top layer"
      />
      <GestureModal modalRef={swipeHorizontalModalRef} direction="horizontal" />
      <GestureModal modalRef={swipeVerticalModalRef} direction="vertical" />
    </>
  );
}
