---
title: Easy 543 - Diameter of Binary Tree
description: In this blog I will share a solution to the Diameter of Binary Tree problem.
date: 2025-02-08
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
  [題目連結](https://leetcode.com/problems/diameter-of-binary-tree)

  #description
  難度：Easy

  #content
  給定一個二元樹的根節點，計算該樹的直徑長度。二元樹的直徑是任意兩個節點之間路徑長度中的最大值。
  這條路徑可能穿過也可能不穿過根節點。

  ::br
  ::br

  example:

  ```bash
  輸入：root = [1,2,3,4,5]
  輸出：3
  解釋：
       1
      / \
     2   3
    / \
   4   5
  最長路徑是 [4,2,1,3] 或 [5,2,1,3]，長度為 3

  輸入：root = [1,2]
  輸出：1
  ```

  ::alert{title="限制" type="warning"}
  - 樹中節點數在範圍 [1, 10^4] 內
  - -100 <= Node.val <= 100
  ::

  #footer
  主題：Tree, Depth-First Search, Binary Tree
  ::
::

## 解題思路

### 思考過程

1. **初步分析**
   - 需要找出樹中任意兩點間的最長路徑
   - 路徑不一定經過根節點
   - 需要考慮左右子樹的高度

2. **解題技巧**
   - 使用遞迴計算每個節點的高度
   - 同時追蹤最大直徑
   - 直徑 = 左子樹高度 + 右子樹高度

3. **實作重點**
   - 使用全域變數記錄最大直徑
   - 遞迴函式返回節點高度
   - 注意處理空節點的情況

### 解題步驟

```bash
# 以 root = [1,2,3,4,5] 為例

1️⃣ 初始狀態：
  maxDiameter = 0

2️⃣ 遞迴過程：
  節點 4：高度 = 1
  節點 5：高度 = 1
  節點 2：高度 = 2，直徑 = 2
  節點 3：高度 = 1
  節點 1：高度 = 3，直徑 = 3

3️⃣ 最終結果：
  return maxDiameter = 3
```

### 程式碼實現

```typescript
function diameterOfBinaryTree(root: TreeNode | null): number {
  let maxDiameter = 0;

  function calculateHeight(node: TreeNode | null): number {
    if (node === null)
      return 0;

    const leftHeight = calculateHeight(node.left);
    const rightHeight = calculateHeight(node.right);

    maxDiameter = Math.max(maxDiameter, leftHeight + rightHeight);

    return Math.max(leftHeight, rightHeight) + 1;
  }

  calculateHeight(root);
  return maxDiameter;
}
```

### 複雜度分析

| 面向 | 複雜度 | 說明 |
| --- | --- | --- |
| 時間複雜度 | O(N) | 需要遍歷每個節點一次 |
| 空間複雜度 | O(H) | H 是樹的高度，遞迴調用棧的空間 |

## 解題重點

1. **全域狀態**
   - 使用閉包保存最大直徑
   - 避免重複計算
