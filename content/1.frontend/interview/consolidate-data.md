---
title: Data Aggregation
description: Implement a Reading Analytics Aggregator
date: 2025-02-26
read: '12'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  Reading Analytics Aggregator

  #description
  難度：Easy

  #content
  ## 題目說明

  你正在為一家電子書公司開發閱讀分析系統。系統收集了用戶閱讀行為的原始數據，但需要將這些數據合併以產出有意義的報告。

  原始數據是一個包含多個閱讀記錄的陣列，每條記錄包含：

  - `readerId`: 讀者ID
  - `timeSpent`: 閱讀時間（分鐘）
  - `titles`: 閱讀的書籍標題陣列

  ```typescript
  const readingLogs = [
    { readerId: 101, timeSpent: 45, titles: ['Dune'] },
    { readerId: 203, timeSpent: 30, titles: ['Neuromancer', 'Snow Crash'] },
    { readerId: 101, timeSpent: 25, titles: ['Foundation', 'Dune'] },
    { readerId: 157, timeSpent: 15, titles: ['The Hobbit'] },
    { readerId: 203, timeSpent: 70, titles: ['Snow Crash'] },
    { readerId: 157, timeSpent: 60, titles: ['The Hobbit', 'The Fellowship of the Ring'] },
  ];
  ```

  請實作一個 `aggregateReadingData` 函數，將這些原始記錄合併成每位讀者的摘要報告：

  ```typescript
  /**
   * 合併閱讀數據產出讀者報告
   * @param logs - 原始閱讀記錄
   * @returns 合併後的讀者報告
   */
  function aggregateReadingData(logs: ReadingLog[]): ReaderReport[] {
  }

  interface ReadingLog {
    readerId: number;
    timeSpent: number;
    titles: string[];
  }

  interface ReaderReport {
    readerId: number;
    totalTime: number;
    uniqueTitles: string[];
  }
  ```

  合併規則：

  1. 每位讀者只產出一份報告
  2. `totalTime` 是該讀者所有記錄的 `timeSpent` 總和
  3. `uniqueTitles` 是該讀者閱讀過的所有不重複書籍標題，按字母順序排序
  4. 報告順序應按照讀者在原始數據中首次出現的順序排列
  5. 不得修改原始數據

  範例輸出：

  ```typescript
  [
    { readerId: 101, totalTime: 70, uniqueTitles: ['Dune', 'Foundation'] },
    { readerId: 203, totalTime: 100, uniqueTitles: ['Neuromancer', 'Snow Crash'] },
    { readerId: 157, totalTime: 75, uniqueTitles: ['The Fellowship of the Ring', 'The Hobbit'] }
  ];
  ```

  #footer
  :badge[Data Processing]
  :badge[Algorithms]
  ::
::

## 解題思路

### 1. 需求分析

首先，讓我們分析一下這個問題的核心需求：

1. **資料合併**：將同一讀者的多條記錄合併為一條
2. **時間累加**：將同一讀者的閱讀時間相加
3. **書籍去重**：移除重複的書籍標題並排序
4. **保持順序**：維持讀者首次出現的順序
5. **不可變性**：不修改輸入數據

### 2. 解決方案設計

我們可以將解決方案分為三個主要步驟：

1. **初始化數據結構**：新增必要的數據結構來追蹤讀者和他們的數據
2. **遍歷與合併**：處理每條記錄，更新相應讀者的合併數據
3. **產出結果**：按照原始順序組成最終報告

```typescript
function aggregateReadingData(logs: ReadingLog[]): ReaderReport[] {
  // 步驟 1: 初始化資料結構
  // - 新增追蹤讀者順序的陣列
  // - 新增暫存資料的 Map

  // 步驟 2: 遍歷原始記錄
  // - 檢查讀者是否已存在
  // - 如果是新讀者，初始化並記錄順序
  // - 如果是已存在讀者，更新累計時間和書籍列表

  // 步驟 3: 產出最終報告
  // - 按照原始順序組成結果
  // - 對每位讀者的書籍標題排序
  // - 返回合併後的報告
}
```

## 詳細解析

### 步驟 1: 初始化數據結構

在這一步，我們新增了兩個關鍵的數據結構：

```typescript
// 追蹤讀者首次出現順序
const readerOrder: number[] = [];

// 存儲每位讀者的合併數據
const readerMap = new Map<number, {
  totalTime: number;
  titleSet: Set<string>; // 使用 Set 自動去重
}>();
```

- `readerOrder` 陣列用於記錄讀者首次出現的順序，這將幫助我們在最終結果中保持原始順序
- `readerMap` 是一個 Map，其中鍵是讀者 ID，值是包含總閱讀時間和書籍集合的對象
- 我們使用 `Set` 來存儲書籍標題，因為它能自動去除重複項

### 步驟 2: 遍歷原始記錄

接下來，我們遍歷每條閱讀記錄，並根據讀者 ID 進行合併：

```typescript
for (const { readerId, timeSpent, titles } of logs) {
  // 檢查讀者是否已存在
  if (!readerMap.has(readerId)) {
    // 如果是新讀者，初始化並記錄順序
    readerMap.set(readerId, {
      totalTime: timeSpent,
      titleSet: new Set(titles)
    });
    readerOrder.push(readerId);
  } else {
    // 如果是已存在讀者，更新累計時間和書籍列表
    const readerData = readerMap.get(readerId)!;
    readerData.totalTime += timeSpent;

    // 將新書籍添加到集合中
    titles.forEach(title => readerData.titleSet.add(title));
  }
}
```

這段代碼的邏輯是：
- 如果讀者是首次出現，我們新增一個新的記錄並將其 ID 添加到順序陣列中
- 如果讀者已經存在，我們更新其總閱讀時間，並將新的書籍標題添加到集合中

