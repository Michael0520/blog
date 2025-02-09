---
title: Easy 876 - Middle of the Linked List
description: In this blog I will share a solution to the Middle of the Linked List problem.
date: 2025-02-09
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
  [題目連結](https://leetcode.com/problems/middle-of-the-linked-list)

  #description
  難度：Easy

  #content
  給定一個單向鏈結串列的頭節點 head，返回該鏈結串列的中間節點。
  如果有兩個中間節點，則返回第二個中間節點。

  ::br
  ::br

  example:

  ```bash
  輸入：head = [1,2,3,4,5]
  輸出：[3,4,5]
  解釋：鏈結串列中間節點是 3，返回從 3 開始的子串列。

  輸入：head = [1,2,3,4,5,6]
  輸出：[4,5,6]
  解釋：鏈結串列有兩個中間節點 3 和 4，返回第二個中間節點 4。
  ```

  ::alert{title="限制" type="warning"}
  - 鏈結串列中的節點數在範圍 [1, 100] 內
  - 1 <= Node.val <= 100
  ::

  #footer
  主題：Linked List, Two Pointers
  ::
::

## 解題思路

### 思考過程

1. **初步分析**
   - 需要找出鏈結串列的中間節點
   - 如果有兩個中間節點，返回第二個
   - 不能使用額外空間

2. **解題技巧**
   - 使用快慢指針（Floyd's Cycle Finding Algorithm）
   - 快指針每次走兩步
   - 慢指針每次走一步

3. **實作重點**
   - 處理空鏈結串列和單節點的情況
   - 注意快指針的邊界條件
   - 不需要計算長度

### 解題步驟

```bash
# 以 head = [1,2,3,4,5] 為例

1️⃣ 初始狀態：
  slow = 1
  fast = 1

2️⃣ 第一次移動：
  slow = 2
  fast = 3

3️⃣ 第二次移動：
  slow = 3
  fast = 5

4️⃣ 第三次移動：
  slow = 3 (停在這裡)
  fast = null (到達尾部)

5️⃣ 返回結果：
  return slow (值為 3)
```

### 程式碼實現

```typescript
function middleNode(head: ListNode | null): ListNode | null {
  if (!head)
    return null;

  let slowPointer = head;
  let fastPointer = head;

  while (fastPointer && fastPointer.next) {
    // 慢指針移動一步
    slowPointer = slowPointer.next!;
    // 快指針移動兩步
    fastPointer = fastPointer.next.next;
  }

  return slowPointer;
}
```

### 複雜度分析

| 面向 | 複雜度 | 說明 |
| --- | --- | --- |
| 時間複雜度 | O(N) | 只需要遍歷一次鏈結串列 |
| 空間複雜度 | O(1) | 只使用兩個指針，不需要額外空間 |

## 解題重點

1. **快慢指針技巧**
   - 快指針走兩步，慢指針走一步
   - 當快指針到達尾部，慢指針在中間
   - 適用於找中點、檢測環等問題

2. **邊界處理**
   - 處理空鏈結串列
   - 處理單節點情況
   - 處理偶數長度的情況

## 相關題目

1. **類似題目**
   - Linked List Cycle
   - Find the Duplicate Number
   - Palindrome Linked List
