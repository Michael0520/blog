---
title: Promise.all Implementation
description: Implement a Custom Promise.all Function
date: 2025-03-02
read: '15'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:git-merge
  icon-size: 26
  ---

  #title
  Implement Promise.all

  #description
  難度：Medium

  #content
  ## 題目描述

  實作一個 `Promise.all` 函數，接受一個陣列作為輸入（通常是 Promise），並返回一個新的 Promise，該 Promise 解析為一個包含所有輸入 Promise 結果的陣列。

  - 當所有輸入的 Promise 都解析完成時，返回的 Promise 才會解析
  - 如果輸入陣列為空，則返回一個解析為空陣列的 Promise
  - 如果任何一個輸入的 Promise 被拒絕，則立即拒絕並返回第一個拒絕的原因
  - 需要處理非 Promise 的輸入值

  ```typescript
  /**
   * 實作 Promise.all 函數
   * @param iterable - Promise 陣列
   * @returns 包含所有 Promise 結果的陣列
   */
  function promiseAll<T>(iterable: Array<T | Promise<T>>): Promise<T[]> {
    // TODO: 實作此函數
  }
  ```

  ### 核心要求

  1. **保持順序**
     - 返回的陣列必須與輸入陣列的順序相同
     - 即使後面的 Promise 先完成，也要等待前面的 Promise

  2. **錯誤處理**
     - 任一 Promise 被拒絕時立即返回錯誤
     - 不需等待其他 Promise 完成

  3. **型別安全**
     - 正確處理泛型型別
     - 支援混合型別的輸入（Promise 和非 Promise）

  ### 使用範例

  ```typescript
  // 範例 1：全部成功的情況
  const p0 = Promise.resolve(3);
  const p1 = 42;
  const p2 = new Promise<string>((resolve) => {
    setTimeout(() => resolve('foo'), 100);
  });

  const result = await promiseAll([p0, p1, p2]);
  console.log(result); // [3, 42, 'foo']

  // 範例 2：含有錯誤的情況
  const p3 = Promise.resolve(30);
  const p4 = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('An error occurred!')), 100);
  });

  try {
    await promiseAll([p3, p4]);
  } catch (err) {
    console.log(err); // Error: An error occurred!
  }
  ```

  #footer
  :badge[Promise]
  :badge[Async]
  :badge[TypeScript]
  ::
::

## 解題思路

### 1. 理解 Promise.all 的特性

1. **返回值特性**
   - 返回一個新的 Promise
   - 該 Promise 解析為一個陣列
   - 陣列中的值與輸入順序相對應

2. **執行特性**
   - 並行執行所有 Promise
   - 等待所有 Promise 完成
   - 任一 Promise 失敗則立即返回錯誤

3. **輸入處理**
   - 支援 Promise 和非 Promise 混合輸入
   - 空陣列返回空陣列的 Promise
   - 保持輸入順序

### 2. 實作方案

#### 方案一：使用 async/await

```typescript
function promiseAll<T>(iterable: Array<T | Promise<T>>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results = Array.from({ length: iterable.length });
    let unresolved = iterable.length;

    // 處理空陣列的情況
    if (unresolved === 0) {
      resolve(results);
      return;
    }

    // 處理每個輸入值
    iterable.forEach(async (item, index) => {
      try {
        // 使用 await 等待 Promise 解析
        const value = await item;
        results[index] = value;
        unresolved -= 1;

        // 當所有 Promise 都解析完成時，返回結果
        if (unresolved === 0) {
          resolve(results);
        }
      } catch (err) {
        // 任一 Promise 失敗時立即拒絕
        reject(err);
      }
    });
  });
}
```

#### 方案二：使用 Promise.then()

```typescript
function promiseAll<T>(iterable: Array<T | Promise<T>>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results = Array.from({ length: iterable.length });
    let unresolved = iterable.length;

    if (unresolved === 0) {
      resolve(results);
      return;
    }

    iterable.forEach((item, index) => {
      // 使用 Promise.resolve 處理非 Promise 值
      Promise.resolve(item)
        .then((value) => {
          results[index] = value;
          unresolved -= 1;

          if (unresolved === 0) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}
```

