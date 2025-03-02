---
title: Array.prototype.filter Implementation
description: Implement a Custom Array Filter Method
date: 2025-03-03
read: '15'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:filter
  icon-size: 26
  ---

  #title
  Implement Array.prototype.filter

  #description
  難度：Easy

  #content
  ## 題目描述

  實作一個 `Array.prototype.filter` 方法，該方法會建立一個新的陣列，其中包含所有通過指定函數測試的元素。

  為了避免覆蓋原生的 `Array.prototype.filter` 方法，我們將實作命名為 `Array.prototype.myFilter`。

  ```typescript
  /**
   * 實作 Array.prototype.filter 方法
   * @param callbackFn - 用於測試陣列中每個元素的函數
   * @param thisArg - 執行 callbackFn 時使用的 this 值
   * @returns 通過測試的元素組成的新陣列
   */
  interface Array<T> {
    myFilter: (
      callbackFn: (value: T, index: number, array: Array<T>) => boolean,
      thisArg?: any,
    ) => Array<T>;
  }
  ```

  ### 核心要求

  1. **功能完整性**
     - 必須與原生 `filter` 方法行為一致
     - 需處理稀疏陣列（例如 `[1, 2, , 4]`）
     - 空值應被忽略，不出現在結果陣列中

  2. **參數處理**
     - `callbackFn` 必須接收三個參數：元素值、索引和原陣列
     - 正確處理 `thisArg` 參數

  ### 使用範例

  ```typescript
  // 範例 1：過濾偶數
  [1, 2, 3, 4].myFilter(value => value % 2 === 0); // [2, 4]

  // 範例 2：過濾小於 3 的數字
  [1, 2, 3, 4].myFilter(value => value < 3); // [1, 2]

  // 範例 3：處理稀疏陣列
  [1, 2, undefined, 4].myFilter(value => value > 0); // [1, 2, 4]

  // 範例 4：使用 thisArg
  const filter = {
    limit: 3,
    test(value) {
      return value < this.limit;
    }
  };
  [1, 2, 3, 4].myFilter(filter.test, filter); // [1, 2]
  ```

  #footer
  :badge[Array]
  :badge[Prototype]
  :badge[TypeScript]
  ::
::

## 解題思路

### 1. 理解 filter 方法的核心功能

`filter` 是陣列處理的基本工具，主要功能包括：

- **篩選**：保留符合條件的元素
- **不可變**：不修改原陣列，返回新陣列
- **函數式**：使用回調函數決定元素去留

#### 特殊處理要點

- **稀疏陣列**：跳過空值位置
- **參數傳遞**：提供元素值、索引和原陣列
- **this 綁定**：支援自定義回調函數中的 `this` 值

#### 返回值特點

- 只包含通過測試的元素
- 保持原始順序
- 長度 ≤ 原陣列長度

### 2. 實作方案

```typescript
// 避免直接修改 Array.prototype
function myFilter<T>(
  array: T[],
  callbackFn: (value: T, index: number, array: T[]) => boolean,
  thisArg?: any
): T[] {
  // 檢查 callbackFn 是否為函數
  if (typeof callbackFn !== 'function') {
    throw new TypeError(`${callbackFn} is not a function`);
  }

  const len = array.length;
  const results: T[] = [];

  // 遍歷陣列
  for (let k = 0; k < len; k++) {
    // 檢查索引是否存在（處理稀疏陣列）
    if (Object.hasOwn(array, k)) {
      const kValue = array[k];
      // 執行回調函數，如果返回 true，則將元素加入結果陣列
      if (callbackFn.call(thisArg, kValue, k, array)) {
        results.push(kValue);
      }
    }
  }

  return results;
}

// 使用方式
// myFilter([1, 2, 3, 4], value => value % 2 === 0); // [2, 4]
```

此實作符合 ECMAScript 規範，與原生 `filter` 方法行為一致。

### 3. 關鍵實作細節

#### 參數檢查

```typescript
if (typeof callbackFn !== 'function') {
  throw new TypeError(`${callbackFn} is not a function`);
}
```

- 確保回調是函數
- 與原生 filter 錯誤處理一致

#### 稀疏陣列處理

```typescript
if (Object.hasOwn(array, k)) {
  // 處理元素
}
```

- 使用 `Object.hasOwn` 檢查索引存在性
- 跳過未設置的元素位置

#### this 綁定

```typescript
callbackFn.call(thisArg, kValue, k, array);
```

- 使用 `call` 方法控制 `this` 值
- 按順序傳遞元素值、索引和原陣列

### 4. callbackFn.call 參數解析

`callbackFn.call(thisArg, kValue, k, array)` 中的參數各有用途：

