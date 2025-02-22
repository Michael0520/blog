---
title: Array Filter Implementation
description: Implementation Array Filter Function
date: 2025-02-23
read: '10'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  Array Filter Implementation

  #description
  難度：Medium

  #content
  ## 題目描述

  實作一個獨立的 array filter 函數，功能等同於 Array.prototype.filter：

  ```typescript
  /**
   * Array filter implementation
   * @param array - 要過濾的陣列
   * @param callbackFn - 過濾函數，返回 true 表示保留該元素
   * @param thisArg - 可選的 this 上下文
   * @returns 過濾後的新陣列
   */
  export default function arrayFilter<T>(
    array: T[],
    callbackFn: (element: T, index: number, array: T[]) => boolean,
    thisArg?: any
  ): T[];
  ```

  #footer
  :badge[Array]
  :badge[TypeScript]
  :badge[JavaScript]
  ::
::

## 解題思路

### 1. 定義實作步驟

首先列出需要實作的步驟：

```typescript
export default function arrayFilter<T>(
  array: T[],
  callbackFn: (element: T, index: number, array: T[]) => boolean,
  thisArg?: any
): T[] {
  // 步驟 1: 參數檢查
  // - 檢查 array 是否為陣列
  // - 檢查 callbackFn 是否為函數

  // 步驟 2: 初始化
  // - 建立結果陣列
  // - 取得陣列長度

  // 步驟 3: 遍歷處理
  // - 遍歷原陣列
  // - 處理稀疏陣列
  // - 執行回調函數
  // - 根據結果決定是否保留

  // 步驟 4: 返回結果
  // - 返回過濾後的新陣列
}
```

### 2. 參數檢查

實作第一步 - 參數檢查：

```typescript
// 步驟 1: 參數檢查
if (!Array.isArray(array)) {
  throw new TypeError('First argument must be an array');
}

if (typeof callbackFn !== 'function') {
  throw new TypeError('callbackFn must be a function');
}
```

這一步驟確保：

- array 參數必須是陣列
- callbackFn 必須是函數

### 3. 初始化

實作第二步 - 初始化必要變數：

```typescript
// 步驟 2: 初始化
const result: T[] = [];
const length = array.length;
```

這一步驟：
- 建立空陣列儲存結果
- 快取陣列長度提升效能

### 4. 遍歷處理

實作第三步 - 遍歷並過濾元素：

```typescript
// 步驟 3: 遍歷處理
for (let i = 0; i < length; i++) {
  // 處理稀疏陣列
  if (i in array) {
    const element = array[i];
    // 執行回調並檢查結果
    if (callbackFn.call(thisArg, element, i, array)) {
      result.push(element);
    }
  }
}
```

這一步驟：
- 使用 for 迴圈遍歷
- 使用 in 運算符處理稀疏陣列
- 使用 call 綁定 this 上下文
- 根據回調結果決定是否保留

### 5. 完整實作

將前面的步驟組合起來：

```typescript
export default function arrayFilter<T>(
  array: T[],
  callbackFn: (element: T, index: number, array: T[]) => boolean,
  thisArg?: any
): T[] {
  // 1. 參數檢查
  if (!Array.isArray(array)) {
    throw new TypeError('First argument must be an array');
  }

  if (typeof callbackFn !== 'function') {
    throw new TypeError('callbackFn must be a function');
  }

  // 2. 初始化
  const result: T[] = [];
  const length = array.length;

  // 3. 遍歷處理
  for (let i = 0; i < length; i++) {
    if (i in array) {
      const element = array[i];
      if (callbackFn.call(thisArg, element, i, array)) {
        result.push(element);
      }
    }
  }

  // 4. 返回結果
  return result;
}
```

## 使用範例

### 1. 基本過濾

```typescript
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = arrayFilter(numbers, x => x % 2 === 0);
console.log(evenNumbers); // [2, 4]
```

### 2. 使用 this 上下文

```typescript
const filter = {
  min: 3,
  max: 8
};

const filtered = arrayFilter(
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  function (this: typeof filter, num) {
    return num >= this.min && num <= this.max;
  },
  filter
);
console.log(filtered); // [3, 4, 5, 6, 7, 8]
```

### 3. 處理稀疏陣列

```typescript
// eslint-disable-next-line no-sparse-arrays
const sparse = [1, , 3, , 5];
const result = arrayFilter(sparse, x => x > 2);
console.log(result); // [3, 5]
```

## 測試案例

```typescript
describe('arrayFilter', () => {
  test('基本過濾', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = arrayFilter(arr, x => x % 2 === 0);
    expect(result).toEqual([2, 4]);
  });

  test('使用 thisArg', () => {
    const thisArg = { multiplier: 2 };
    const arr = [1, 2, 3];
    const result = arrayFilter(
      arr,
      function (this: typeof thisArg, x) {
        return x * this.multiplier > 4;
      },
      thisArg
    );
    expect(result).toEqual([3]);
  });

  test('稀疏陣列', () => {
    // eslint-disable-next-line no-sparse-arrays
    const arr = [1, , 3, , 5];
    const result = arrayFilter(arr, x => x > 2);
    expect(result).toEqual([3, 5]);
  });

  test('錯誤處理', () => {
    expect(() => {
      arrayFilter(null as any, x => x > 0);
    }).toThrow(TypeError);
  });
});
```
