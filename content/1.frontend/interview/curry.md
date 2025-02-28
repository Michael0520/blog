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
  Function Currying Implementation

  #description
  難度：Medium

  #content
  ## 題目描述

  實作一個 curry 函數，將接受多個參數的函數轉換為一系列只接受單一參數的函數，每個函數都返回一個新函數，直到收集到足夠的參數才執行原始函數。

  ::alert{type="info"}
  柯里化（Currying）是將一個接受多個參數的函數，轉換為一系列只接受單一參數的函數的技術。
  ::

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

  ### 關鍵要求

  1. **單一參數**
     - 每個返回的函數必須且只能接受一個參數
     - 不允許一次傳入多個參數

     ```typescript
     // ✅ 正確：每次只傳入一個參數
     curriedAdd(3)(4);

     // ❌ 錯誤：一次傳入多個參數
     curriedAdd(3, 4);
     ```

    Examples

    ```typescript
    function add(a, b) {
      return a + b;
    }

    const curriedAdd = curry(add);
    curriedAdd(3)(4); // 7

    const alreadyAddedThree = curriedAdd(3);
    alreadyAddedThree(4); // 7
    ```

    ```typescript
    function multiplyThreeNumbers(a, b, c) {
      return a * b * c;
    }

    const curriedMultiplyThreeNumbers = curry(multiplyThreeNumbers);
    curriedMultiplyThreeNumbers(4)(5)(6); // 120

    const containsFour = curriedMultiplyThreeNumbers(4);
    const containsFourMulFive = containsFour(5);
    containsFourMulFive(6); // 120
    ```

  #footer
  :badge[Function]
  :badge[Currying]
  :badge[TypeScript]
  ::
