---
title: Prime Number Implementation
description: Advanced prime number implementations with non-blocking calculation and caching optimization
date: 2025-02-21
read: '15'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  Prime Number Implementation

  #description
  難度：Medium

  #content
  ## 題目需求

  總共包含五個子題目，都跟質數有關：

  ### 1. isPrime - 判斷質數

  ```bash
  # 判斷一個數是否為質數
  isPrime(2687) → true
  isPrime(9087) → false  # 因為 9087 = 3 × 3029
  ```

  ### 2. nextPrime - 找下一個質數

  ```bash
  # 找出大於給定數字的下一個質數
  # 需要實現非阻塞版本
  async function nextPrime(num: number): Promise<number>;
  ```

  ### 3. nthPrime - 找第 n 個質數

  ```bash
  # 找出第 n 個質數，不能阻塞主執行緒
  nthPrime(3)      → 5        # [2, 3, 5]
  nthPrime(100)    → 541
  nthPrime(1000000) → 15485863
  ```

  ### 4. 超時控制

  ```typescript
  // 實現超時機制，超過指定時間需要拋出錯誤
  try {
    await nthPrime(10000000, { timeoutMsec: 3000 });
  } catch (error) {
    // timeout error
  }
  ```

  ### 5. 並行計算優化

  ```typescript
  // 並行計算多個質數時，相同的計算只能執行一次
  await Promise.all([nthPrime(100), nthPrime(200)]);

  // 正確的輸出順序：
  // 1 is computing
  // 2 is computing
  // ...
  // 100 is computing
  // 101 is computing
  // ...
  // 200 is computing

  // 錯誤的輸出順序：
  // 1 is computing
  // 1 is computing (重複計算)
  // 2 is computing
  // 2 is computing (重複計算)
  ```

  ## 實作要求

  1. **效能優化**
     - 使用 6k±1 優化質數判定
     - 實現快取機制避免重複計算
     - 優化大數運算效能

  2. **非阻塞設計**
     - 主執行緒不能被阻塞
     - 需要適當讓出執行權
     - 保持 UI 響應性

  3. **錯誤處理**
     - 實現超時控制
     - 處理邊界情況
     - 資源清理機制

  4. **並行處理**
     - 避免重複計算
     - 正確處理並行請求
     - 共享計算結果

  ::alert{title="核心考點" type="info"}
  1. 演算法優化能力
  2. 非同步程式設計
  3. 並行計算處理
  4. 快取策略設計
  ::

  #footer
  :badge[Algorithm]
  :badge[Async]
  :badge[Cache]
  ::
::

## 解題思路

### 1. isPrime - 判斷質數

首先從最基本的質數判定開始：

```typescript
// 基礎版本 - 檢查到平方根
function isPrime(num: number): boolean {
  // 處理邊界情況
  if (num < 2)
    return false;

  // 檢查到平方根即可
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0)
      return false;
  }

  return true;
}
```

但這個方法效能不佳，我們可以使用 6k±1 優化：

```typescript
// 優化版本 - 使用 6k±1
function isPrime(num: number): boolean {
  // 處理基本情況
  if (num < 2)
    return false;
  if (num <= 3)
    return true;
  if (num % 2 === 0 || num % 3 === 0)
    return false;

  // 使用 6k±1 檢查
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0)
      return false;
  }
  return true;
}
```

## 6k±1 優化原理

### 概述
6k±1 優化是一種質數判定的優化方法，能大幅減少需要檢查的數字數量。這個優化基於一個數學事實：所有大於 3 的質數都可以表示為 6k±1 的形式。

### 效能比較

| 方法 | 檢查範圍 | 需檢查的數字 | 時間複雜度 |
|------|----------|--------------|------------|
| 傳統試除法 | 2 ~ √n | 所有整數 | O(√n) |
| 6k±1 優化 | 5 ~ √n | 6k±1 形式的數 | O(√n/3) |

### 數學原理
任何整數都可以表示為以下六種形式之一：
```
6k, 6k+1, 6k+2, 6k+3, 6k+4, 6k+5  (k ≥ 0)
```

分析各種情況：
1. 6k   = 2 × 3 × k     (能被 2 和 3 整除)
2. 6k+2 = 2 × (3k+1)    (能被 2 整除)
3. 6k+3 = 3 × (2k+1)    (能被 3 整除)
4. 6k+4 = 2 × (3k+2)    (能被 2 整除)

因此，質數只可能出現在這兩種形式：
- 6k+1 形式
- 6k+5 形式 (等同於 6(k+1)-1，即下一組的 6k-1)

### 優化效果
1. **檢查次數減少**：
   - 傳統方法：檢查所有數字
   - 6k±1 方法：只檢查 6k+1 和 6k+5 形式的數
   - 效果：檢查次數減少約 2/3

2. **實際應用**：
   ```typescript
   // 優化前：檢查所有數字
   for (let i = 2; i <= Math.sqrt(num); i++) {
     if (num % i === 0)
       return false;
   }

   // 優化後：只檢查 6k±1 形式的數
   for (let i = 5; i * i <= num; i += 6) {
     if (num % i === 0 || num % (i + 2) === 0)
       return false;
   }
   ```

### 實作考量

1. **特殊處理**：
   - 2 和 3 需要特別處理
   - 先排除 2 和 3 的倍數

2. **效能提升**：
   - 大數時效果更明顯
   - 特別適合連續質數計算

### 2. nextPrime - 非阻塞版本

這裡需要注意不阻塞主執行緒：

