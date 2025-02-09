---
title: Easy 104 - Maximum Depth of Binary Tree
description: In this blog I will share a solution to the Maximum Depth of Binary Tree problem.
date: 2025-02-09 22:00:00
read: '10'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  [題目連結](https://leetcode.com/problems/maximum-depth-of-binary-tree)

  #description
  難度：Easy

  #content
  給定一個二元樹的根節點 root，返回其最大深度。
  二元樹的最大深度是指從根節點到最遠葉節點的最長路徑上的節點數。

  ::br
  ::br

  example:

  ```bash
  輸入：root = [3,9,20,null,null,15,7]
  輸出：3
  解釋：
       3
      / \
     9  20
        /  \
       15   7
  最大深度為 3（從根節點到 15 或 7 的路徑）

  輸入：root = [1,null,2]
  輸出：2
  ```

  ::alert{title="限制" type="warning"}
  - 樹中節點的數量在範圍 [0, 10^4] 內
  - -100 <= Node.val <= 100
  ::

  #footer
  :badge[Tree]
  :badge[Depth-First Search]
  :badge[Breadth-First Search]
  :badge[Binary Tree]
  ::
::

## 解題思路

### 思考過程

1. **初步分析**
   - 需要找出從根節點到最遠葉節點的路徑長度
   - 可以使用遞迴或迭代方式
   - 需要比較左右子樹的深度

2. **解題技巧**
   - 每個節點的深度是其子樹深度的最大值加 1
   - 空節點的深度為 0

3. **實作重點**
   - 處理空樹的情況
   - 遞迴計算左右子樹深度
   - 返回較大深度加 1

### 解題步驟

```bash
# 以 root = [3,9,20,null,null,15,7] 為例

1️⃣ 初始狀態：
  root = 3

2️⃣ 遞迴過程：
  左子樹：
    9 -> 深度 1
  右子樹：
    20
    /  \
   15   7
    -> 深度 2

3️⃣ 計算結果：
  max(1, 2) + 1 = 3

4️⃣ 返回結果：
  return 3
```

### 程式碼實現

```typescript
function maxDepth(root: TreeNode | null): number {
  if (!root)
    return 0;

  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);

  return Math.max(leftDepth, rightDepth) + 1;
}
```

### 複雜度分析

| 面向 | 複雜度 | 說明 |
| --- | --- | --- |
| 時間複雜度 | O(N) | 需要遍歷每個節點一次 |
| 空間複雜度 | O(H) | H 是樹的高度，遞迴調用棧的空間 |
