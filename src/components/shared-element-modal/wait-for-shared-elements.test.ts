import { waitForSharedElements } from './wait-for-shared-elements';

describe('shared element measurement wait', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('completes when all rects are ready and clears the timeout', () => {
    let ready: (() => void) | undefined;
    const cancelWait = jest.fn();
    const waitForStableRects = jest.fn((_ids, callback) => {
      ready = callback;
      return cancelWait;
    });
    const onReady = jest.fn();
    const onTimeout = jest.fn();

    waitForSharedElements(
      waitForStableRects,
      ['start', 'end'],
      1000,
      onReady,
      onTimeout
    );
    ready?.();
    jest.runAllTimers();

    expect(onReady).toHaveBeenCalledTimes(1);
    expect(onTimeout).not.toHaveBeenCalled();
    expect(cancelWait).not.toHaveBeenCalled();
  });

  it('cancels the wait and falls back when measurement times out', () => {
    const cancelWait = jest.fn();
    const onReady = jest.fn();
    const onTimeout = jest.fn();

    waitForSharedElements(
      () => cancelWait,
      ['missing'],
      1000,
      onReady,
      onTimeout
    );
    jest.advanceTimersByTime(1000);

    expect(cancelWait).toHaveBeenCalledTimes(1);
    expect(onReady).not.toHaveBeenCalled();
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('cancels without invoking either completion callback', () => {
    const cancelWait = jest.fn();
    const onReady = jest.fn();
    const onTimeout = jest.fn();
    const cancel = waitForSharedElements(
      () => cancelWait,
      ['end'],
      1000,
      onReady,
      onTimeout
    );

    cancel();
    jest.runAllTimers();

    expect(cancelWait).toHaveBeenCalledTimes(1);
    expect(onReady).not.toHaveBeenCalled();
    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('supports synchronous readiness for an empty ID list', () => {
    const onReady = jest.fn();
    const onTimeout = jest.fn();

    waitForSharedElements(
      (_ids, callback) => {
        callback();
        return jest.fn();
      },
      [],
      1000,
      onReady,
      onTimeout
    );
    jest.runAllTimers();

    expect(onReady).toHaveBeenCalledTimes(1);
    expect(onTimeout).not.toHaveBeenCalled();
  });
});
