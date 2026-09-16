# Epic Studio

A self-contained, offline showcase of the current Epic Modal API. The artwork is drawn with React Native views; no image downloads or extra UI dependencies are needed.

The bottom navigation switches between Interaction Studio and Photo Gallery.
Gallery photographs are bundled locally; their source URLs are recorded in
`assets/gallery/README.md`.

## Photo gallery

Open any of the four photographs to see a shared-element transition from the
grid into a full-screen viewer. Previous/Next changes the photograph immediately
inside the viewer; closing animates the current photo back to its own thumbnail.
You can also dismiss by dragging from the top edge. All return targets stay
mounted in the grid. Screen tabs themselves do not animate with shared elements.

Manual checks on Android and iOS: open each image, close by button, cancel a
short dismissal gesture, complete a dismissal gesture, browse to another image
and close, then reopen the original image to check thumbnail visibility.

## Run

From the repository root, install with `yarn install`, then run:

```sh
yarn example
```

In another terminal, launch the native app:

```sh
yarn workspace react-native-epic-modal-example ios
# or
yarn workspace react-native-epic-modal-example android
```

Use a native build with `react-native-epic-shared-element` installed. Expo Go and web cannot demonstrate this native shared-element implementation. Metro resolves both libraries directly to their source files, so local source changes appear in the example.

## Demo walkthrough

1. **Shared elements:** open the listening room, then the album. Artwork uses `resize`, while title uses the default `zoom` mode. Return through both screens to see the reverse transitions. These are visual demo screens, not an audio player.
2. **Layers:** choose a collection, open confirmation, and save. Three modals remain stacked; dismiss them individually to see the retained selection, or return to the studio in one action. The saved collection lives in memory for the current app session.
3. **Motion lab:** independently choose all six entering presets, all seven exiting presets, a duration, and anywhere/left-edge/button-only dismissal. Open the preview and drag it: the orbit and meter subscribe to `useModalProgress` on the UI thread. A short drag returns; a longer drag dismisses.

The home screen has quick links to Layers and Motion Lab. Shared-element screens use edge gestures to leave their scrolling content available. Every modal also has an explicit close control.

## Source and checks

- `src/screens/showcase/showcase.tsx`: configuration, transitions and layered flow.
- `src/screens/showcase/components/`: screen controls and the offline artwork.
- `src/screens/showcase/common/`: showcase-specific motion presets and types.
- `src/common/`: application-wide palette.

```sh
yarn tsc -p example/tsconfig.json
yarn test --runInBand --watchman=false
yarn e2e:ios
```

Run checks from the repository root. Detox requires the configured native test build (`yarn e2e:build:ios` or `yarn e2e:build:android`).
