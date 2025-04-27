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
npm install react-native-epic-modal react-native-gesture-handler react-native-reanimated
```

or

```bash
yarn add react-native-epic-modal react-native-gesture-handler react-native-reanimated
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
| `name` | `string` | — | Unique name for the modal |
| `animation` | `"fade"` / `"slide"` / `"zoom"` | `"fade"` | Modal entrance and exit animation |
| `gestureEnabled` | `boolean` | `true` | Enable swipe-to-dismiss gestures |
| `gestureDirection` | `"horizontal"` / `"vertical"` | `"horizontal"` | Direction allowed for swipe dismiss |
| `priority` | `number` | `1` | Stacking priority between multiple modals |
| `onEnter` | `() => void` | — | Callback when modal appears |
| `onDismiss` | `() => void` | — | Callback when modal is dismissed |
| `animationConfig` | `SpringConfig` (Reanimated) | — | Customize entrance/exit spring behavior |
| `gestureConfig` | `IGestureConfig` | — | Customize gesture sensitive areas and thresholds |

---

## ✍️ Example Gesture Config

```tsx
gestureConfig={{
  leftGestureAreaOffset: 50,
  topGestureAreaOffset: 100,
  swipeVelocityThreshold: 800,
  swipeProgressToClose: "0.6"
}}
```

---

## 🛠 Requirements

- React Native >= 0.71
- react-native-gesture-handler >= 2.0
- react-native-reanimated >= 3.0

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
