import { describe, expect, it } from 'vitest';
import { maxSubArray } from './solution';

describe('53. Maximum Subarray', () => {
  it('應該找出最大子陣列和', () => {
    expect(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])).toBe(6);
  });

  it('應該處理全部為負數的情況', () => {
    expect(maxSubArray([-1, -2, -3, -4])).toBe(-1);
  });

  it('應該處理只有一個元素的情況', () => {
    expect(maxSubArray([1])).toBe(1);
  });

  it('應該處理全部為正數的情況', () => {
    expect(maxSubArray([1, 2, 3, 4])).toBe(10);
  });
});
