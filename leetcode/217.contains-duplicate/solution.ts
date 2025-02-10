/**
 * 217. Contains Duplicate
 * https://leetcode.com/problems/contains-duplicate/
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 *
 * 解題思路：
 * 1. 使用 Set 的特性：Set 中不能有重複元素
 * 2. 如果原陣列有重複元素，轉成 Set 後的長度一定小於原陣列長度
 * 3. 反之，如果長度相同，表示沒有重複元素
 */

export function containsDuplicate(nums: number[]): boolean {
  return new Set(nums).size !== nums.length;
}

/**
 * 進階解法：使用 Map 來計算次數
 * 適合需要知道重複次數的情況
 */
export function containsDuplicateMap(nums: number[]): boolean {
  const countMap = new Map<number, number>();

  for (const num of nums) {
    const count = (countMap.get(num) || 0) + 1;
    if (count > 1)
      return true;
    countMap.set(num, count);
  }
  return false;
}
