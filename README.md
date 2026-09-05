# React Native Epic Modal

A **flexible**, **lightweight**, and **powerful** modal manager for React Native apps.  
Supports **stacking**, **custom animations**, **gesture dismissals**, and **portal-based** rendering — designed for smooth and modern mobile UX.

---

## ✨ Features

- 🎯 Portal-based rendering (modals independent of navigation tree)
- 🎯 Swipe-to-dismiss gestures with configurable areas
- 🎯 Built-in animations: `fade`, `slide`, `zoom`
- 🎯 Priority stacking for layered modals
- 🎯 Full control via `show()` and `hide()` programmatically
- 🎯 TypeScript support out of the box
- 🎯 Lightweight and mobile-first

---

## 📦 Installation

```bash
npm install react-native-epic-modal react-native-gesture-handler react-native-reanimated react-native-screens react-native-worklets
```

or

```bash
yarn add react-native-epic-modal react-native-gesture-handler react-native-reanimated react-native-screens react-native-worklets
```

> **Note:**  
> Make sure `react-native-reanimated` is configured correctly with the Babel plugin:  
> See [Reanimated installation guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/).

---

## 🚀 Basic Usage

### 1. Wrap your app with `ModalProvider`

```tsx
import { ModalProvider } from 'react-native-epic-modal';

export default function App() {
  return (
    <ModalProvider>
      {/* Your App Content */}
    </ModalProvider>
  );
}
```

---

### 2. Use `Modal` anywhere in your app

```tsx
import { Modal } from 'react-native-epic-modal';
import { useRef } from 'react';
import { Button, Text } from 'react-native';

export default function Screen() {
  const modalRef = useRef(null);

  return (
    <>
      <Button title="Open Modal" onPress={() => modalRef.current?.show()} />

      <Modal
        ref={modalRef}
        name="example-modal"
        animation="zoom"
        gestureEnabled
      >
        <Text>Modal Content Here!</Text>
      </Modal>
    </>
  );
}
```

---

## ⚙️ Modal Props

| Prop | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| `name` | `string` | — | Unique registry name within the provider |
| `id` | `string` | `name` | Optional explicit registry ID |
| `animation` | `"fade"` / `"slide"` / `"zoom"` | `"fade"` | Modal entrance and exit animation |
| `gestureEnabled` | `boolean` | `true` | Enable swipe-to-dismiss gestures |
| `gestureDirection` | `"horizontal"` / `"vertical"` | `"horizontal"` | Direction allowed for swipe dismiss |
| `gestureConfig.edgeTarget` | `"screen"` / `"content"` | `"screen"` | Whether the gesture edge is measured from the screen or modal content |
| `priority` | `number` | `1` | Stacking priority between multiple modals |
| `onEnter` | `() => void` | — | Callback when modal appears |
| `onDismiss` | `() => void` | — | Callback when modal is dismissed |
| `animationConfig` | `SpringConfig` (Reanimated) | — | Customize entrance/exit spring behavior |
| `gestureConfig` | `IGestureConfig` | — | Customize gesture sensitive areas and thresholds |

---

## ✍️ Example Gesture Config

```tsx
gestureConfig={{
  edgeTarget: "content",
  leftGestureAreaOffset: 50,
  topGestureAreaOffset: 100,
  swipeVelocityThreshold: 800,
  swipeProgressToClose: "0.6"
}}
```

## Animate Custom Content

Use `useProgress` inside a modal child to build an animation that follows the
modal presentation progress on the UI thread:

```tsx
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useProgress } from 'react-native-epic-modal';

function ModalContent() {
  const progress = useProgress();
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * 24 }],
    opacity: progress.value,
  }));

  return <Animated.View style={style}>{/* content */}</Animated.View>;
}
```

`useProgress` must be called from a component rendered inside `Modal`.

---

## 🛠 Requirements

- React Native >= 0.71
- react-native-gesture-handler >= 2.0
- react-native-reanimated >= 3.16
- react-native-screens >= 3.0
- react-native-worklets >= 0.5

✅ Compatible with Expo, Bare React Native, and monorepo setups.

---

## 🤝 Contributing

We welcome contributions!  
Please read our [Contributing Guide](CONTRIBUTING.md) to learn how to help improve Epic Modal.

---

## 📄 License

MIT License © 2024 [Oleg Mazur](https://github.com/mazurGit)

---

> Built with ❤️ using [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
