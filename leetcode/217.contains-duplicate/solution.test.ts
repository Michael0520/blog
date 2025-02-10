import { describe, expect, it } from 'vitest';
import { containsDuplicate, containsDuplicateMap } from './solution';

describe('217. Contains Duplicate', () => {
  // Set 解法測試
  describe('set Solution', () => {
    it('應該在有重複元素時返回 true', () => {
      expect(containsDuplicate([1, 2, 3, 1])).toBe(true);
    });

    it('應該在沒有重複元素時返回 false', () => {
      expect(containsDuplicate([1, 2, 3, 4])).toBe(false);
    });

    it('應該處理多個重複元素', () => {
      expect(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])).toBe(true);
    });
  });

  // Map 解法測試
  describe('map Solution', () => {
    it('應該在有重複元素時返回 true', () => {
      expect(containsDuplicateMap([1, 2, 3, 1])).toBe(true);
    });

    it('應該在沒有重複元素時返回 false', () => {
      expect(containsDuplicateMap([1, 2, 3, 4])).toBe(false);
    });

    it('應該處理多個重複元素', () => {
      expect(containsDuplicateMap([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])).toBe(true);
    });
  });
});
