import type { RefObject } from 'react';
import { Text, View } from 'react-native';
import { Modal, type ModalRef } from 'react-native-epic-modal';
import { animationLabels } from '../../common/constants/motion.constants';
import type { MotionSettings } from '../../common/types/showcase.type';
import { s } from '../../styles';
import { Button } from '../button/button';
import { Heading } from '../heading/heading';
import { ProgressArt } from '../progress-art/progress-art';

export function MotionPreviewModal({
  preview,
  motion,
}: {
  preview: RefObject<ModalRef | null>;
  motion: MotionSettings;
}) {
  const description =
    motion.gesture === 'free'
      ? 'Drag anywhere, in any direction. Release a short drag to return, or swipe further to dismiss.'
      : motion.gesture === 'edge'
        ? 'Drag from the left edge of the screen to dismiss.'
        : 'Gestures are disabled. Use the button below to play the exit animation.';

  return (
    <Modal
      ref={preview}
      style={s.centerModal}
      animation={{
        entering: motion.entering,
        exiting: motion.exiting,
        duration: motion.duration,
      }}
      gestureConfig={{
        enabled: motion.gesture !== 'off',
        immersive: motion.gesture === 'free',
        edges: { left: 36 },
        swipeProgressToClose: 0.35,
      }}
    >
      <View testID="motion-preview" style={s.card}>
        <ProgressArt />
        <Heading label="LIVE / USE MODAL PROGRESS" title="Motion you can feel.">
          {description}
        </Heading>
        <Text style={s.caption}>
          {animationLabels[motion.entering]} → {animationLabels[motion.exiting]}{' '}
          · {motion.duration} ms{'\n'}The rings and meter follow the actual
          modal progress.
        </Text>
        <Button
          testID="close-motion-preview"
          label="Replay? Close and tweak ↗"
          onPress={() => preview.current?.dismiss()}
        />
      </View>
    </Modal>
  );
}
