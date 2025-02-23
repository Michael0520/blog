import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from './solution';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should delay execution', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 1000);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous timer', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 1000);

    debouncedFn();
    vi.advanceTimersByTime(500);
    debouncedFn(); // 重置計時器
    vi.advanceTimersByTime(500);

    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should preserve arguments', () => {
    const callback = vi.fn();
    const debouncedFn = debounce(callback, 1000);

    debouncedFn('test');
    vi.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledWith('test');
  });
});
