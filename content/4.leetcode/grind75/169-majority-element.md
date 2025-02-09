---
title: Easy 169 - Majority Element
description: In this blog I will share a solution to the Majority Element problem.
date: 2025-02-07 01:00:00
icon: 'fa6-solid:code'
read: '10'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  [題目連結](https://leetcode.com/problems/majority-element)

  #description
  難度：Easy

  #content
  給定一個大小為 n 的陣列 nums，找出其中出現次數超過 ⌊n/2⌋ 次的元素，稱為多數元素。

  你可以假設陣列非空，且多數元素一定存在。

  ::br
  ::br

  example:

  ```bash
  輸入：nums = [3,2,3]
  輸出：3
  解釋：在陣列 [3,2,3] 中，3 出現了 2 次，超過陣列長度的一半。

  輸入：nums = [2,2,1,1,1,2,2]
  輸出：2
  解釋：在陣列 [2,2,1,1,1,2,2] 中，2 出現了 4 次，超過陣列長度的一半。
  ```

  ::alert{title="限制" type="warning"}
    - n == nums.length
    - 1 <= n <= 5 * 10^4
    - -10^9 <= nums[i] <= 10^9
  ::

  #footer
  :badge[Array]
  :badge[Hash Table]
  :badge[Sorting]
  ::
::

## 解題思路

### 思考過程

1. **初步分析**
   - 需要找出出現次數超過一半的元素
   - 這個元素一定存在
   - 可能有多種解法

2. **可能的解法**
   - 直觀解法：Map 計數：使用雜湊表 (O(n))
   - 思考後的解法：排序解法：排序後取中位數 (O(n log n))
   - leetcode 上看到的解法：Boyer-Moore 投票算法：O(n) 最優解

3. **選擇理由**
   - 排序解法程式碼最簡潔
   - 容易理解和維護

### 解法演進

#### 1. 初始解法：使用 Map 計數
使用 Map 來追蹤每個數字出現的次數：

```bash
# 步驟說明

1️⃣ 初始狀態：
  nums = [2,2,1,1,1,2,2]
  counter = new Map()
  threshold = 7/2 = 3.5

2️⃣ 遍歷陣列：
  2 -> count = 1
  2 -> count = 2
  1 -> count = 1
  1 -> count = 2
  1 -> count = 3
  2 -> count = 3
  2 -> count = 4 > threshold ✅

3️⃣ 找到答案：
  return 2
```

### 實作過程

1. **Map 計數解法**

這是最直觀且常見的解法，將每個數字出現的次數計算出來，並且比較是否超過一半，如果超過一半則返回該數字，但我自己認為這個寫法有稍微複雜了一點

```typescript
function majorityElement(nums: number[]): number {
  const counter = new Map<number, number>();
  const threshold = nums.length / 2;

  for (const num of nums) {
    const count = (counter.get(num) || 0) + 1;
    if (count > threshold)
      return num;
    counter.set(num, count);
  }

  const [maxNumber] = Array.from(counter.entries())
    .reduce(([num, count], [currNum, currCount]) => {
      return currCount > count ? [currNum, currCount] : [num, count];
    }, [0, 0]);

  return maxNumber;
}
```

2. **排序解法:自己比較偏好這個寫法，因為可讀性高且效能也不會太差**

```typescript
function majorityElement(nums: number[]): number {
  const midIndex = Math.floor(nums.length / 2);
  const sortedNums = nums.toSorted((a, b) => a - b);

  return sortedNums[midIndex];
}
```

::alert{type="warning"}
注意：雖然這個解法程式碼最簡潔，但時間複雜度是 O(n log n)，如果需要最優的時間複雜度，
可以考慮使用 Boyer-Moore 投票算法（O(n)）。
::

### Boyer-Moore 投票算法

這是一個非常巧妙的算法，核心思想是：
- 如果一個數是多數元素，那麼它出現的次數減去其他所有元素出現的次數仍然大於 0

```typescript
function majorityElement(nums: number[]): number {
  let count = 0;
  let candidate: number | null = null;

  for (const num of nums) {
    if (count === 0) {
      candidate = num;
    }
    count += num === candidate ? 1 : -1;
  }

  return candidate as number;
}
```

#### 算法步驟說明
```bash
nums = [2,2,1,1,1,2,2]

1️⃣ 初始狀態：
  count = 0
  candidate = null

2️⃣ 遍歷過程：
  2 -> count = 0 -> candidate = 2 -> count = 1
  2 -> count = 2
  1 -> count = 1
  1 -> count = 0
  1 -> count = 0 -> candidate = 1 -> count = 1
  2 -> count = 0
  2 -> count = 0 -> candidate = 2 -> count = 1

3️⃣ 最終結果：
  candidate = 2 (多數元素)
```

#### 為什麼這個算法有效？

1. 如果 count 變為 0，表示目前的 candidate 和其他元素抵消
2. 多數元素出現次數 > n/2，所以最後一定會勝出
3. 時間複雜度 O(n)，空間複雜度 O(1)

### 複雜度分析

讓我們比較三種解法的複雜度：

| 解法 | 時間複雜度 | 空間複雜度 | 優缺點 | 適用場景 | 技巧 |
| --- | --------- | --------- | --- | --- | --- |
| Map 計數 | O(n) | O(n) | 效能較好，但程式碼較複雜 | 小規模 | 使用 Map 計數 |
| 排序解法 | O(n log n) | O(n) | 直觀易懂，但效能較差 | 小規模 | 使用 toSorted() 排序 |
| Boyer-Moore 投票算法 | O(n) | O(1) | 效能最好，但較難理解 | 大規模 | 使用投票算法 |

## 實際應用

這個問題在實際開發中有很多應用場景：

1. **投票系統**：找出獲得過半數票的選項
2. **圖像處理**：找出主要顏色 (過去實作過去分析圖片上的像素顏色，並且進行排列，也是用很類似的方式)
