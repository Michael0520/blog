/**
 * 57. Insert Interval
 * https://leetcode.com/problems/insert-interval/
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 *
 * 解題思路：
 * 1. 使用 Array methods 將區間分成三部分：
 *    - before: 不重疊且在新區間前面的
 *    - overlap: 與新區間重疊的
 *    - after: 不重疊且在新區間後面的
 * 2. 使用解構賦值和箭頭函數讓程式碼更簡潔
 */

export function insert(intervals: number[][], newInterval: number[]): number[][] {
  // 使用解構賦值取得新區間的起訖點
  const [newStart, newEnd] = newInterval;

  // 1. 找出所有在新區間前面的區間
  const before = intervals.filter(([, end]) => end < newStart);

  // 2. 找出所有重疊的區間
  const overlap = intervals.filter(([start, end]) =>
    end >= newStart && start <= newEnd,
  );

  // 3. 找出所有在新區間後面的區間
  const after = intervals.filter(([start]) => start > newEnd);

  // 如果有重疊區間，計算合併後的區間
  const mergedInterval = overlap.length > 0
    ? [
        Math.min(newStart, ...overlap.map(([start]) => start)),
        Math.max(newEnd, ...overlap.map(([, end]) => end)),
      ]
    : newInterval;

  // 組合結果
  return [...before, mergedInterval, ...after];
}
