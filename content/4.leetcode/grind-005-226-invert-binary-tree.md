---
title: Easy 226. Invert Binary Tree
date: "2025-01-14"
description: In this blog I will share a solution to the Invert Binary Tree problem.
image: /blogs-img/leetcode-grind-75.png
alt: Invert Binary Tree solution
ogImage: /blogs-img/leetcode-grind-75.png
tags: ["leetcode", "javascript"]
published: true
---

## Invert Binary Tree

- link: https://leetcode.com/problems/invert-binary-tree/
- topic: binary tree, recursion
- difficulty: easy

## 題目描述

給定一個二元樹的根節點，將整棵樹左右翻轉。

Example 1:

```bash
Input:
     4
   /   \
  2     7
 / \   / \
1   3 6   9

Output:
     4
   /   \
  7     2
 / \   / \
9   6 3   1
```

Example 2:

```bash
Input:
     2
   /   \
  1     3

Output:
     2
   /   \
  3     1
```

## 解題思路

這題可以用遞迴的方式來解決，步驟如下：

1. **基本概念**

   ```javascript
   // 原始樹
        4
      /   \
     2     7
   
   // 翻轉後
        4
      /   \
     7     2
   ```

2. **遞迴過程**

   ```javascript
   // 1. 先儲存左子樹
   temp = root.left  // (2)
   
   // 2. 左邊換成右子樹
   root.left = root.right  // (7)
   
   // 3. 右邊換成原本的左子樹
   root.right = temp  // (2)
   
   // 4. 對子節點重複此過程
   ```

### 複雜度分析

- 時間複雜度：O(n)，需要遍歷每個節點一次
- 空間複雜度：O(h)，h 是樹的高度，遞迴調用棧的空間

## 程式碼

```javascript
const invertTree = (root) => {
    // 處理邊界情況：空節點直接返回
    if (!root) return null;
    
    // 使用解構賦值交換左右子樹
    [root.left, root.right] = [
        invertTree(root.right),  // 遞迴處理右子樹
        invertTree(root.left)    // 遞迴處理左子樹
    ];
    
    return root;
};
```

## 程式碼說明

1. **邊界處理**
   - 簡潔的條件判斷 `if (!root)`

2. **現代 JavaScript 特性**
   - 使用解構賦值一次完成交換
   - 這樣就可以避免使用變數去維護左右子樹

3. **遞迴處理**
   - 同時處理左右子樹
   - 返回處理完的節點

## 解題心得

1. **遞迴思維**
   - 把大問題分解成相同的小問題
   - 找到適當的終止條件很重要

2. **程式碼優化**
   - 解構賦值讓交換操作更好懂
