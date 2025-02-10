/**
 * 53. Maximum Subarray
 * https://leetcode.com/problems/maximum-subarray/
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 *
 * 解題思路：
 * 1. 使用 Kadane's Algorithm
 * 2. 維護兩個變數：當前和(currSum)和最大和(maxSum)
 * 3. 遍歷陣列時，每個位置都決定是要加入前面的和，還是重新開始計算
 */

export function maxSubArray(nums: number[]): number {
  let [maxSum, currentSum] = [nums[0], nums[0]];

  nums.forEach((num, index) => {
    if (index === 0)
      return;

    currentSum = Math.max(num, currentSum + num);
    maxSum = Math.max(maxSum, currentSum);
  });

  return maxSum;
}
