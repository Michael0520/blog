---
title: Medium 53 - Maximum Subarray
description: In this blog I will share a solution to the maximum subarray problem.
date: 2025-02-11
read: '10'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  [題目連結](https://leetcode.com/problems/maximum-subarray)

  #description
  難度：Medium

  #content
  目標：找出一個連續子陣列，且加總後的總和要是最大的

  example:

  ```bash
  Input: nums = [-2,1,-3,4,-1,2,1,-5,4]   [4,-1,2,1] = 6
  Output: 6

  Input: nums = [1]   只有一個元素
  Output: 1

  Input: nums = [5,4,-1,7,8]   全部加起來最大
  Output: 23
  ```

  ::alert{title="限制條件" type="warning"}
  - 陣列長度：1 ~ 10^5
  - 數字範圍：-10^4 ~ 10^4
  ::

  #footer
  :badge[Array]
  :badge[Dynamic Programming]
  ::

## 解題方法

### 解法

```bash
解法選擇指南：
┌─────────────────────────────────────┐
│ Kadane's Algorithm      │ 只需要一次遍歷就能找到最大和
└─────────────────────────────────────┘
```

### 解法步驟

```bash
【Kadane's Algorithm】
Input: [-2,1,-3,4,-1,2,1,-5,4]

1️⃣ 初始化：
   使用解構賦值
   [maxSum, currentSum] = [-2, -2]

2️⃣ 使用 forEach 遍歷剩餘元素：
   位置 數值  currentSum 計算    maxSum 計算
   1     1   max(1, -1) = 1    max(-2, 1) = 1
   2    -3   max(-3, -2) = -2  max(1, -2) = 1
   3     4   max(4, 2) = 4     max(1, 4) = 4
   4    -1   max(-1, 3) = 3    max(4, 3) = 4
   5     2   max(2, 5) = 5     max(4, 5) = 5
   6     1   max(1, 6) = 6     max(5, 6) = 6
   7    -5   max(-5, 1) = 1    max(6, 1) = 6
   8     4   max(4, 5) = 5     max(6, 5) = 6
```

### 程式碼實現

```typescript
function maxSubArray(nums: number[]): number {
  let [maxSum, currentSum] = [nums[0], nums[0]];

  nums.forEach((num, index) => {
    if (index === 0)
      return;

    currentSum = Math.max(num, currentSum + num);
    maxSum = Math.max(maxSum, currentSum);
  });

  return maxSum;
}
```

### 解法說明

1. **初始化**
   - 使用解構賦值設定初始值
   - maxSum 和 currentSum 都從第一個元素開始

2. **遍歷策略**
   - 使用 forEach 提供更現代的迭代語法
   - 使用 index 檢查跳過第一個元素

3. **核心邏輯**
   ```typescript
   if (index === 0)
     return; // 跳過第一個元素
   currentSum = Math.max(num, currentSum + num);
   maxSum = Math.max(maxSum, currentSum);
   ```

   - 在每次迭代中：
     1. 檢查是否為第一個元素
     2. 決定是否重新開始新的子陣列
     3. 更新所有的最大總和數值
