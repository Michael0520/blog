---
title: Easy 67 - Add Binary
description: In this blog I will share a solution to the Add Binary problem.
date: 2025-02-07 04:00:00
icon: 'fa6-solid:code'
read: '10'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  [題目連結](https://leetcode.com/problems/add-binary)

  #description
  難度：Easy

  #content
  給定兩個二進制字串 a 和 b，返回它們的和（也是一個二進制字串）。

  ::br
  ::br

  example:

  ```bash
  輸入：a = "11", b = "1"
  輸出："100"

  輸入：a = "1010", b = "1011"
  輸出："10101"
  ```

  ::alert{title="限制" type="warning"}
  - 1 <= a.length, b.length <= 10^4
  - a 和 b 只包含字符 '0' 或 '1'
  - 每個字串都不包含前導零，除非是數字 0 本身
  ::

  #footer
  :badge[Math]
  :badge[String]
  :badge[Bit Manipulation]
  :badge[Simulation]
  ::
::

## 解題思路

### 思考過程

1. **初步分析**
   - 需要模擬二進制加法運算
   - 需要處理進位的情況
   - 從右到左處理每一位

2. **解題技巧**
   - 使用雙指針從右到左遍歷
   - 使用變數記錄進位
   - 注意處理不等長的情況

3. **實作重點**
   - 字串轉數字使用 parseInt
   - 結果需要從右到左構建
   - 處理最後可能的進位

### 解題步驟

```bash
# 以 a = "1010", b = "1011" 為例

1️⃣ 初始狀態：
  a = "1010"
  b = "1011"
  carry = 0
  result = ""

2️⃣ 從右到左計算：
  第 1 位：0 + 1 + 0 = 1    result = "1"
  第 2 位：1 + 1 + 0 = 0(2) result = "01"  carry = 1
  第 3 位：0 + 0 + 1 = 1    result = "101"
  第 4 位：1 + 1 + 0 = 0(2) result = "10101"

3️⃣ 最終結果：
  return "10101"
```

### 程式碼實現

#### 方法一：模擬二進制加法

```typescript
function addBinary(a: string, b: string): string {
  let carry = 0;
  let result = '';
  let i = a.length - 1;
  let j = b.length - 1;

  while (i >= 0 || j >= 0 || carry > 0) {
    const digitA = i >= 0 ? Number.parseInt(a[i]) : 0;
    const digitB = j >= 0 ? Number.parseInt(b[j]) : 0;

    const sum = digitA + digitB + carry;
    result = (sum % 2) + result;
    carry = Math.floor(sum / 2);

    i--;
    j--;
  }

  return result;
}
```

#### 方法二：使用 BigInt 和二進制轉換

這是一個更簡潔的解法，利用 JavaScript 的特性：

```typescript
function addBinaryBigInt(a: string, b: string): string {
  const aBin = `0b${a}`; // 0b prefix 意思是二進制數字
  const bBin = `0b${b}`;
  const sum = BigInt(aBin) + BigInt(bBin);
  return sum.toString(2);
}
```

#### 知識點說明

1. **0b 前綴**
   - JavaScript 中的二進制字面量表示法
   - `0b` 後面接二進制數字
   - 例如：`0b1010` 等於十進制的 10

2. **BigInt**
   - 用於處理超過 `Number.MAX_SAFE_INTEGER` 的大數
   - 可以安全處理任意大的整數
   - 例如：`BigInt('0b1111')` 等於 15n

3. **toString(2)**
   - 將數字轉換為指定進制的字串
   - 參數 2 表示轉換為二進制
   - 例如：`15n.toString(2)` 等於 '1111'

### 複雜度分析

| 模擬二進位 | BigInt 二進位 |
| --- | --- |
| 時間複雜度：O(max(N, M)) | 時間複雜度：O(1) |
| 空間複雜度：O(max(N, M)) | 空間複雜度：O(1) |
| 需要存儲結果字串 |使用內建的二進制轉換 |