### 步驟 3: 產出最終報告

最後，我們根據讀者順序產出最終報告：

```typescript
return readerOrder.map((readerId) => {
  const { totalTime, titleSet } = readerMap.get(readerId)!;

  // 組成最終報告對象，並對書籍標題排序
  return {
    readerId,
    totalTime,
    uniqueTitles: Array.from(titleSet).sort()
  };
});
```

在這一步：

- 我們遍歷 `readerOrder` 陣列，確保結果按照讀者首次出現的順序排列
- 對於每位讀者，我們從 `readerMap` 中獲取其合併數據
- 將 `titleSet` 轉換為陣列並排序，確保書籍標題按字母順序排列
- 返回符合 `ReaderReport` 介面的對象

## 優化考量

### 1. 時間複雜度

- **遍歷原始記錄**：O(n)，其中 n 是記錄數量
- **處理書籍標題**：O(m)，其中 m 是每條記錄中的書籍數量
- **排序書籍標題**：O(k log k)，其中 k 是每位讀者的唯一書籍數量
- **總體時間複雜度**：O(n + r * k log k)，其中 r 是唯一讀者數量

### 2. 空間複雜度

- **讀者順序陣列**：O(r)
- **讀者數據 Map**：O(r)
- **書籍集合**：O(t)，其中 t 是所有唯一書籍的總數
- **總體空間複雜度**：O(r + t)

### 3. 效能優化

如果處理大量數據，可以考慮以下優化：

```typescript
// 優化版本
function aggregateReadingData(logs: ReadingLog[]): ReaderReport[] {
  const readerOrder: number[] = [];
  const readerMap = new Map<number, {
    totalTime: number;
    titleSet: Set<string>;
  }>();

  // 使用 for 循環而非 forEach 可能在大數據集上更高效
  for (let i = 0; i < logs.length; i++) {
    const { readerId, timeSpent, titles } = logs[i];

    if (!readerMap.has(readerId)) {
      readerMap.set(readerId, {
        totalTime: timeSpent,
        titleSet: new Set(titles)
      });
      readerOrder.push(readerId);
    } else {
      const data = readerMap.get(readerId)!;
      data.totalTime += timeSpent;

      // 只有當 titles 不為空時才遍歷
      if (titles.length > 0) {
        for (let j = 0; j < titles.length; j++) {
          data.titleSet.add(titles[j]);
        }
      }
    }
  }

  const result: ReaderReport[] = Array.from({ length: readerOrder.length });

  // 預先分配結果陣列大小
  for (let i = 0; i < readerOrder.length; i++) {
    const readerId = readerOrder[i];
    const { totalTime, titleSet } = readerMap.get(readerId)!;

    result[i] = {
      readerId,
      totalTime,
      uniqueTitles: Array.from(titleSet).sort()
    };
  }

  return result;
}
```

## 測試案例

```typescript
describe('aggregateReadingData', () => {
  test('基本合併功能', () => {
    const logs = [
      { readerId: 101, timeSpent: 45, titles: ['Dune'] },
      { readerId: 203, timeSpent: 30, titles: ['Neuromancer', 'Snow Crash'] },
      { readerId: 101, timeSpent: 25, titles: ['Foundation', 'Dune'] },
      { readerId: 157, timeSpent: 15, titles: ['The Hobbit'] },
      { readerId: 203, timeSpent: 70, titles: ['Snow Crash'] },
      { readerId: 157, timeSpent: 60, titles: ['The Hobbit', 'The Fellowship of the Ring'] },
    ];

    const expected = [
      { readerId: 101, totalTime: 70, uniqueTitles: ['Dune', 'Foundation'] },
      { readerId: 203, totalTime: 100, uniqueTitles: ['Neuromancer', 'Snow Crash'] },
      { readerId: 157, totalTime: 75, uniqueTitles: ['The Fellowship of the Ring', 'The Hobbit'] }
    ];

    expect(aggregateReadingData(logs)).toEqual(expected);
  });

  test('空陣列處理', () => {
    expect(aggregateReadingData([])).toEqual([]);
  });

  test('單一讀者多條記錄', () => {
    const logs = [
      { readerId: 101, timeSpent: 10, titles: ['Book A'] },
      { readerId: 101, timeSpent: 20, titles: ['Book B'] },
      { readerId: 101, timeSpent: 30, titles: ['Book A', 'Book C'] },
    ];

    const expected = [
      { readerId: 101, totalTime: 60, uniqueTitles: ['Book A', 'Book B', 'Book C'] },
    ];

    expect(aggregateReadingData(logs)).toEqual(expected);
  });

  test('空書籍列表處理', () => {
    const logs = [
      { readerId: 101, timeSpent: 10, titles: [] },
      { readerId: 101, timeSpent: 20, titles: ['Book A'] },
    ];

    const expected = [
      { readerId: 101, totalTime: 30, uniqueTitles: ['Book A'] },
    ];

    expect(aggregateReadingData(logs)).toEqual(expected);
  });

  test('輸入不變性', () => {
    const logs = [
      { readerId: 101, timeSpent: 10, titles: ['Book A'] },
      { readerId: 102, timeSpent: 20, titles: ['Book B'] },
    ];

    const logsCopy = JSON.parse(JSON.stringify(logs));
    aggregateReadingData(logs);

    expect(logs).toEqual(logsCopy);
  });
});
```

## 實際應用

這種數據合併模式在實際開發中非常常見，例如：

1. **用戶行為分析**：合併用戶在不同時間點的行為數據
2. **內容推薦**：基於用戶閱讀偏好產出推薦
3. **報表產出**：將原始數據轉換為管理層報表
