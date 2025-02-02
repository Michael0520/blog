---
title: Medium 235. Lowest Common Ancestor of a Binary Search Tree
date: 2025-01-17
description: In this blog I will share a solution to the Lowest Common Ancestor of a Binary Search Tree problem.
---

## 235. Lowest Common Ancestor of a Binary Search Tree

- link: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/
- topic: tree, binary search tree, depth-first search
- difficulty: medium

## 題目描述

在這題中，我們需要在一個二元搜尋樹（Binary Search Tree, 簡稱 BST）中，找到兩個節點 `p` 和 `q` 的「最低共同父層級節點」（Lowest Common Ancestor, 簡稱 LCA）

### **什麼是最低共同父層級？**

假設我們有一棵樹，樹中的每個節點都有自己的「父層級」和「子層級」

- **父層級**：某個節點的上一層節點
- **子層級**：某個節點的下一層節點

最低共同父層級的意思是：對於兩個節點 `p` 和 `q`，我們要找到一個節點，這個節點同時是 `p` 和 `q` 的父層級，並且是「離它們最近的父層級」

---

### **範例**

#### 範例 1

假設我們有以下的二元搜尋樹：

```
        6
       / \
      2   8
     / \ / \
    0  4 7  9
      / \
     3   5
```

- **輸入**: `root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8`
- **輸出**: `6`
- **解釋**: 節點 2 和節點 8 的最低共同父層級節點是 6，因為 6 是同時包含 2 和 8 的最小節點

---

#### 範例 2

同樣的樹：

```
        6
       / \
      2   8
     / \ / \
    0  4 7  9
      / \
     3   5
```

- **輸入**: `root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4`
- **輸出**: `2`
- **解釋**: 節點 2 和節點 4 的最低共同父層級節點是 2，因為節點 2 本身就是節點 4 的父層級

---

## **解題思路**

這題可以利用 **二元搜尋樹（BST）** 的特性來快速找到答案

### **什麼是二元搜尋樹（BST）？**

- 在 BST 中，每個節點的左子樹節點值都比它小，右子樹節點值都比它大
- 這個特性讓我們可以很快地判斷應該往左邊還是右邊找

### **如何找到最低共同父層級？**

1. 從樹的根節點開始檢查
2. 如果 `p` 和 `q` 的值都比當前節點小，那麼它們一定在左子樹，我們就往左邊找
3. 如果 `p` 和 `q` 的值都比當前節點大，那麼它們一定在右子樹，我們就往右邊找
4. 如果一個值比當前節點小，另一個值比當前節點大，或者其中一個值等於當前節點，那麼當前節點就是最低共同父層級

---

## 解法：遞迴

```typescript
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (!root)
    return null;

  const currentVal = root.val;
  const minTarget = Math.min(p.val, q.val);
  const maxTarget = Math.max(p.val, q.val);

  if (currentVal > maxTarget) {
    return lowestCommonAncestor(root.left, p, q);
  }

  if (currentVal < minTarget) {
    return lowestCommonAncestor(root.right, p, q);
  }

  return root;
}
```

## **複雜度分析**

- **時間複雜度**：$O(H)$，其中 $H$ 是樹的高度。
  - 如果樹是平衡的，$H = \log n$，所以時間複雜度是 $O(\log n)$。
  - 如果樹是單邊的，$H = n$，所以時間複雜度是 $O(n)$。

- **空間複雜度**：$O(H)$，因為遞迴會使用呼叫棧的空間。

## **心得**

1. **二元搜尋樹的特性**讓我們可以快速判斷應該往哪個方向找，這是解題的關鍵。
2. 使用 Math.min/max 可以大幅簡化程式碼邏輯，提高可讀性。
3. 理解「最低共同父層級」的概念很重要，尤其是當節點本身可以是自己的父層級時。
