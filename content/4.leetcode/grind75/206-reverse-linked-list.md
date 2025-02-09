---
title: Easy 206 - Reverse Linked List
description: In this blog I will share a solution to the Reverse Linked List problem.
date: 2025-02-06
read: '10'
---

::div{class="mt-6"}

  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  [題目連結](https://leetcode.com/problems/reverse-linked-list)

  #description
  難度：Easy

  #content

  給定一個單向鏈結串列的頭節點 `head`，將整個串列反轉並返回反轉後的頭節點。

  example:

  ```bash
  輸入：head = [1,2,3,4,5]
  輸出：[5,4,3,2,1]

  輸入：head = [1,2]
  輸出：[2,1]
  ```

  ::alert{title="限制" type="warning"}
  - 節點數量範圍是 [0, 5000]
  - -5000 <= Node.val <= 5000
  ::

  #footer
  :badge[Linked List]
  :badge[Two Pointers]
  ::
::

## 解題思路

### 雙指針解法

使用三個指針 (prev, curr, next) 來反轉鏈結：

```bash
# 步驟說明

1️⃣ 初始狀態：
  1 -> 2 -> 3 -> 4 -> 5
  ⬆
  curr
  prev = null

2️⃣ 第一次反轉後：
  null <- 1  2 -> 3 -> 4 -> 5
         ⬆   ⬆
         prev curr

3️⃣ 第二次反轉後：
  null <- 1 <- 2  3 -> 4 -> 5
               ⬆   ⬆
               prev curr

4️⃣ 第三次反轉後：
  null <- 1 <- 2 <- 3  4 -> 5
                   ⬆   ⬆
                   prev curr

5️⃣ 最終結果：
  null <- 1 <- 2 <- 3 <- 4 <- 5
                             ⬆
                             prev (新的頭節點)

每一步的操作：
1. 保存當前節點的下一個節點
2. 將當前節點指向前一個節點
3. 移動 prev 到當前節點
4. 移動 curr 到下一個節點
```

## 程式碼實現

### 雙指針解法

```typescript
function reverseList(head: ListNode | null): ListNode | null {
  type Pointers = Record<'prev' | 'curr', ListNode | null>;

  const pointers: Pointers = {
    prev: null, // 將成為新的頭節點
    curr: head, // 用於遍歷原始串列
  };

  while (pointers.curr) {
    const updatePointers = ({ curr, prev }: Pointers) => ({
      next: prev, // 反轉指針方向
      newPrev: curr, // 當前節點將成為下一個的 prev
      newCurr: curr.next, // 移動到下一個節點
    });

    const { next, newPrev, newCurr } = updatePointers(pointers);

    pointers.curr.next = next;
    pointers.prev = newPrev;
    pointers.curr = newCurr;
  }

  return pointers.prev; // prev 現在指向反轉後的頭節點（原始陣列的最後一個節點）
}
```

### 複雜度分析

- **時間複雜度**：O(n)
  - 只需遍歷串列一次
  - 每個節點只處理一次

- **空間複雜度**：O(1)
  - 只使用固定數量的指針
  - 不需要額外的資料結構
