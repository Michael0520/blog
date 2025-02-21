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
  這是一道經典的前端面試題，主要考察以下幾個重點：

  1. 質數判定的效能優化
  2. 非阻塞計算的實現
  3. 錯誤處理機制
  4. 緩存策略設計

  example:

  ```bash
  # 基本判斷
  isPrime(2687) → true
  isPrime(9087) → false  // 3 × 3029

  # 找第 n 個質數
  nthPrime(3)      → 5        // [2, 3, 5]
  nthPrime(100)    → 541      // 不阻塞主線程
  nthPrime(1000000) → 15485863 // 支援 timeout
  ```

  ::alert{title="面試重點" type="info"}
  1. 使用 6k±1 優化質數判斷
  2. setTimeout 實現非阻塞
  3. Promise.race 實現 timeout
  4. 單例模式實現緩存
  ::

  #footer
  :badge[Algorithm]
  :badge[Async]
  :badge[Cache]
  ::
::

## 核心實作

### 1. 質數判定（使用 6k±1 優化）

```typescript
function isPrime(num: number): boolean {
  // 步驟 1: 處理特殊情況
  if (num < 2)
    return false; // 小於 2 的數不是質數
  if (num === 2 || num === 3)
    return true; // 2 和 3 都是質數
  if (num % 2 === 0 || num % 3 === 0)
    return false; // 排除能被 2 或 3 整除的數

  // 步驟 2: 使用 6k±1 優化
  // 原理：所有大於 3 的質數都可以表示為 6k±1 的形式
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0)
      return false; // 檢查 6k-1
    if (num % (i + 2) === 0)
      return false; // 檢查 6k+1
  }

  return true;
}
```

### 2. 找下一個質數（非阻塞版本）

```typescript
async function nextPrime(num: number): Promise<number> {
  // 步驟 1: 處理特殊情況
  if (num < 2)
    return 2;
  if (num === 2)
    return 3;
  if (num === 3)
    return 5;

  // 步驟 2: 從輸入數字的下一個數開始
  let next = num + 1;

  let checkCount = 0;
  while (!isPrime(next)) {
    next++; // 一個一個檢查，確保不會跳過任何數
    checkCount++;

    // 每檢查 100 個數字就讓出主線程
    if (checkCount % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  return next;
}
```

### 3. 找第 n 個質數（帶緩存）

```typescript
async function nthPrime(n: number): Promise<number> {
  // 初始化已知的前幾個質數（效能優化）
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

  if (n <= primes.length)
    return primes[n - 1];

  // 從最後一個已知質數開始找
  let current = primes[primes.length - 1];
  while (primes.length < n) {
    current = await nextPrime(current);
    primes.push(current);
  }

  return primes[n - 1];
}
```

## 進階功能

### 1. Timeout 機制

```typescript
interface Options {
  timeoutMsec?: number;
}

async function nthPrimeWithTimeout(
  n: number,
  options: Options = {},
): Promise<number> {
  const { timeoutMsec = 3000 } = options;

  // 使用 Promise.race 實現超時控制
  return Promise.race([
    nthPrime(n),
    new Promise<never>((_, reject) => {
      setTimeout(
        () => reject(new Error('Calculation timeout')),
        timeoutMsec,
      );
    })
  ]);
}
```

### 2. 緩存優化（單例模式）

```typescript
class PrimeCache {
  private static instance: PrimeCache;
  private primes: number[] = [2];
  private calculating = new Map<number, Promise<number>>();

  static getInstance(): PrimeCache {
    if (!PrimeCache.instance) {
      PrimeCache.instance = new PrimeCache();
    }
    return PrimeCache.instance;
  }

  async nthPrime(n: number): Promise<number> {
    // 檢查緩存
    if (n <= this.primes.length)
      return this.primes[n - 1];

    // 檢查是否正在計算
    if (this.calculating.has(n))
      return this.calculating.get(n)!;

    // 開始新的計算
    const promise = this.calculatePrime(n);
    this.calculating.set(n, promise);

    try {
      const result = await promise;
      this.calculating.delete(n);
      return result;
    } catch (error) {
      this.calculating.delete(n);
      throw error;
    }
  }

  private async calculatePrime(n: number): Promise<number> {
    while (this.primes.length < n) {
      const next = await nextPrime(this.primes[this.primes.length - 1]);
      this.primes.push(next);
    }
    return this.primes[n - 1];
  }
}
```

## 實作重點解析

### 1. 效能優化策略

1. **6k±1 優化**
   - 所有大於 3 的質數都可以表示為 6k±1 的形式
   - 大幅減少需要檢查的數字
   - 例如：5(6×1-1), 7(6×1+1), 11(6×2-1), 13(6×2+1)

2. **緩存機制**
   - 預存常用的質數
   - 避免重複計算
   - 共享計算結果

3. **非阻塞設計**
   - 使用 setTimeout 讓出主線程
   - 分批處理大量運算
   - 保持 UI 響應性

### 2. 錯誤處理

1. **邊界情況**

   ```typescript
   if (num < 2)
     return false;
   if (num === 2 || num === 3)
     return true;
   ```

2. **超時處理**

   ```typescript
   Promise.race([計算, 超時]);
   ```

3. **資源清理**

   ```typescript
   try {
     // 計算
   } finally {
     // 清理資源
   }
   ```

### 3. 實務建議

1. **開發環境**
   - 使用較小的 batch size
   - 開啟詳細的錯誤日誌

2. **生產環境**
   - 調整 batch size 和 timeout
   - 考慮使用 Web Worker

3. **測試策略**
   - 檢查邊界情況
   - 驗證非阻塞特性
   - 確認緩存效果
