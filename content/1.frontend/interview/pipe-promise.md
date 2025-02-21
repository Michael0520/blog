---
title: Pipe Promise
description: Implement Promise Pipeline
date: 2025-02-22
read: '10'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  Promise Pipeline 實作

  #description
  難度：Medium

  #content
  ## 題目描述

  實作一個 pipePromise 函數，可以將多個回傳 Promise 的函數串接起來：

  ```typescript
  type FnPromise = (...args: any[]) => Promise<any>;

  /**
   * Executes a series of promise-returning functions in a pipeline fashion.
   *  pipePromise(fn1, fn2, fn3, ...)
   *
   * @param fns - The promise-returning functions to be executed in order.
   * @returns A promise that resolves to the final result of the pipeline.
   * @example
   *    const add =  (a) => Promise.resolve(a + 1);
   *    const toString =  (a) => Promise.resolve(a + '');
   *    const format = pipePromise(add, toString);
   *    await format(1)  -->  '2'
   *    await format(9527)  -->  '9528'
   */
  export function pipePromise<T extends FnPromise[]>(...fns: T) {
    // TODO Please add your codes here
  }

  // 範例
  const add = a => Promise.resolve(a + 1);
  const toString = a => Promise.resolve(`${a}`);

  const format = pipePromise(add, toString);
  await format(1); // → '2'
  await format(9527); // → '9528'
  ```

  ## 實作要求

  1. **型別定義**
     - 正確處理泛型型別
     - 保持型別推導
     - 支援任意數量的函數

  2. **錯誤處理**
     - 正確傳遞錯誤
     - 保持 Promise 鏈
     - 清理資源

  ::alert{title="核心考點" type="info"}
  1. Promise 串接處理
  2. TypeScript 泛型應用
  3. 函數式編程概念
  ::

  #footer
  :badge[Promise]
  :badge[TypeScript]
  :badge[FP]
  ::
::

## 解題思路

### 1. 基本實作

最簡單的實作方式是使用 reduce：

```typescript
export function pipePromise<T extends FnPromise[]>(...fns: T) {
  return async (input: any) => {
    return fns.reduce(async (promise, fn) => {
      const result = await promise;
      return fn(result);
    }, Promise.resolve(input));
  };
}
```

### 2. 簡潔版本

避免不必要的 Promise 包裝：

```typescript
export function pipePromise<T extends FnPromise[]>(...fns: T) {
  return async (input: any) => {
    let result = input;

    for (const fn of fns) {
      result = await fn(result);
    }

    return result;
  };
}
```

## 重要概念

### 1. Promise 串接

- 每個函數都必須回傳 Promise
- 前一個函數的結果會傳給下一個函數
- 需要正確處理 async/await

### 2. 效能考量

- 避免不必要的 Promise 包裝
- 減少記憶體使用

## 測試範例

```typescript
describe('pipePromise', () => {
  const add = (a: number) => Promise.resolve(a + 1);
  const multiply = (a: number) => Promise.resolve(a * 2);
  const toString = (a: number) => Promise.resolve(String(a));

  test('basic pipe', async () => {
    const pipe = pipePromise(add, toString);
    expect(await pipe(1)).toBe('2');
  });

  test('multiple functions', async () => {
    const pipe = pipePromise(add, multiply, toString);
    expect(await pipe(1)).toBe('4');
  });

  test('error handling', async () => {
    const throwError = () => Promise.reject(new Error('test'));
    const pipe = pipePromise(add, throwError, toString);
    await expect(pipe(1)).rejects.toThrow('test');
  });
});
```

## 進階討論

1. **為什麼不用 Promise.then?**
   - async/await 更現代化
   - 錯誤處理更直觀

2. **實際應用場景**
   - API 請求串接
   - 資料轉換流程
   - 非同步操作集合