::

  ## 解題思路

  ### 1. 理解柯里化

  柯里化過程可以分解為以下步驟：

  1. **參數轉換**
     ```typescript
     // 原始函數
     function add(a, b) { return a + b; }

     // 柯里化後
     function curriedAdd(a) {
       return function (b) {
         return a + b;
       };
     }
     ```

  2. **參數追蹤**
     ```typescript
     // 內部實作需要追蹤參數
     function curry(fn) {
       return function curried(firstArg) {
         // 保存第一個參數
         return function (secondArg) {
           // 組合所有參數並執行
           return fn(firstArg, secondArg);
         };
       };
     }
     ```

  3. **執行時機**
     ```typescript
     // 參數不足時：返回新函數
     curriedAdd(3); // → function(b) { ... }

     // 參數足夠時：執行並返回結果
     curriedAdd(3)(4); // → 7
     ```

  ### 2. 實作步驟

  ```typescript
  function curry<P extends any[], R>(fn: (...args: P) => R): Curry<P, R> {
    // 步驟 1: 檢查參數數量
    // - 使用 fn.length 獲取原始函數需要的參數數量
    const requiredArgs = fn.length;

    // 步驟 2: 建立柯里化函數
    function curried(this: { args?: any[] } | undefined, arg: any): any {
      // 步驟 3: 收集參數
      // - 使用 this 儲存之前的參數
      // - 添加新的參數
      const args = this?.args ? [...this.args, arg] : [arg];

      // 步驟 4: 檢查參數數量
      // - 如果參數足夠，執行原始函數
      // - 如果參數不足，返回新函數
      return args.length >= requiredArgs
        ? fn(...args as P)
        : curried.bind({ args });
    }

    return curried as Curry<P, R>;
  }
  ```

  ## 詳細解析

  ### 1. 型別定義

  ```typescript
  // 定義柯里化後的函數型別
  type Curry<P extends any[], R> =
    P extends []
      ? () => R
      : P extends [infer First, ...infer Rest]
        ? (arg: First) => Curry<Rest, R>
        : never;

  // 使用遞迴型別來處理任意數量的參數
  type CurryExample =
    Curry<[number, string, boolean], number>;
  // 等同於
  // (arg: number) => (arg: string) => (arg: boolean) => number
  ```

  ### 2. 參數處理

  ```typescript
  function curry<P extends any[], R>(fn: (...args: P) => R): Curry<P, R> {
    function curried(this: { args?: any[] } | undefined, arg: any): any {
      // 確保每次只接受一個參數
      const args = this?.args ? [...this.args, arg] : [arg];

      if (args.length >= fn.length) {
        // 參數足夠：執行原始函數
        return fn(...args as P);
      } else {
        // 參數不足：返回綁定新參數的函數
        return curried.bind({ args });
      }
    }

    return curried as Curry<P, R>;
  }
  ```

  ### 3. 完整實作

  ```typescript
  function curry<P extends any[], R>(fn: (...args: P) => R): Curry<P, R> {
    function curried(this: { args?: any[] } | undefined, arg: any): any {
      // 驗證參數
      if (arguments.length !== 1) {
        throw new Error('Each function must take exactly one argument');
      }

      // 收集參數
      const args = this?.args ? [...this.args, arg] : [arg];

      // 檢查參數數量
      return args.length >= fn.length
        ? fn(...args as P)
        : curried.bind({ args });
    }

    // 保留原始函數資訊
    Object.defineProperties(curried, {
      length: { value: 1 },
      name: { value: `curried ${fn.name}` }
    });

    return curried as Curry<P, R>;
  }
  ```

  ## 測試案例

  ```typescript
  describe('curry', () => {
    test('應該每次只接受一個參數', () => {
      const add = (a: number, b: number) => a + b;
      const curriedAdd = curry(add);

      expect(() => curriedAdd(1, 2)).toThrow();
      expect(curriedAdd(1)(2)).toBe(3);
    });

    test('應該正確處理多個參數的函數', () => {
      const multiply = (a: number, b: number, c: number) => a * b * c;
      const curriedMultiply = curry(multiply);

      const step1 = curriedMultiply(2); // 保存第一個參數
      const step2 = step1(3); // 保存第二個參數
      const result = step2(4); // 執行並返回結果

      expect(result).toBe(24);
    });

    test('應該保持型別安全', () => {
      const concat = (a: string, b: number) => a + b;
      const curriedConcat = curry(concat);

      // @ts-expect-error - 型別錯誤
      curriedConcat(123);

      expect(curriedConcat('hello')(42)).toBe('hello42');
    });
  });
  ```

  ## 進階討論

  ### 1. 效能優化

  ```typescript
  // 使用 WeakMap 優化記憶體使用
  function curry<P extends any[], R>(fn: (...args: P) => R): Curry<P, R> {
    const argsMap = new WeakMap();

    function curried(this: any, arg: any): any {
      const args = argsMap.get(this) || [];
      const newArgs = [...args, arg];

      if (newArgs.length >= fn.length) {
        argsMap.delete(this);
        return fn(...newArgs as P);
      }

      const next = function (nextArg: any) {
        return curried.call(this, nextArg);
      };

      argsMap.set(next, newArgs);
      return next;
    }

    return curried as Curry<P, R>;
  }
  ```

  ### 2. 實際應用

  1. **API 請求配置**

  ```typescript
  const createRequest = curry(
    (baseUrl: string, path: string, params: object) =>
      fetch(`${baseUrl}${path}`, { params })
  );

  const apiRequest = createRequest('https://api.example.com');
  const getUser = apiRequest('/users');
  getUser({ id: 1 });
  ```

  2. **事件處理**

  ```typescript
  const handleEvent = curry(
    (eventName: string, handler: (event: Event) => void, event: Event) =>
      handler(event)
  );

  const handleClick = handleEvent('click');
  const logClick = handleClick(console.log);
  element.addEventListener('click', logClick);
  ```

  ### 3. 注意事項

  1. **記憶體管理**
     - 使用 WeakMap 或 WeakSet 來管理參數
     - 即時清理不需要的參數

  2. **型別推導限制**
     - TypeScript 可能無法完全推導複雜的柯里化型別
     - 需要手動指定一些型別

  3. **錯誤處理**
     - 處理參數型別錯誤
     - 處理參數數量錯誤
