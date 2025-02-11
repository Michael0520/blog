import { describe, expect, it } from 'vitest';
import { insert } from './solution';

describe('57. Insert Interval', () => {
  // 測試資料
  const testCases = [
    {
      intervals: [[1, 3], [6, 9]],
      newInterval: [2, 5],
      expected: [[1, 5], [6, 9]],
      description: '基本情況：合併一個區間',
    },
    {
      intervals: [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]],
      newInterval: [4, 8],
      expected: [[1, 2], [3, 10], [12, 16]],
      description: '合併多個區間',
    },
    {
      intervals: [],
      newInterval: [5, 7],
      expected: [[5, 7]],
      description: '空陣列',
    },
    {
      intervals: [[1, 5]],
      newInterval: [0, 0],
      expected: [[0, 0], [1, 5]],
      description: '新區間在最前面',
    },
  ];

  describe('original Solution', () => {
    testCases.forEach(({ intervals, newInterval, expected, description }) => {
      it(description, () => {
        expect(insert(intervals, newInterval)).toEqual(expected);
      });
    });
  });
});
