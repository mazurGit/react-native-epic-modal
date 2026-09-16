import type { RefObject } from 'react';
import type { ModalRef } from 'react-native-epic-modal';
import { AlbumModal } from '../album-modal/album-modal';
import { ListeningRoomModal } from '../listening-room-modal/listening-room-modal';

export function SharedElementModals({
  player,
  album,
}: {
  player: RefObject<ModalRef | null>;
  album: RefObject<ModalRef | null>;
}) {
  return (
    <>
      <ListeningRoomModal player={player} album={album} />
      <AlbumModal album={album} />
    </>
  );
}
