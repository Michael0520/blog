export function majorityElement(nums: number[]): number {
  // 排序後取中間值即是多數元素
  // 因為多數元素出現次數 > n/2，所以排序後的中間值一定是多數元素
  const midIndex = Math.floor(nums.length / 2);
  const sortedNums = nums.toSorted((a, b) => a - b);

  return sortedNums[midIndex];
}
