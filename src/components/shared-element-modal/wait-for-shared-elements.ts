export type WaitForStableRects = (
  ids: readonly string[],
  callback: () => void
) => () => void;

export function waitForSharedElements(
  waitForStableRects: WaitForStableRects,
  ids: readonly string[],
  timeout: number,
  onReady: () => void,
  onTimeout: () => void
) {
  let completed = false;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let cancelWait = () => {};

  const complete = (ready: boolean) => {
    if (completed) return;
    completed = true;
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    if (!ready) cancelWait();
    (ready ? onReady : onTimeout)();
  };

  cancelWait = waitForStableRects(ids, () => complete(true));
  if (!completed) {
    timeoutId = setTimeout(() => complete(false), Math.max(0, timeout));
  }

  return () => {
    if (completed) return;
    completed = true;
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    cancelWait();
  };
}
