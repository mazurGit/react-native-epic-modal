import { Fragment, type PropsWithChildren } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import type { ModalEntry } from '../../store/modal-entry';

export type ModalHostProps = {
  entries?: readonly ModalEntry[];
} & PropsWithChildren;

/** Root layer for content rendered by the modal system. */
export const ModalHost = ({ children, entries = [] }: ModalHostProps) => {
  const content = (
    <>
      {children}
      {entries.map((entry) => (
        <Fragment key={entry.id}>{entry.render()}</Fragment>
      ))}
    </>
  );

  if (Platform.OS === 'ios') {
    return <FullWindowOverlay>{content}</FullWindowOverlay>;
  }

  return <View style={StyleSheet.absoluteFill}>{content}</View>;
};
