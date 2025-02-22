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
  難度：Medium

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

### 1. 定義實作步驟

首先列出需要實作的步驟：

```typescript
export default function memoize<T extends Fn>(fun: T): T {
  // 步驟 1: 建立快取儲存
  // - 使用 Map 儲存結果

  // 步驟 2: 建立快取鍵生成函數
  // - 將參數轉換為唯一的字串

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
