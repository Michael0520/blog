import { describe, expect, it } from 'vitest';
import { majorityElement } from './solution';

describe('169. Majority Element', () => {
  const testCases = [
    {
      nums: [3, 2, 3],
      expected: 3,
      description: '基本案例：3 出現 2 次，超過一半',
    },
    {
      nums: [2, 2, 1, 1, 1, 2, 2],
      expected: 2,
      description: '較長陣列：2 出現 4 次，超過一半',
    },
    {
      nums: [1],
      expected: 1,
      description: '邊界案例：只有一個元素',
    },
    {
      nums: [1, 1, 1, 1, 1, 2, 2],
      expected: 1,
      description: '多數元素在前半部',
    },
  ];

  testCases.forEach(({ nums, expected, description }) => {
    it(description, () => {
      expect(majorityElement(nums)).toBe(expected);
    });
  });
});
