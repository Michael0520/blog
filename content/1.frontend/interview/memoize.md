---
title: Function Memoization
description: Implement a Memoize Function
date: 2025-02-23 19:00
read: '10'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  Function Memoization Implementation

  #description
  難度：Easy

  #content
  ## 題目描述

  實作一個 memoize 函數，需要符合以下範例的行為：

  ```typescript
  /*
  let callCount = 0;
  const memoizedFn = memoize(function (a, b) {
    callCount += 1;
    return a + b;
  });
  memoizedFn(2, 3); // 5
  memoizedFn(2, 3); // 5
  console.log(callCount); // 1

  memoizedFn(1, -1); // 0
  console.log(callCount); // 2
  */

  type Fn = (...args: any[]) => any;
  export default function memoize<T extends Fn>(fun: T): T {
    // TODO Please add your codes here
  }
  ```

  #footer
  :badge[Function]
  :badge[Cache]
  :badge[TypeScript]
  ::
::

## 解題思路

### 1. 需求分析

首先，這題要求我們實作一個記憶函數（memoize function）。記憶函數的主要目的是優化效能，當我們多次呼叫同一個函數，且參數相同時，不需要重複執行計算，而是直接返回之前計算過的結果。

從題目提供的範例可以看出基本的使用方式：
```typescript
let callCount = 0;
const memoizedFn = memoize((a, b) => {
  callCount += 1;
  return a + b;
});
```

這個範例告訴我們幾件重要的事：
1. 我們需要一個計數器來追蹤函數的實際執行次數
2. 原始函數可以接受多個參數
3. 需要返回一個新的函數，這個函數會包含快取機制

當我們執行這個函數時：
```typescript
memoizedFn(2, 3); // 5
memoizedFn(2, 3); // 5
console.log(callCount); // 1
```

可以觀察到：
1. 第一次呼叫時，計算 2 + 3 = 5，並將結果儲存
2. 第二次呼叫時，因為參數相同，直接返回儲存的結果
3. callCount 維持在 1，證明函數只實際執行了一次

再看型別定義：
```typescript
type Fn = (...args: any[]) => any;
export default function memoize<T extends Fn>(fun: T): T;
```

這個型別定義告訴我們：

1. 函數需要支援任意數量和型別的參數
2. 返回值可以是任意型別
3. 需要保持原始函數的型別簽名

綜合以上觀察，Requirement 可以歸納為：

1. 設計一個快取機制來儲存計算結果
2. 找到一個方法來辨別相同的參數組合
3. 確保函數的型別安全

### 2. 技術選擇

根據需求，我們需要選擇以下技術來解這題：

1. **快取儲存**
   - 選擇 Map 作為儲存結構
   - 原因：支援任意型別
   - 效能大於物件字面量

2. **快取鍵生成**
   - 使用 JSON.stringify
   - 原因：能處理多參數
   - 支援基本型別序列化

3. **函數包裝**
   - 使用閉包保持狀態
   - 保留原函數的 this 綁定
   - 維持型別定義

### 3. 實作步驟

基於上述分析，我們可以規劃出實作步驟：

```typescript
export default function memoize<T extends Fn>(fun: T): T {
  // 步驟 1: 建立快取儲存
  // - 使用 Map 儲存結果
  // - 確保執行期間保持狀態

  // 步驟 2: 建立快取鍵生成函數
  // - 將參數轉換為唯一的字串
  // - 處理多參數情況

  // 步驟 3: 實現記憶化邏輯
  // - 檢查快取
  // - 計算新結果
  // - 儲存結果
}
```

### 2. 建立快取機制

```typescript
// 步驟 1 & 2: 快取設置
const cache = new Map<string, any>();

function getCacheKey(...args: any[]): string {
  return JSON.stringify(args);
}
```

### 3. 實現記憶化邏輯

```typescript
// 步驟 3: 記憶化實現
return function (this: any, ...args: any[]) {
  const key = getCacheKey(...args);

  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = fun.apply(this, args);
  cache.set(key, result);
  return result;
} as T;
```

### 4. 完整實作

```typescript
export default function memoize<T extends Fn>(fun: T): T {
  // 步驟 1: 快取設置
  const cache = new Map<string, any>();

  // 步驟 2: 建立快取鍵生成函數
  function getCacheKey(...args: any[]): string {
    return JSON.stringify(args);
  }

  // 步驟 3: 記憶化實現
  return function (this: any, ...args: any[]) {
    const key = getCacheKey(...args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fun.apply(this, args);
    cache.set(key, result);
    return result;
  } as T;
}
```

## 測試案例

```typescript
describe('memoize', () => {
  test('相同參數只計算一次', () => {
    let callCount = 0;
    const memoizedFn = memoize((a, b) => {
      callCount += 1;
      return a + b;
    });

    expect(memoizedFn(2, 3)).toBe(5);
    expect(memoizedFn(2, 3)).toBe(5);
    expect(callCount).toBe(1);
  });

  test('不同參數會重新計算', () => {
    let callCount = 0;
    const memoizedFn = memoize((a, b) => {
      callCount += 1;
      return a + b;
    });

    expect(memoizedFn(2, 3)).toBe(5);
    expect(memoizedFn(1, -1)).toBe(0);
    expect(callCount).toBe(2);
  });
});
```

## 注意事項

1. **快取鍵生成**
   - JSON.stringify 用於參數序列化
   - 適用於基本型別參數

2. **記憶體使用**
   - 快取會持續增長
   - 沒有清理機制

3. **型別處理**
   - 使用泛型保持型別
   - 處理 this 綁定
