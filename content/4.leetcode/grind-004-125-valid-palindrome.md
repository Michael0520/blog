---
title: Easy 125. Valid Palindrome
date: "2025-01-14"
description: In this blog I will share a solution to the Valid Palindrome problem.
image: /blogs-img/leetcode-grind-75.png
alt: Valid Palindrome solution
ogImage: /blogs-img/leetcode-grind-75.png
tags: ["leetcode", "javascript"]
published: true
---

## Valid Palindrome

- link: https://leetcode.com/problems/valid-palindrome/
- topic: string, two pointers
- difficulty: easy

## 題目描述

給定一個字串，判斷它是否是回文。判斷規則如下：

1. 忽略大小寫（例如：'A' 和 'a' 視為相同）
2. 只考慮字母和數字
3. 空字串或只有空格的字串都算是回文

Example 1:

```bash
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" 是回文
```

Example 2:

```bash
Input: s = "race a car"
Output: false
Explanation: "raceacar" 不是回文
```

## 解題思路

這題可以用「雙指針」的方式來解決，步驟如下：

1. **清理字串**

   ```javascript
   "A man, a plan, a canal: Panama"
   ↓ (轉小寫 + 移除特殊字元)
   "amanaplanacanalpanama"
   ```

2. **使用雙指針比較**

   ```javascript
   "amanaplanacanalpanama"
    L                    R    // L = left pointer, R = right pointer

   "amanaplanacanalpanama"
     L                  R     // 如果相同，兩個指針往中間移動

   "amanaplanacanalpanama"
            L    R            // 一直比較到指針相遇
   ```

### 複雜度分析

- 時間複雜度：O(n)，需要遍歷整個字串一次
- 空間複雜度：O(n)，需要存儲清理後的字串

## 程式碼

```javascript
const isPalindrome = (s) => {
  // 1. 使用 optional chaining 和 nullish coalescing
  const cleanStr = s?.toLowerCase()?.replace(/[^a-z0-9]/g, "") ?? ""

  // 2. 使用解構賦值設置指針
  let [left, right] = [0, cleanStr.length - 1]

  // 3. 使用雙指針比較
  while (left < right) {
    // 使用 early return pattern
    if (cleanStr[left] !== cleanStr[right]) return false
    ;[left, right] = [left + 1, right - 1]
  }

  return true
}
```

## 程式碼說明

1. **錯誤處理**

   - 使用 optional chaining (`?.`) 處理 null/undefined
   - 使用 nullish coalescing (`??`) 提供預設值

2. **程式碼可讀性**

   - 使用解構賦值讓程式碼更簡潔
   - 加入適當的註解說明邏輯
   - 使用 early return pattern

3. **效能考量**
   - 避免重複計算字串長度
   - 使用解構賦值一次更新兩個指針

## 解題心得

1. **雙指針技巧**

   - 適合處理回文、排序等問題
   - 可以有效減少迴圈次數

2. **字串處理技巧**
   - 正則表達式是處理字串的好工具
   - 善用 ES6+ 的字串方法
