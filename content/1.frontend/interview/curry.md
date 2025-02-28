---
title: Function Currying
description: Implement a Curry Function
date: 2025-03-01
read: '15'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:function-square
  icon-size: 26
  ---

  #title
  Implement a Curry Function

  #description
  難度：Medium

  #content
  ## 題目描述

  實作一個 curry 函數，將接受多個參數的函數轉換為一系列只接受單一參數的函數，每個函數都會返回一個新的函數，直到收集到足夠的參數才執行原始函數。

  ```typescript
  /**
   * 將多參數函數轉換為柯里化函數
   * @param fn - 原始函數
   * @returns 柯里化後的函數，每次只接受一個參數
   *
   * @example
   * function add(a, b) { return a + b; }
   * const curriedAdd = curry(add);
   * curriedAdd(3)(4); // 7
   */
  type Curry<P extends any[], R> =
    P extends []
      ? () => R
      : P extends [infer First, ...infer Rest]
        ? (arg: First) => Curry<Rest, R>
        : never;

  function curry<P extends any[], R>(fn: (...args: P) => R): Curry<P, R> {
    // TODO: 實作此函數
  }
  ```

  ### 核心要求

  1. **單一參數原則**
     - 每個返回的函數必須且只能接受一個參數
     - 不允許一次傳入多個參數

     ```typescript
     // ✅ 正確：每次只傳入一個參數
     curriedAdd(3)(4);

     // ❌ 錯誤：一次傳入多個參數
     curriedAdd(3, 4);
     ```

  ### 使用範例

  ```typescript
  // 範例 1：基礎加法
  function add(a, b) {
    return a + b;
  }

  const curriedAdd = curry(add);
  curriedAdd(3)(4); // 7

  // 可以儲存部分參數
  const addThree = curriedAdd(3);
  addThree(4); // 7
  ```

  ```typescript
  // 範例 2：三數相乘
  function multiply(a, b, c) {
    return a * b * c;
  }

  const curriedMultiply = curry(multiply);
  curriedMultiply(4)(5)(6); // 120

  // 逐步儲存參數
  const multiplyWithFour = curriedMultiply(4);
  const multiplyWithFourAndFive = multiplyWithFour(5);
  multiplyWithFourAndFive(6); // 120
  ```

  #footer
  :badge[Function]
  :badge[Currying]
  :badge[TypeScript]
  ::
::

## 解題思路

### 1. 理解柯里化的本質

柯里化的核心概念可以分為以下幾個部分：

1. **參數的轉換與儲存**
   ```typescript
   // 原始函數
   function add(a, b) { return a + b; }

   // 柯里化後
   function curriedAdd(a) {
     // 透過閉包儲存第一個參數
     return function (b) {
       // 使用儲存的參數進行計算
       return a + b;
     };
   }
   ```

2. **遞迴的特性**
   - 每次調用都返回一個新函數
   - 直到參數數量滿足原始函數需求
   - 最後一次調用執行實際運算

### 2. 實作方案

```typescript
function curry<P extends any[], R>(fn: (...args: P) => R): Curry<P, R> {
  function curried(this: any, ...args: any[]): any {
    // 檢查是否已收集足夠的參數
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    // 返回新的函數，等待下一個參數
    return (nextArg: any) =>
      nextArg === undefined
        ? curried.apply(this, args)
        : curried.apply(this, [...args, nextArg]);
  }

  return curried as Curry<P, R>;
}
```

### 3. 實作細節解析

1. **型別系統設計**
   ```typescript
   type Curry<P extends any[], R> =
     P extends []
       ? () => R
       : P extends [infer First, ...infer Rest]
         ? (arg: First) => Curry<Rest, R>
         : never;
   ```
   - 使用遞迴型別定義
   - 保證型別安全
   - 支援任意數量的參數

2. **參數管理**
   ```typescript
   if (args.length >= fn.length) {
     return fn.apply(this, args);
   }
   ```
   - 追蹤參數數量
   - 維護函數上下文
   - 正確處理 this 綁定

3. **閉包運用**
   ```typescript
   return (nextArg: any) => curried.apply(this, [...args, nextArg]);
   ```
   - 利用閉包儲存狀態
   - 保持參數的不可變性
   - 確保函數的純粹性

## 進階主題

### 1. 效能優化版本

```typescript
function curry<P extends any[], R>(fn: (...args: P) => R): Curry<P, R> {
  const argsCache = new WeakMap();

  return function curried(this: any, ...args: any[]): any {
    const cachedArgs = argsCache.get(this) || [];
    const allArgs = [...cachedArgs, ...args];

    if (allArgs.length >= fn.length) {
      argsCache.delete(this);
      return fn.apply(this, allArgs);
    }

    argsCache.set(this, allArgs);
    return curried.bind(this);
  };
}
```

### 2. 實際應用場景

1. **API 請求配置**
   ```typescript
   const createRequest = curry(
     (baseUrl: string, path: string, params: Record<string, any>) =>
       fetch(`${baseUrl}${path}`, { params })
   );

   const apiClient = createRequest('https://api.example.com');
   const getUserAPI = apiClient('/users');
   getUserAPI({ id: 1 }); // 發送請求
   ```

2. **事件處理器**
   ```typescript
   const handleEvent = curry(
     (eventType: string, handler: (e: Event) => void, event: Event) =>
       handler(event)
   );

   const handleClick = handleEvent('click');
   const logClick = handleClick(console.log);
   element.addEventListener('click', logClick);
   ```

### 3. 測試用例

```typescript
describe('curry 函數測試', () => {
  test('基本的雙參數函數', () => {
    const add = (a: number, b: number) => a + b;
    const curriedAdd = curry(add);
    expect(curriedAdd(2)(3)).toBe(5);
  });

  test('保持函數上下文', () => {
    const calculator = {
      factor: 2,
      multiply(a: number, b: number) {
        return a * b * this.factor;
      },
    };
    const curriedMultiply = curry(calculator.multiply.bind(calculator));
    expect(curriedMultiply(3)(4)).toBe(24);
  });

  test('處理多參數函數', () => {
    const add3 = (a: number, b: number, c: number) => a + b + c;
    const curriedAdd3 = curry(add3);
    expect(curriedAdd3(1)(2)(3)).toBe(6);
  });
});
```

## 常見陷阱

1. **上下文丟失**
   - 需要正確處理 this 綁定
   - 使用 bind、apply 或箭頭函數

2. **型別安全**
   - 確保完整的型別推導
   - 處理邊界情況

3. **記憶體管理**
   - 及時清理暫存的參數
   - 使用 WeakMap 避免記憶體洩漏

## 面試重點

1. **核心概念**
   - 柯里化與偏函數應用的區別
   - 閉包的運用
   - 函數式程式設計的優點

2. **延伸問題**
   - 如何處理可選參數？
   - 如何支援不定參數？
   - 如何實現反柯里化？