### 3. 實作細節解析

1. **Promise 建構**
   ```typescript
   return new Promise((resolve, reject) => {
     // ... 實作內容
   });
   ```
   - 返回新的 Promise
   - 使用 resolve 和 reject 控制狀態

2. **結果管理**

   ```javascript
   const results = Array.from({ length: iterable.length });
   let unresolved = iterable.length;
  ```

   - 預先分配結果陣列
   - 追蹤未完成的 Promise 數量

3. **錯誤處理**
   ```typescript
   try {
     const value = await item;
     // ... 處理成功的情況
   } catch (err) {
     reject(err);
   }
   ```

   - 使用 try/catch 捕獲錯誤
   - 立即拒絕整個 Promise

## 進階主題

### 1. 效能優化版本

```typescript
function promiseAllOptimized<T>(iterable: Array<T | Promise<T>>): Promise<T[]> {
  // 預先檢查輸入
  if (!Array.isArray(iterable)) {
    return Promise.reject(new TypeError('Input must be an array'));
  }

  const len = iterable.length;
  if (len === 0)
    return Promise.resolve([]);

  // 使用 Map 追蹤狀態
  const results = new Map<number, T>();
  let completed = 0;

  return new Promise((resolve, reject) => {
    iterable.forEach((item, index) => {
      Promise.resolve(item)
        .then((value) => {
          results.set(index, value);
          completed++;

          // 使用 Map.size 檢查完成狀態
          if (completed === len) {
            resolve(Array.from(results.values()));
          }
        })
        .catch(reject);
    });
  });
}
```

### 2. 實際應用場景

1. **並行 API 請求**

   ```typescript
   async function fetchUserData(userId: string) {
     const [user, posts, comments] = await promiseAll([
       fetchUser(userId),
       fetchUserPosts(userId),
       fetchUserComments(userId)
     ]);

     return { user, posts, comments };
   }
   ```

2. **資源預加載**

   ```typescript
   async function preloadResources() {
     const resources = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
     const images = await promiseAll(
       resources.map(url => new Promise((resolve, reject) => {
         const img = new Image();
         img.onload = () => resolve(img);
         img.onerror = reject;
         img.src = url;
       }))
     );
     return images;
   }
   ```

### 3. 測試案例

```typescript
describe('promiseAll', () => {
  test('應該處理空陣列', async () => {
    const result = await promiseAll([]);
    expect(result).toEqual([]);
  });

  test('應該按順序返回結果', async () => {
    const p1 = Promise.resolve(1);
    const p2 = Promise.resolve(2);
    const p3 = Promise.resolve(3);

    const result = await promiseAll([p1, p2, p3]);
    expect(result).toEqual([1, 2, 3]);
  });

  test('應該處理混合輸入', async () => {
    const result = await promiseAll([
      Promise.resolve(1),
      2,
      Promise.resolve(3)
    ]);
    expect(result).toEqual([1, 2, 3]);
  });

  test('應該立即處理錯誤', async () => {
    const error = new Error('測試錯誤');
    await expect(promiseAll([
      Promise.resolve(1),
      Promise.reject(error),
      Promise.resolve(3)
    ])).rejects.toEqual(error);
  });
});
```

## 常見陷阱

1. **順序處理**
   - 需要確保結果陣列與輸入順序相同
   - 不能依賴 Promise 完成的順序

2. **型別處理**
   - 需要正確處理非 Promise 值
   - 使用 Promise.resolve 統一處理

3. **記憶體管理**
   - 大量 Promise 時的記憶體使用
   - 適時清理中間狀態

## 面試重點

1. **核心概念**
   - Promise 的運作機制
   - 非同步程式設計模式
   - 錯誤處理策略

2. **延伸問題**
   - 如何實現 Promise.race?
   - 如何實現 Promise.allSettled?
   - 如何處理超時機制?
