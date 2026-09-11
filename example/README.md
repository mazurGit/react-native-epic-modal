# Epic Studio

A self-contained, offline showcase of the current Epic Modal API. The artwork is drawn with React Native views; no image downloads or extra UI dependencies are needed.

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

Use a native build with the library's `EpicSharedElementView` installed. Expo Go and web cannot demonstrate this native shared-element implementation. Metro resolves the library directly to `../src/index.tsx`, so local source changes appear in the example.

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
