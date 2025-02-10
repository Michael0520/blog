---
title: Easy 217 - Contains Duplicate
description: In this blog I will share a solution to the contains duplicate problem.
date: 2025-02-10
read: '10'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  [題目連結](https://leetcode.com/problems/contains-duplicate)

  #description
  難度：Easy

  #content
  目標：找出陣列中是否有重複的數字

  重點：
  - 任何數字出現 >= 2 次就回傳 true
  - 全部都不同就回傳 false

  example:

  ```bash
  Input: nums = [1,2,3,1]   1出現兩次
  Output: true

  Input: nums = [1,2,3,4]   都不重複
  Output: false

  Input: nums = [1,1,1,3,3,4,3,2,4,2]   好多重複
  Output: true
  ```

  ::alert{title="限制條件" type="warning"}
  - 陣列長度：1 ~ 10^5
  - 數字範圍：-10^9 ~ 10^9
  ::

  #footer
  :badge[Array]
  :badge[Hash Table]
  :badge[Sorting]
  ::

## 解題方法

### 兩種解法的比較

```bash
解法選擇指南：
┌─────────────────────────────────────┐
│ Set解法  => 最簡單，一行搞定
│ Map解法  => 想知道重複次數時用
└─────────────────────────────────────┘
```

### 解法步驟比較

```bash
【Set解法】直覺，也是我平常在用的解法！
Input: [1,2,3,1]
1️⃣ 轉Set：{1,2,3}
2️⃣ 比較：4個變3個 = 有重複！

【Map解法】最詳細！
Input: [1,2,3,1]
1️⃣ 掃描：1(1次) → 2(1次) → 3(1次) → 1(2次)
2️⃣ 發現：1出現2次，搞定~
```

### 程式碼實現

#### Set解法（一行搞定）

```typescript
function containsDuplicate(nums: number[]): boolean {
  return new Set(nums).size !== nums.length;
}
```

#### Map 解法（進階題目可以使用此方式，來根據次數，去做其他運算）

```typescript
function containsDuplicateMap(nums: number[]): boolean {
  const countMap = new Map<number, number>();

  for (const num of nums) {
    const count = (countMap.get(num) || 0) + 1;
    if (count > 1)
      return true;
    countMap.set(num, count);
  }
  return false;
}
```

### 解法比較表

| 解法 | 時間 | 空間 | 特色 | 缺點 |
|------|------|------|------|------|
| Set | O(n) | O(n) | 一行搞定 | 要額外空間 |
| Map | O(n) | O(n) | 可計次數 | 寫比較多 |
