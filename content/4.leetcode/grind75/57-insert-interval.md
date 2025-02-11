---
title: Medium 57 - Insert Interval
description: In this blog I will share a solution to the insert interval problem.
date: 2025-02-12
read: '10'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  [題目連結](https://leetcode.com/problems/insert-interval)

  #description
  難度：Medium

  #content
  目標：將新的區間插入到已排序的區間列表中，並合併重疊的區間

  ::br
  ::br
  example:

  ```bash
  Input: intervals = [[1,3],[6,9]], newInterval = [2,5]   [1,3]+[2,5]=[1,5]
  Output: [[1,5],[6,9]]

  Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
  Output: [[1,2],[3,10],[12,16]]   [3,5]+[4,8]+[6,7]+[8,10]=[3,10]
  ```

  ::alert{title="限制條件" type="warning"}
  - 0 <= intervals.length <= 10^4
  - intervals[i].length == 2
  - 0 <= starti <= endi <= 10^5
  ::

  #footer
  :badge[Array]
  :badge[Sorting]
  ::

## 題目解析

這題讓我想起之前開發過的會議室預約系統，當時系統的核心功能就是處理時段重疊的問題，與這題的概念非常相似。

### 實務應用案例

在那個預約系統中，我們需要：
1. 讓使用者選擇想要預約的時段（例如：14:00-16:00）
2. 系統會檢查這個時段是否與其他預約重疊
3. 如果重疊，系統會提示使用者「該時段已被預約」
4. 如果是管理員合併會議，則會像這題一樣將重疊的時段合併

#### 範例一：簡單的重疊情況

```bash
小明預約：   [14:00---15:00]
小華預約：         [14:30------16:00]
合併後：     [14:00----------16:00]
```

在範例一中，如果是一般使用者，系統會拒絕小華的預約請求，但如果是管理員要合併會議，系統就會自動將兩個時段合併。

#### 範例二：複雜的重疊情況

```bash
現有會議： [1-2] [3--5] [6-7] [8--10]    [12----16]
新預約：           [4--------8]
合併後： [1-2] [3----------10]    [12----16]
```

在範例二中，我們可以看到更複雜的合併情況：

1. [1-2] 保持不變，因為它完全在新預約之前
2. [3-5], [6-7], [8-10] 這三個時段都與新預約 [4-8] 有重疊，所以全部合併成一個大區間 [3-10]
3. [12-16] 保持不變，因為它完全在新預約之後

## 解題方法

### 解題思路

這題採用分段處理的方式，將整個過程分為三個階段：

1. **前段處理**：
   - 收集所有結束時間 < 新區間起始時間的區間
   - 這些區間不會與新區間重疊，可以直接保留

2. **重疊處理**：
   - 處理所有與新區間重疊的區間
   - 重疊的判斷條件：
     - 區間的結束時間 ≥ 新區間的起始時間
     - 且 區間的起始時間 ≤ 新區間的結束時間

3. **後段處理**：
   - 收集所有起始時間大於新區間結束時間的區間
   - 這些區間也不會與新區間重疊，可以直接加入結果

### 詳細步驟說明

以範例 `intervals = [[1,3],[6,9]], newInterval = [2,5]` 為例：

1. **找出前段區間**

```typescript
// intervals = [[1,3], [6,9]], newInterval = [2,5]
const newStart = 2;
const before = intervals.filter(([, end]) => end < newStart);
// 檢查 [1,3]：3 不小於 2 ❌
// 檢查 [6,9]：9 不小於 2 ❌
// 結果：before = []
```

2. **找出重疊區間**

```typescript
const [newStart, newEnd] = [2, 5];
const overlap = intervals.filter(([start, end]) =>
  end >= newStart && start <= newEnd
);
// 檢查 [1,3]：3 >= 2 且 1 <= 5 ✅
// 檢查 [6,9]：6 不小於等於 5 ❌
// 結果：overlap = [[1,3]]
```

3. **找出後段區間**

```typescript
const newEnd = 5;
const after = intervals.filter(([start]) => start > newEnd);
// 檢查 [1,3]：1 不大於 5 ❌
// 檢查 [6,9]：6 大於 5 ✅
// 結果：after = [[6,9]]
```

4. **合併重疊區間**

```typescript
const mergedInterval = overlap.length > 0
  ? [
      Math.min(newStart, ...overlap.map(([start]) => start)), // min(2, 1) = 1
      Math.max(newEnd, ...overlap.map(([, end]) => end)) // max(5, 3) = 5
    ]
  : newInterval;
// 結果：mergedInterval = [1,5]
```

### 程式碼實現

```typescript
function insert(intervals: number[][], newInterval: number[]): number[][] {
  // 使用解構賦值取得新區間的起訖點
  const [newStart, newEnd] = newInterval;

  // 1. 找出所有在新區間前面的區間
  const before = intervals.filter(([, end]) => end < newStart);

  // 2. 找出所有重疊的區間
  const overlap = intervals.filter(([start, end]) =>
    end >= newStart && start <= newEnd
  );

  // 3. 找出所有在新區間後面的區間
  const after = intervals.filter(([start]) => start > newEnd);

  // 如果有重疊區間，計算合併後的區間
  const mergedInterval = overlap.length > 0
    ? [
        Math.min(newStart, ...overlap.map(([start]) => start)),
        Math.max(newEnd, ...overlap.map(([, end]) => end))
      ]
    : newInterval;

  // 組合結果
  return [...before, mergedInterval, ...after];
}
```

### 時間複雜度分析

| 複雜度 | 分析 | 說明 |
|--------|------|------|
| 時間 | O(n) | 需要遍歷三次陣列（before、overlap、after），每次 O(n) |
| 空間 | O(n) | 需要存取三個變數陣列（before、overlap、after）和結果陣列 |
