---
title: Easy 383 - Ransom Note
description: In this blog I will share a solution to the Ransom Note problem.
date: 2025-02-04 00:30:00
read: '10'
---

::div{class="mt-6"}

  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  [題目連結](https://leetcode.com/problems/ransom-note)

  #description
  難度：Easy

  #content

  給定兩個字串 `ransomNote` 和 `magazine`，判斷 `magazine` 中的字串是否可以用來組成 `ransomNote`。
  `magazine` 中的每個字串只能在 `ransomNote` 中使用一次。

  example:

  ```bash
  輸入：ransomNote = "aa", magazine = "aab"
  輸出：true
  解釋：magazine 中有兩個 'a' 和一個 'b'，可以用來組成 "aa"
  ```

  ::alert{title="限制" type="warning"}
  - 1 <= ransomNote.length, magazine.length <= 105
  - ransomNote 和 magazine 由小寫英文字母組成
  ::

  #footer
  :badge[Hash Table]
  :badge[String]
  :badge[Counting]
  ::
::

## 解題思路

### 狀態說明

```
[初始化 Map] ────────┐
    │                │
    ▼                │ magazine 字串
[統計頻率] ◄─────────┘
    │
    ▼                  ransomNote 字串
[檢查頻率] ◄─────────┐
    │                │
    ├────────────────┘ 還有字串未檢查
    │
    ▼
[頻率不足?] ────┐
    │          │
    ├──────────┘ No
    │ Yes
    ▼
[返回結果]
false/true

步驟說明：
1. 建立空的 Map 物件
2. 遍歷 magazine 統計字串頻率
3. 遍歷 ransomNote 檢查每個字串
4. 如果頻率不足返回 false
5. 檢查完所有字串返回 true
```

### 複雜度分析

- 時間複雜度：O(m + n)
  - m 是 magazine 長度
  - n 是 ransomNote 長度
  - 需要遍歷兩個字串
- 空間複雜度：O(1)
  - 固定大小的字串集（26個字母）
  - 與輸入規模無關

## 程式碼實現

```typescript
function canConstruct(ransomNote: string, magazine: string): boolean {
  // 新增 Map 物件
  const charCount = new Map<string, number>();

  // 統計 magazine 中字串頻率
  for (const char of magazine) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  // 檢查 ransomNote 中的每個字串
  for (const char of ransomNote) {
    const count = charCount.get(char) || 0;
    if (count === 0)
      return false;
    charCount.set(char, count - 1);
  }

  return true;
}
```

### 程式碼解釋

1. Map 初始化和字符統計
   - 使用 Map 存儲字符頻率
   - 使用 get/set 管理計數

2. 字串的檢查和更新
   - 檢查字串可用性
   - 更新剩餘數量
