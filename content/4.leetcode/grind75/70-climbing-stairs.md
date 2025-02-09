---
title: Easy 70 - Climbing Stairs
description: In this blog I will share a solution to the Climbing Stairs problem.
date: 2025-02-04 03:00:00
read: '10'
---

::div{class="mt-6"}

  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  [題目連結](https://leetcode.com/problems/climbing-stairs)

  #description
  難度：Easy

  #content

  你正在爬樓梯，需要 n 步才能到達頂部。每次你可以爬 1 或 2 個台階，求有多少種不同的方法可以爬到樓頂？

  example:

  ```bash
  輸入：n = 2
  輸出：2
  解釋：有兩種方法爬到頂部
  1. 1 步 + 1 步
  2. 2 步

  輸入：n = 3
  輸出：3
  解釋：有三種方法爬到頂部
  1. 1 步 + 1 步 + 1 步
  2. 1 步 + 2 步
  3. 2 步 + 1 步
  ```

  ::alert{title="限制" type="warning"}
  - 1 <= n <= 45
  ::

  #footer
  :badge[Dynamic Programming]
  :badge[Fibonacci Sequence]
  ::
::

## 解題思路

這是一個經典的動態規劃問題，實際上就是斐波那契數列的應用(Fibonacci Sequence)

### 核心概念

1. **到達每一階的方法數**
   - 可以從前一階爬 1 步到達
   - 可以從前兩階爬 2 步到達
   - 因此，到達當前階的方法數 = 到達前一階的方法數 + 到達前兩階的方法數

2. **基礎案例**
   - n = 1：只有一種方法（爬 1 階）
   - n = 2：有兩種方法（爬 1+1 或直接爬 2）

### 解題步驟

1. **初始判斷**
   - 檢查是否為基礎案例 (n ≤ 2)
   - 如果是，直接返回 n

2. **初始化狀態**
   - 設定前兩階的方法數
   - n = 1 時為 1 種方法
   - n = 2 時為 2 種方法

3. **動態規劃計算**
   - 從第 3 階開始遍歷
   - 每一階的方法數 = 前一階方法數 + 前兩階方法數
   - 更新狀態，準備計算下一階

4. **返回結果**
   - 返回最後計算出的方法數
   - 即為到達目標階數的總方法數

### 狀態轉換說明

```bash
[n ≤ 2] → 返回 n
   ↓
[初始化] → [1, 2]
   ↓
[遍歷計算] → 當前階 = 前一階 + 前兩階
   ↓
[返回結果] → 最終方法數
```

## 程式碼實現

```typescript
/**
 * 計算爬樓梯的所有可能方法數
 *
 * 原理：每一階的方法數等於前兩階方法數的總和
 * - 從 n-1 階爬 1 步到達 n 階
 * - 從 n-2 階爬 2 步到達 n 階
 */
function climbStairs(totalStairs: number): number {
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
      twoStepsBefore + oneStepBefore
    ];
  });

  return oneStepBefore;
}
```

### 程式碼說明

1. **基礎案例處理**
   - 當階數 ≤ 2 時，直接返回階數值
   - n = 1 返回 1（一種方法）
   - n = 2 返回 2（兩種方法）

2. **狀態追蹤**
   - `twoStepsBefore`：前兩階的方法數
   - `oneStepBefore`：前一階的方法數

3. **現代 JavaScript 特性**
   - 使用解構賦值簡化變數交換
   - 使用 Array.from 替代傳統迴圈
   - 採用箭頭函數提高可讀性

### 複雜度分析

- **時間複雜度**：O(n)
  - 需要計算從第 3 階到第 n 階
  - 每階只計算一次

- **空間複雜度**：O(1)
  - 只需要兩個變數儲存狀態
  - 不需要額外的陣列空間
