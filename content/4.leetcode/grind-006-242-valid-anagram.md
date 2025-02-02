---
title: Easy 242. Valid Anagram
date: 2025-01-15
description: In this blog I will share a solution to the Valid Anagram problem.
---

## Valid Anagram

- link: https://leetcode.com/problems/valid-anagram/
- topic: string, hash table
- difficulty: easy

## 題目描述

給定兩個字串 s 和 t，判斷 t 是否為 s 的重組字（即字母重新排列後可以得到的字串）。

Example 1:

```bash
Input: s = "anagram", t = "nagaram"
Output: true
Explanation: "anagram" 重新排列後可以得到 "nagaram"
```

Example 2:

```bash
Input: s = "rat", t = "car"
Output: false
Explanation: "rat" 不可能重新排列得到 "car"
```

## 解題思路

要判斷兩個字串是否為重組字（Anagram），我們需要：

1. **長度檢查**
   - 如果兩個字串長度不同，一定不是重組字
   - 這是最基本且必要的檢查

2. **字母頻率統計**
   - 使用 Map 記錄第一個字串中每個字母出現的次數
   - 例如 "anagram" 會得到：

     ```bash
     Map {
       'a' => 3,
       'n' => 1,
       'g' => 1,
       'r' => 1,
       'm' => 1
     }
     ```

3. **字母頻率驗證**
   - 檢查第二個字串的每個字母
   - 如果字母不存在或次數為 0，代表不是重組字
   - 每次檢查後減少該字母的計數

## 程式碼

```javascript
function isAnagram(s, t) {
  // 長度檢查
  if (s.length !== t.length)
    return false;

  // 建立頻率 Map
  const freq = new Map();

  // 統計第一個字串
  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  // 驗證第二個字串
  for (const char of t) {
    // 字母不存在或次數為 0
    if (!freq.has(char) || freq.get(char) === 0) {
      return false;
    }
    freq.set(char, freq.get(char) - 1);
  }

  return true;
}
```

### 複雜度分析

- 時間複雜度：O(n)，只需要遍歷每個字串一次
- 空間複雜度：O(1)，因為最多只需要 26 個字母的空間

## 解題重點

1. **效能考量**
   - 使用 Map 提供最佳效能
   - 提早返回可以避免不必要的運算
   - 固定大小的空間複雜度

2. **實作建議**
   - 先檢查基本條件（長度）
   - 使用 Map 而不是物件，效能更好
   - 善用提早返回來優化程式流程
