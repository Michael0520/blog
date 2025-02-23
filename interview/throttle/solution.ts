type Callback = (...args: any[]) => void;

export function throttle(callback: Callback, delay: number): Callback {
  let timerID: NodeJS.Timeout | null = null;

  return function (this: unknown, ...args) {
    if (timerID)
      return;

    timerID = setTimeout(() => {
      callback.apply(this, args);
      timerID = null;
    }, delay);
  };
}
