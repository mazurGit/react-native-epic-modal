import { useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { type ModalRef } from 'react-native-epic-modal';
import type { MotionSettings } from '../../common/types/showcase/showcase.type';
import { HomeScreen } from './components/home-screen/home-screen';
import { MotionPreviewModal } from './components/motion-preview-modal/motion-preview-modal';
import { SharedElementModals } from './components/shared-element-modals/shared-element-modals';
import { StackModals } from './components/stack-modals/stack-modals';

export function Showcase() {
  const scroll = useRef<ScrollView>(null);
  const sections = useRef({ layers: 0, motion: 0 });
  const player = useRef<ModalRef>(null);
  const album = useRef<ModalRef>(null);
  const collection = useRef<ModalRef>(null);
  const confirmation = useRef<ModalRef>(null);
  const success = useRef<ModalRef>(null);
  const preview = useRef<ModalRef>(null);
  const [motion, setMotion] = useState<MotionSettings>({
    entering: 'zoom',
    exiting: 'slideFree',
    duration: 450,
    gesture: 'free',
  });
  const [selected, setSelected] = useState('Late night');
  const [saved, setSaved] = useState<string | null>(null);

  return (
    <>
      <HomeScreen
        scroll={scroll}
        sections={sections}
        player={player}
        collection={collection}
        preview={preview}
        saved={saved}
        motion={motion}
        onMotionChange={(changes) =>
          setMotion((current) => ({ ...current, ...changes }))
        }
      />
      <SharedElementModals player={player} album={album} />
      <StackModals
        collection={collection}
        confirmation={confirmation}
        success={success}
        selected={selected}
        saved={saved}
        onSelect={setSelected}
        onSave={() => {
          setSaved(selected);
          success.current?.present();
        }}
      />
      <MotionPreviewModal preview={preview} motion={motion} />
    </>
  );
}
