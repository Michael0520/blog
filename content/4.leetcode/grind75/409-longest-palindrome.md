---
title: Easy 409 - Longest Palindrome
description: In this blog I will share a solution to the Longest Palindrome problem.
date: 2025-02-05 00:30:00
read: '10'
---

::div{class="mt-6"}

  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  [題目連結](https://leetcode.com/problems/longest-palindrome)

  #description
  難度：Easy

  #content

  - 給定一個由大小寫英文字母組成的字串 s，找出可以用這些字母組成的最長回文字串長度
  - 字母區分大小寫，例如 `Aa` 不是回文字串。

  example:

  ```bash
  輸入：s = "abccccdd"
  輸出：7
  解釋：可以組成的最長回文字串是 "dccaccd"

  輸入：s = "a"
  輸出：1
  ```

  ::alert{title="限制" type="warning"}
  - 1 <= s.length <= 2000
  - s 只包含大小寫英文字母
  ::

  #footer
  :badge[Hash Table]
  :badge[String]
  :badge[Greedy]
  ::
::

## 解題思路

### 什麼是回文字串？
回文字串就像是鏡子的倒影，從左讀到右和從右讀到左都一樣。
例如：`"abba"`, `"racecar"`, `"noon"`

### 回文字串的特性
1. 大部分的字母都要成對出現
   ```
   例如 "noon":
   - 'n' 出現 2次，可以放在兩邊 -> n[][]n
   - 'o' 出現 2次，可以放在中間 -> noon
   ```

2. 最多可以有一個字母出現在中間
   ```
   例如 "racecar":
   - 'r' 出現 2次，放在兩邊    -> r[][]r
   - 'a' 出現 2次，放在次外層  -> ra[]ar
   - 'c' 出現 2次，放在內層    -> rac[]car
   - 'e' 出現 1次，放在正中間  -> racecar
   ```

### 解題步驟 (使用 Set 解法)
1. **使用 Set 追蹤未配對的字母**
   ```typescript
   // 例如處理: "aabaa"
   const unpairedLetters = new Set<string>(); // 用來存放還沒找到配對的字母
   ```

2. **尋找字母配對**
   當遇到字母時：
   - 如果 Set 中已有這個字母 -> 找到一對! (例如: aa -> 可以放在兩邊)
   - 如果是新字母 -> 加入 Set 等待配對 (例如: 第一個 a -> 先存起來)

3. **處理中心點**
    最後檢查 Set：
    - 如果 Set 不是空的 -> 可以選一個字母當中心點 (例如: b -> 放中間)
    - 如果 Set 是空的 -> 不需要中心點 (例如: "aa" -> 直接配對)

### 舉個例子
```
輸入："aabaa"

步驟 1: 遇到第一個 'a'
- Set: {'a'}
- 視覺化: [a]

步驟 2: 遇到第二個 'a'
- 找到配對！計數 +2
- Set: {}
- 視覺化: a[]a

步驟 3: 遇到 'b'
- Set: {'b'}
- 視覺化: a[b]a

步驟 4: 遇到第三個 'a'
- Set: {'b', 'a'}
- 視覺化: a[b]a[a]

步驟 5: 遇到第四個 'a'
- 找到配對！計數 +2
- Set: {'b'}
- 視覺化: aabaa

最後：
- 已配對數量：4 (來自兩對 'a')
- Set 中剩下 'b'，可以當中心點 (+1)
- 總長度 = 4 + 1 = 5
```

### 複雜度分析
- **時間複雜度**: O(n)
  - 只需遍歷字串一次
  - Set 的操作 (add/delete/has) 都是 O(1)

- **空間複雜度**: O(1)
  - Set 最多存 52 個字母 (26 大寫 + 26 小寫)
  - 不會隨著輸入字串長度增加而增加

## 程式碼實作

```typescript
function longestPalindrome(s: string): number {
  // 用 Set 來追蹤未配對的字母
  const unpairedLetters = new Set<string>();
  // 記錄已配對的字母數量
  let pairedCount = 0;

  // 遍歷每個字母尋找配對
  for (const letter of s) {
    // 如果找到配對的字母
    if (unpairedLetters.has(letter)) {
      // 計數加 2 並移除已配對的字母
      pairedCount += 2;
      unpairedLetters.delete(letter);
    }
    // 如果是新字母，加入 Set 等待配對
    else {
      unpairedLetters.add(letter);
    }
  }

  // 如果有剩餘未配對的字母，可以選一個當中心點
  const centerLetter = unpairedLetters.size > 0 ? 1 : 0;

  return pairedCount + centerLetter;
}
```