```typescript
async function nextPrime(num: number): Promise<number> {
  let current = num + 1;
  let checkCount = 0;

  while (!isPrime(current)) {
    current++;
    checkCount++;

    // 每 100 次檢查就讓出執行緒
    if (checkCount % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  return current;
}
```

#### 為什麼這個方式可以避免阻塞主執行緒？

在 JavaScript 中，長時間的計算會阻塞主執行緒，導致 UI 無法響應，這個實作通過以下機制來避免阻塞：

1. **使用 setTimeout 讓出執行權**

   ```typescript
   await new Promise(resolve => setTimeout(resolve, 0));
   ```

   - 將任務放入 macrotask queue
   - 讓瀏覽器有機會執行其他任務
   - 確保 UI 能夠保持響應

2. **批次處理**

   ```typescript
   if (checkCount % 100 === 0) {
     await new Promise(resolve => setTimeout(resolve, 0));
   }
   ```

   - 每 100 次運算讓出一次執行權
   - 平衡效能和響應性
   - 避免過於頻繁的上下文切換

#### 為什麼選擇 100 作為批次大小？

批次大小的選擇需要考慮以下因素：

1. **響應性 vs 效能**
   - 批次太小：過多上下文切換，效能下降
   - 批次太大：可能造成明顯卡頓
   - 100 次是經驗值，可根據實際情況調整

2. **執行環境考量**
   - 不同設備性能差異
   - 不同瀏覽器實現差異
   - 可以根據環境動態調整

#### 其他可行的非阻塞方案

1. **Web Worker**

   ```typescript
   // 由於題目限制，不採用這個方案
   const worker = new Worker('prime-worker.js');
   worker.postMessage({ type: 'calculate', num });
   ```

2. **Scheduler API**

   ```typescript
   // 仍在實驗階段，支援度不足
   scheduler.postTask(() => {
     // 計算邏輯
   }, { priority: 'background' });
   ```

3. **requestIdleCallback**

   ```typescript
   // 可能不適合密集計算
   requestIdleCallback((deadline) => {
     while (deadline.timeRemaining() > 0) {
       // 計算邏輯
     }
   });
   ```

### 3. nthPrime - 找第 n 個質數

使用 Generator 實現更有效率的質數生成：

```typescript
async function* generatePrimes() {
  let current = 2;
  while (true) {
    if (isPrime(current))
      yield current;
    current++;

    // 每生成一個質數就檢查是否需要讓出執行緒
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}

async function nthPrime(n: number): Promise<number> {
  const primes: number[] = [];
  const generator = generatePrimes();

  while (primes.length < n) {
    const { value } = await generator.next();
    primes.push(value);
  }

  return primes[n - 1];
}
```

### 4. 超時控制實作

使用 AbortController 實現可中斷的計算：

```typescript
async function nthPrimeWithTimeout(
  n: number,
  { timeoutMsec = 3000 } = {}
): Promise<number> {
  const controller = new AbortController();
  const { signal } = controller;

  const calculation = new Promise<number>((resolve, reject) => {
    nthPrime(n)
      .then((result) => {
        if (!signal.aborted)
          resolve(result);
      })
      .catch((error) => {
        if (!signal.aborted)
          reject(error);
      });
  });

  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      controller.abort();
      reject(new Error(`Calculation timeout after ${timeoutMsec}ms`));
    }, timeoutMsec);
  });

  return Promise.race([calculation, timeout]);
}
```

### 5. 並行計算優化

使用 closure 和 Map 實現計算結果共享：

```typescript
function createPrimeCalculator() {
  const primes = new Map<number, number>();
  const calculating = new Map<number, Promise<number>>();

  const calculatePrime = async (n: number): Promise<number> => {
    // 檢查快取
    if (primes.has(n)) {
      return primes.get(n)!;
    }

    // 檢查是否正在計算
    if (calculating.has(n)) {
      return calculating.get(n)!;
    }

    // 開始新計算
    console.log(`${n} is computing`);
    const promise = (async () => {
      const result = await nthPrime(n);
      primes.set(n, result);
      return result;
    })();

    calculating.set(n, promise);

    try {
      return await promise;
    } finally {
      calculating.delete(n);
    }
  };

  return { calculatePrime };
}

// 使用範例
const calculator = createPrimeCalculator();

// 並行計算，結果會被共享
await Promise.all([
  calculator.calculatePrime(100),
  calculator.calculatePrime(200)
]);
```

## 效能優化重點

1. **演算法優化**
   - 使用 6k±1 減少檢查次數
   - Generator 實現惰性計算
   - 批次處理

2. **記憶體優化**
   - Map 儲存計算結果
   - 及時清理計算狀態
   - 避免重複計算

3. **執行效能**
   - 非阻塞計算
   - 可中斷的運算
   - 結果共享機制

## 測試策略

```typescript
describe('Prime Calculator', () => {
  let calculator: ReturnType<typeof createPrimeCalculator>;

  beforeEach(() => {
    calculator = createPrimeCalculator();
  });

  test('basic prime check', () => {
    expect(isPrime(2687)).toBe(true);
    expect(isPrime(9087)).toBe(false);
  });

  test('concurrent calculation', async () => {
    const start = performance.now();
    const [p100, p200] = await Promise.all([
      calculator.calculatePrime(100),
      calculator.calculatePrime(200)
    ]);
    const duration = performance.now() - start;

    expect(p100).toBe(541);
    expect(p200).toBe(1223);
    expect(duration).toBeLessThan(5000);
  });

  test('timeout handling', async () => {
    await expect(
      nthPrimeWithTimeout(1000000, { timeoutMsec: 1 })
    ).rejects.toThrow('Calculation timeout');
  });
});
```
