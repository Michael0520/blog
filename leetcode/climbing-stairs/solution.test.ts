import { describe, expect, it } from 'vitest';
import { climbStairs } from './solution';

describe('climbing Stairs', () => {
  it('應該正確處理基礎案例', () => {
    // n <= 2 的情況
    expect(climbStairs(1)).toBe(1);
    expect(climbStairs(2)).toBe(2);
  });

  it('應該正確計算一般案例', () => {
    // n > 2 的情況
    expect(climbStairs(3)).toBe(3);
    expect(climbStairs(4)).toBe(5);
    expect(climbStairs(5)).toBe(8);
  });

  it('應該能處理較大的數字', () => {
    // 測試較大的階數
    expect(climbStairs(6)).toBe(13);
    expect(climbStairs(7)).toBe(21);
  });
});
