import { useEffect } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useModalAnimation } from './use-modal-animation';

jest.mock('react', () => ({ useEffect: jest.fn() }));
jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest.fn(),
  withTiming: jest.fn((value) => value),
}));
jest.mock('react-native-worklets', () => ({ scheduleOnRN: jest.fn() }));

describe('modal animation lifecycle', () => {
  let progress: { value: number };
  const onExitComplete = jest.fn();
  const render = (
    options: Partial<Parameters<typeof useModalAnimation>[0]> = {}
  ) => {
    // Hooks are mocked here so each lifecycle effect can be exercised directly.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useModalAnimation({
      enabled: false,
      exiting: false,
      duration: 250,
      onExitComplete,
      ...options,
    });
    const effect = jest.mocked(useEffect).mock.calls.at(-1)![0];
    effect();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    progress = { value: 0 };
    jest.mocked(useSharedValue).mockReturnValue(progress as never);
  });

  it('shows, dismisses and reopens without timing animations', () => {
    render();
    expect(progress.value).toBe(1);
    expect(onExitComplete).not.toHaveBeenCalled();
    render({ exiting: true });
    expect(progress.value).toBe(0);
    expect(onExitComplete).toHaveBeenCalledTimes(1);
    render();
    expect(progress.value).toBe(1);
    expect(withTiming).not.toHaveBeenCalled();
  });

  it('keeps measurement hidden, then reveals without animation', () => {
    render({ hidden: true });
    expect(progress.value).toBe(0);
    expect(onExitComplete).not.toHaveBeenCalled();
    render({ hidden: false });
    expect(progress.value).toBe(1);
  });

  it('animates from the source when measurement completes with animation enabled', () => {
    render({ hidden: true, enabled: true });
    expect(progress.value).toBe(0);
    expect(withTiming).not.toHaveBeenCalled();
    render({ enabled: true });
    expect(withTiming).toHaveBeenCalledWith(
      1,
      { duration: 250 },
      expect.any(Function)
    );
  });

  it('completes dismissal even while hidden', () => {
    render({ hidden: true, exiting: true });
    expect(progress.value).toBe(0);
    expect(onExitComplete).toHaveBeenCalledTimes(1);
  });

  it('snaps an in-flight animation to its endpoint when animations are disabled', () => {
    progress.value = 0.4;
    render();
    expect(progress.value).toBe(1);
    progress.value = 0.6;
    render({ exiting: true });
    expect(progress.value).toBe(0);
    expect(onExitComplete).toHaveBeenCalledTimes(1);
  });

  it('keeps an invisible surface at zero', () => {
    render({ visible: false });
    expect(progress.value).toBe(0);
    expect(onExitComplete).not.toHaveBeenCalled();
  });

  it('only completes an animated dismissal after a finished animation', () => {
    render({ enabled: true, exiting: true });
    const callback = jest.mocked(withTiming).mock.calls[0]![2]!;
    callback(false);
    expect(scheduleOnRN).not.toHaveBeenCalled();
    callback(true);
    expect(scheduleOnRN).toHaveBeenCalledWith(onExitComplete);
  });
});
