---
title: Array Flatten - extend Array.prototype.myFlat
description: Implementation of array flattening by extending Array prototype
date: 2025-02-20
read: '8'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  Array Flatten Implementation

  #description
  難度：Easy

  #content
  實作一個 Array.prototype.myFlat 方法，將多維陣列轉換成一維陣列

  ::br
  ::br

  example:

  ```bash
  Input: [1, 2, [3, 4, 5]]
  Output: [1, 2, 3, 4, 5]

  Input: [1, [2, [3, [4, [5]]]]]
  Output: [1, 2, 3, 4, 5]
  ```

  #footer
  :badge[Array]
  :badge[Recursion]
  ::
::

### 解題重點

1. 使用 `forEach` 遍歷陣列
2. 使用 `concat` 合併陣列
3. 使用遞迴處理巢狀陣列

### 基本實作

使用 forEach 和 concat 的解法：

```typescript
// eslint-disable-next-line no-extend-native
Array.prototype.myFlat = function () {
  const result: any[] = [];

  this.forEach((item) => {
    if (Array.isArray(item)) {
      result = result.concat(item.myFlat());
    } else {
      result.push(item);
    }
  });

  return result;
};
```

### 程式碼解析

1. **初始化結果陣列**

   ```typescript
   const result: any[] = [];
   ```

2. **遍歷處理每個元素**

   ```typescript
   this.forEach((item) => {
     if (Array.isArray(item)) {
       // 如果是陣列，遞迴處理
       result = result.concat(item.myFlat());
     } else {
       // 如果不是陣列，直接加入
       result.push(item);
     }
   });
   ```

### 使用範例

```typescript
// 一般陣列
console.log([1, 2, 3, 4, 5].myFlat());
// [1, 2, 3, 4, 5]

// 二維陣列
console.log([1, 2, [3, 4, 5]].myFlat());
// [1, 2, 3, 4, 5]

// 多維陣列
console.log([1, [2, [3, [4, [5]]]]].myFlat());
// [1, 2, 3, 4, 5]
```

## 實作重點

1. **遞迴處理**
   - 使用 `Array.isArray()` 判斷
   - 遞迴呼叫 `myFlat()`

2. **陣列合併**
   - 使用 `concat` 合併結果
   - 使用 `push` 加入元素

3. **注意事項**
   - 處理空陣列情況
   - 確保遞迴終止條件

## 其他解法

### 字串轉換法（僅適用於數字陣列）

這是一個非常簡潔的解法，但是有對應的限制，使用場景要先確認好

```typescript
function flattenOnlyNumbers(array: number[]) {
  return array
    .toString() // 轉成字串，自動用逗號分隔 [1, [2, [3]]] -> "1,2,3"
    .split(',') // 分割成字串陣列 ["1", "2", "3"]
    .map(Number); // 轉回數字 [1, 2, 3]
}

// 使用範例
console.log(flattenOnlyNumbers([1, [2, [3, [4, [5]]]]])); // [1, 2, 3, 4, 5]
```

::alert{type="warning"}
這個解法的限制：

1. 只能處理數字陣列
2. 不能處理其他型別（字串、物件等）
3. 可能有精度問題（處理浮點數時）
::

### 解法比較表

| 解法 | 優點 | 缺點 | 適用場景 |
|------|------|------|----------|
| 遞迴 + forEach | 通用性強、可讀性好 | 程式碼較長 | 一般使用 |
| 字串轉換 | 程式碼最簡潔 | 只能處理數字 | 純數字陣列 |
| 原生 flat() | 效能最佳、簡單 | 瀏覽器支援度 | 實務開發 |