#### thisArg（第一個參數）

控制回調函數內的 `this` 指向：

```javascript
// 範例：使用 this 存取物件屬性
const priceRange = {
  min: 1000,
  max: 3000,
  isInRange(price) {
    return price >= this.min && price <= this.max;
  }
};

// 篩選價格在範圍內的產品
const products = [
  { name: 'Laptop', price: 1200 },
  { name: 'Phone', price: 800 },
  { name: 'Desktop', price: 2500 }
];

const inRangeProducts = products.filter(function (product) {
  return this.isInRange(product.price);
}, priceRange);
// [{ name: 'Laptop', price: 1200 }, { name: 'Desktop', price: 2500 }]
```

#### kValue（第二個參數）

當前處理的元素值：
- 作為回調的第一個參數
- 最常用的參數

#### k（第三個參數）

當前元素的索引：

```javascript
// 範例：只保留偶數位置的元素
const items = [10, 20, 30, 40, 50];
const evenPositionItems = items.filter((_, index) => index % 2 === 0);
// [10, 30, 50]
```

#### this（第四個參數）

原始陣列的引用：

```javascript
// 範例：只保留大於平均值的元素
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const aboveAverage = nums.filter((num, _, array) => {
  const avg = array.reduce((sum, n) => sum + n, 0) / array.length;
  return num > avg;
});
// [6, 7, 8, 9, 10]
```

參數順序設計考量：
- **使用頻率**：常用參數在前
- **一致性**：與其他陣列方法保持一致
- **功能性**：支援不同程度的上下文訪問

## 進階技巧

### 1. 效能優化

處理大型陣列時的優化版本：

```typescript
// 避免直接修改 Array.prototype
function myFilterOptimized<T>(
  array: T[],
  callbackFn: (value: T, index: number, array: T[]) => boolean,
  thisArg?: any
): T[] {
  const len = array.length;
  const results: T[] = [];
  let resultIndex = 0;

  for (let k = 0; k < len; k++) {
    if (k in array) {
      const kValue = array[k];
      if (callbackFn.call(thisArg, kValue, k, array)) {
        results[resultIndex++] = kValue;
      }
    }
  }

  return results;
}
```

優化重點：
- 直接索引賦值代替 `push`
- 使用 `k in array` 檢查稀疏陣列
- 單一變數追蹤結果陣列長度

### 2. 實用場景

#### 資料篩選

```typescript
// 使用者資料篩選
const users = [
  { id: 1, name: 'Alice', age: 25, role: 'admin' },
  { id: 2, name: 'Bob', age: 17, role: 'user' },
  { id: 3, name: 'Charlie', age: 30, role: 'user' }
];

// 篩選成年管理員
const adultAdmins = users.filter(user =>
  user.age >= 18 && user.role === 'admin'
);
// [{ id: 1, name: 'Alice', age: 25, role: 'admin' }]
```

#### 多條件搜尋

```typescript
// 產品搜尋函數
function searchProducts(products, query, maxPrice, inStockOnly) {
  return products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(query.toLowerCase());
    const matchesPrice = product.price <= maxPrice;
    const matchesStock = inStockOnly ? product.inStock : true;

    return matchesName && matchesPrice && matchesStock;
  });
}

// 使用範例
const products = [
  { name: 'Laptop', price: 1200, inStock: true },
  { name: 'Phone', price: 800, inStock: false },
  { name: 'Tablet', price: 500, inStock: true }
];

const results = searchProducts(products, 'p', 1000, true);
// [{ name: 'Tablet', price: 500, inStock: true }]
```

### 3. 測試要點

```typescript
describe('Array.prototype.myFilter', () => {
  test('基本篩選功能', () => {
    expect([1, 2, 3, 4].myFilter(v => v % 2 === 0)).toEqual([2, 4]);
  });

  test('處理稀疏陣列', () => {
    expect([1, 2, undefined, 4].myFilter(v => v > 0)).toEqual([1, 2, 4]);
  });

  test('參數傳遞', () => {
    const callback = jest.fn(x => x > 2);
    [1, 2, 3].myFilter(callback);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenNthCalledWith(1, 1, 0, [1, 2, 3]);
  });

  test('this 綁定', () => {
    const obj = { threshold: 2 };
    const result = [1, 2, 3].myFilter(function (v) {
      return v > this.threshold;
    }, obj);

    expect(result).toEqual([3]);
  });
});
```

## 總結

實作 `filter` 方法的關鍵點：

1. **核心原則**
   - 不修改原陣列
   - 正確處理稀疏陣列
   - 準確綁定 `this` 值

2. **應用場景**
   - 資料篩選與搜尋
   - UI 元素過濾
   - API 響應處理
