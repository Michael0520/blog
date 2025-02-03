/**
 * 計算爬樓梯的所有可能方法數
 *
 * 原理：每一階的方法數等於前兩階方法數的總和
 * - 從 n-1 階爬 1 步到達 n 階
 * - 從 n-2 階爬 2 步到達 n 階
 */
export function climbStairs(totalStairs: number): number {
  // 處理基礎案例
  if (totalStairs <= 2) {
    return totalStairs;
  }

  // 初始狀態
  let [twoStepsBefore, oneStepBefore] = [1, 2];

  // 從第 3 階開始計算
  Array.from({ length: totalStairs - 2 }).forEach(() => {
    [twoStepsBefore, oneStepBefore] = [
      oneStepBefore,
      twoStepsBefore + oneStepBefore,
    ];
  });

  return oneStepBefore;
}
