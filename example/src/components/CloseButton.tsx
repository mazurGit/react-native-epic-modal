import type { RefObject } from 'react';
import type { ModalRef } from 'react-native-epic-modal';
import { ActionButton } from './ActionButton';

export function CloseButton({
  modalRef,
  testID,
}: {
  modalRef: RefObject<ModalRef | null>;
  testID: string;
}) {
  return (
    <ActionButton
      testID={testID}
      label="Dismiss"
      onPress={() => modalRef.current?.dismiss()}
    />
  );
}
