import { describe, expect, it } from 'vitest';
import memoize from './solution';

describe('memoize', () => {
  it('相同參數只計算一次', () => {
    let callCount = 0;
    const memoizedFn = memoize((a: number, b: number) => {
      callCount += 1;
      return a + b;
    });

    expect(memoizedFn(2, 3)).toBe(5);
    expect(memoizedFn(2, 3)).toBe(5);
    expect(callCount).toBe(1);
  });

  it('不同參數會重新計算', () => {
    let callCount = 0;
    const memoizedFn = memoize((a, b) => {
      callCount += 1;
      return a + b;
    });

    expect(memoizedFn(2, 3)).toBe(5);
    expect(memoizedFn(1, -1)).toBe(0);
    expect(callCount).toBe(2);
  });
});
