type Callback = (...args: any[]) => void;

export function debounce(callback: Callback, delay: number): Callback {
  let timerID: NodeJS.Timeout | null = null;

  return function (this: unknown, ...args) {
    if (timerID) {
      clearTimeout(timerID);
    }

    timerID = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}
