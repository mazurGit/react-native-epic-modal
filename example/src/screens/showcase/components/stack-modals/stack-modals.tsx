import type { RefObject } from 'react';
import { Text, View } from 'react-native';
import { Modal, type ModalRef } from 'react-native-epic-modal';
import { s } from '../../styles';
import { Artwork } from '../artwork/artwork';
import { Button } from '../button/button';
import { Chip } from '../chip/chip';
import { Heading } from '../heading/heading';
import { ProgressArt } from '../progress-art/progress-art';

export function StackModals({
  collection,
  confirmation,
  success,
  selected,
  saved,
  onSelect,
  onSave,
}: {
  collection: RefObject<ModalRef | null>;
  confirmation: RefObject<ModalRef | null>;
  success: RefObject<ModalRef | null>;
  selected: string;
  saved: string | null;
  onSelect: (name: string) => void;
  onSave: () => void;
}) {
  const dismissAll = () => {
    success.current?.dismiss();
    confirmation.current?.dismiss();
    collection.current?.dismiss();
  };
  return (
    <>
      <Modal
        ref={collection}
        style={s.sheetModal}
        animation={{
          entering: 'slideBottom',
          exiting: 'slideBottom',
          duration: 350,
        }}
        gestureConfig={{ enabled: false }}
      >
        <View style={s.sheet}>
          <View style={s.handle} />
          <Heading label="LAYER 01 / COLLECTION" title="Keep a good thing.">
            Choose where Orbit belongs. Your selection stays while other modals
            are on top.
          </Heading>
          <View style={s.wrap}>
            {['Late night', 'Deep focus', 'On repeat'].map((name) => (
              <Chip
                key={name}
                label={name}
                selected={name === selected}
                onPress={() => onSelect(name)}
              />
            ))}
          </View>
          <Button
            testID="open-confirmation"
            label={`Save to ${selected} →`}
            onPress={() => confirmation.current?.present()}
          />
          <Button
            testID="close-collection"
            secondary
            label="Back to studio"
            onPress={() => collection.current?.dismiss()}
          />
        </View>
      </Modal>
      <Modal
        ref={confirmation}
        style={s.centerModal}
        animation={{ entering: 'zoom', exiting: 'zoom', duration: 300 }}
        gestureConfig={{ enabled: false }}
      >
        <View style={s.card}>
          <Heading
            label="LAYER 02 / CONFIRMATION"
            title="A perfect fit."
          >{`Add Orbit to “${selected}”? Your collection is still right underneath.`}</Heading>
          <View style={s.row}>
            <Artwork size={68} />
            <View>
              <Text style={s.sectionTitle}>Orbit</Text>
              <Text style={s.body}>Kairo Collective</Text>
            </View>
          </View>
          <Button
            testID="confirm-save"
            label="Yes, save the album"
            onPress={onSave}
          />
          <Button
            testID="close-confirmation"
            label="Back to collection"
            secondary
            onPress={() => confirmation.current?.dismiss()}
          />
        </View>
      </Modal>
      <Modal
        ref={success}
        style={s.centerModal}
        animation={{ entering: 'slideTop', exiting: 'slideTop', duration: 450 }}
        gestureConfig={{
          immersive: true,
          dismissBehavior: 'followGesture',
          swipeProgressToClose: 0.3,
        }}
      >
        <View style={s.card}>
          <ProgressArt />
          <Heading
            label="LAYER 03 / SAVED"
            title="Good taste. Saved."
          >{`Orbit is in “${saved ?? selected}”. Dismiss this card to reveal the confirmation, then your collection.`}</Heading>
          <Button
            testID="close-success"
            label="Peel back a layer ↓"
            onPress={() => success.current?.dismiss()}
          />
          <Button
            testID="close-all-layers"
            label="Done · return to studio"
            secondary
            onPress={dismissAll}
          />
        </View>
      </Modal>
    </>
  );
}
