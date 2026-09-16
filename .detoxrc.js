/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath:
        'example/ios/build/Build/Products/Debug-iphonesimulator/example.app',
      build:
        'cd example && npx expo prebuild --no-install --platform ios && cd ios && pod install && xcodebuild -workspace example.xcworkspace -scheme example -configuration Debug -sdk iphonesimulator -derivedDataPath build',
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath:
        'example/ios/build/Build/Products/Release-iphonesimulator/example.app',
      build:
        'cd example && npx expo prebuild --no-install --platform ios && cd ios && pod install && xcodebuild -workspace example.xcworkspace -scheme example -configuration Release -sdk iphonesimulator -derivedDataPath build',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'example/android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd example && npx expo prebuild --no-install --platform android && cd android && GRADLE_USER_HOME=${GRADLE_USER_HOME:-/tmp/react-native-epic-modal-gradle} ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      reversePorts: [8081],
    },
    'android.release': {
      type: 'android.apk',
      binaryPath:
        'example/android/app/build/outputs/apk/release/app-release.apk',
      build:
        'cd example && npx expo prebuild --no-install --platform android && cd android && GRADLE_USER_HOME=${GRADLE_USER_HOME:-/tmp/react-native-epic-modal-gradle} ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15',
      },
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: process.env.DETOX_AVD || 'Pixel_8_Pro_API_36',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
    },
    'android.att.debug': {
      device: 'attached',
      app: 'android.debug',
    },
    'android.att.release': {
      device: 'attached',
      app: 'android.release',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
    },
  },
};
