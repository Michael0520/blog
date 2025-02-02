import { describe, expect, it } from 'vitest';
import { twoSum } from './solution';

describe('Two Sum', () => {
  it('should return indices of two numbers that add up to target', () => {
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
    expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
    expect(twoSum([3, 3], 6)).toEqual([0, 1]);
  });

  it('should handle no solution case', () => {
    expect(twoSum([1, 2, 3], 7)).toEqual([]);
  });
});
