import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { throttle } from './solution';

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should limit function calls', () => {
    const callback = vi.fn();
    const throttledFn = throttle(callback, 1000);

    throttledFn();
    throttledFn(); // 應該被忽略
    throttledFn(); // 應該被忽略

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should preserve this context', () => {
    const context = { value: 42 };
    const callback = vi.fn(function (this: typeof context) {
      expect(this.value).toBe(42);
    });

    const throttledFn = throttle(callback, 1000);
    throttledFn.call(context);

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
