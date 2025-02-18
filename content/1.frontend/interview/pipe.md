---
title: Pipe Function Implementation
description: In this blog I will Share a solution to the Pipe Function Implementation problem.
date: 2025-02-18
read: '10'
---

> 在前端面試中，pipe 函數的實作是一個封裝函數組合概念的經典題目，這個題目測試了對函數組合、類型推導和陣列操作的理解

## 題目分析

### 需求說明

實作一個 pipe 函數，可以將多個函數組合成一個新的函數，並按照順序執行

### 函式簽名

```typescript
type Fn = (...args: any[]) => any;
function pipe<T extends Fn[]>(...fns: T): Fn;
```

### 預期行為

```typescript
const add1 = (a: number) => a + 1;
const toString = (a: number) => `${a}`;

const format = pipe(add1, toString);
format(1); // '2'
format(9527); // '9528'
```

## 解題思路

一步一步實作這個 pipe 函數：

```typescript
/**
 * 解題步驟：
 * 1. 接收任意數量的函數作為參數
 * 2. 返回一個新的函數
 * 3. 依序執行所有函數
 * 4. 處理類型推導
 */

type Fn = (...args: any[]) => any;

function pipe<T extends Fn[]>(...fns: T) {
  // 如果沒有傳入函數，返回一個 identity 函數
  if (fns.length === 0) {
    return (x: any) => x;
  }

  // 如果只有一個函數，直接返回該函數
  if (fns.length === 1) {
    return fns[0];
  }

  // 正確的寫法應該是:
  return function piped(...args: any[]) {
    return fns.reduce((result, fn) => fn(...result), args);
  };
}
```

## 進階版本

考慮到類型安全，可以實作一個更嚴格的版本：

```typescript
function typedPipe<A, B>(
  fn1: (arg: A) => B
): (arg: A) => B;

function typedPipe<A, B, C>(
  fn1: (arg: A) => B,
  fn2: (arg: B) => C
): (arg: A) => C;

// 實作
function typedPipe(...fns: Array<(arg: any) => any>) {
  return (input: any) => fns.reduce((acc, fn) => fn(acc), input);
}
```

### 使用範例

```typescript
// 基本使用
const add1 = (x: number) => x + 1;
const toString = (x: number) => x.toString();
const format = pipe(add1, toString);

console.log(format(1)); // '2'
console.log(format(9527)); // '9528'

// 多函數組合
const multiply2 = (x: number) => x * 2;
const addPrefix = (x: string) => `$${x}`;
const formatPrice = pipe(multiply2, toString, addPrefix);

console.log(formatPrice(100)); // '$200'
```

## 進階概念

### 與 RxJS 的關聯

pipe 函數的概念在 RxJS 中被大量使用，RxJS 的 pipe 處理 Observable 資料流，需透過 subscribe 觸發執行，而 pipe 則是同步立即執行

```typescript
// RxJS pipe 範例
import { of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

const source$ = of(1, 2, 3, 4, 5).pipe(
  filter(n => n % 2 === 0),
  map(n => n * 2),
  tap(n => console.log(n))
); // 不會執行，直到 subscribe

source$.subscribe(); // 這時才會執行
```

主要區別：

1. RxJS 的 pipe 經常用於處理非同步數據流
2. 這個範例的 pipe 主要處理同步函數組合
3. RxJS 提供了豐富的操作函式來處理各種場景

### Pipe 與閉包

pipe 也確實運用了閉包的概念，底層程式碼如下：

```typescript
function pipe<T extends Fn[]>(...fns: T) {
  return function piped(...args: any[]) {
    return fns.reduce((result, fn) => [fn(...result)], args)[0];
  };
}
```

閉包的優點：

1. **狀態保存**：內部函數保持對外部 fns 的引用
2. **數據隱藏**：fns 對外部不可見，實現了封裝，使用者不需要關心函數的實作細節
3. **延遲執行**：組合的函數直到調用時才執行

### 實際應用中的閉包優勢

```typescript
// 建立一個通用的資料處理 function
type Validator<T> = (data: T) => T;

function createDataProcessor<T>(validators: Validator<T>[]) {
  return pipe(
    (data: T) => ({ ...data, timestamp: Date.now() }),
    ...validators,
    (data: T) => ({ ...data, processed: true })
  ) as (data: T) => T & { timestamp: number; processed: boolean };
}

// 使用特定的驗證規則
const processUserData = createDataProcessor([
  validateAge,
  validateEmail,
  validateAddress
]);

// 之後直接使用
const result = processUserData(rawUserData);
```

這個例子實現了：

1. 閉包如何建立可配置的函數
2. 如何保持對外部配置的引用，確保資料流統一
3. 如何實現資料的封裝和保護

## 效能考慮

使用 pipe 和閉包時要注意：

1. **記憶體使用**
   - 閉包會保持對外部變數的引用
   - 注意避免不必要的大型資料結構
   - 考慮使用 memoization 優化重複計算

2. **執行效率**
   - 每次調用都會遍歷所有函數
   - 考慮使用 memoization 優化重複計算

```typescript
// 使用 memoization 優化
type AnyFn = (...args: any[]) => any;

function memoizedPipe<T extends AnyFn[]>(...fns: T) {
  const cache = new Map<string, ReturnType<T[number]>>();

  return (...args: Parameters<T[0]>): ReturnType<T[number]> => {
    const key = args.map(arg => JSON.stringify(arg)).join('|');

    const cached = cache.get(key);
    if (cached !== undefined)
      return cached;

    const result = fns.reduce((acc, fn) => fn(acc), args[0]);
    cache.set(key, result);
    return result;
  };
}
```

## 應用場景

1. **資料轉換**

```typescript
const processUser = pipe(
  fetchUser, // API 請求
  normalizeData, // 資料正規化
  validateUser, // 資料驗證
  formatUserDisplay // 格式化顯示
);
```

2. **事件處理**

```typescript
const handleUserInput = pipe(
  sanitizeInput, // 輸入清理
  validateInput, // 輸入驗證
  transformInput, // 資料轉換
  saveToDatabase // 儲存資料
);
```

## 總結

pipe 函數在 functional programming 中是一個重要的概念，它不僅可以讓程式碼更加模組化，還能提高程式碼的可讀性和可維
護性，通過組合小型、單一功能的函數，最後我們可以組裝出更複雜的功能，同時保持程式碼的簡潔性
