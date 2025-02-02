---
title: Easy 110. Balanced Binary Tree
date: 2025-01-19 23:00:00
description: In this blog I will share a solution to the Balanced Binary Tree problem
---

## 110. Balanced Binary Tree

## 核心概念

### 目標

判斷一個二元樹是否維持「平衡」狀態。這個問題考驗對樹結構的理解和遞迴的應用。

### 平衡的定義

一個二元樹被視為平衡的條件：

- 任意節點的左右子樹高度差 ≤ 1
- 所有子樹都必須平衡

## 問題分析

### 關鍵思路

1. 需要同時判斷兩件事：
   - 當前節點是否平衡
   - 所有子樹是否平衡

2. 優化重點：
   - 避免重複計算高度
   - 發現不平衡時提早返回

## 圖解說明

### 平衡案例 ✅

```bash
     3
   /   \
  9    20
      /  \
     15   7
```

高度分析：

- 節點 3：|1 - 2| = 1 ≤ 1
- 節點 20：|1 - 1| = 0 ≤ 1
- 節點 9：|0 - 0| = 0 ≤ 1

### 不平衡案例 ❌

```bash
        1
       /  \
      2    2
     /  \
    3    3
   / \
  4   4
```

問題點：

- 節點 2 的左子樹深度為 3
- 節點 2 的右子樹深度為 1
- |3 - 1| = 2 > 1，違反平衡條件

## 最佳解法

```typescript
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function isBalanced(root: TreeNode | null): boolean {
  // 使用 -1 作為不平衡的標記
  const getHeight = (node: TreeNode | null): number => {
    // 基礎情況：空節點高度為 0
    if (!node)
      return 0;

    // 解構以提高可讀性
    const { left, right } = node;

    // 遞迴計算子樹高度
    const leftHeight = getHeight(left);
    const rightHeight = getHeight(right);

    // 優化：任一子樹不平衡，直接返回 -1
    if (leftHeight === -1 || rightHeight === -1)
      return -1;

    // 計算高度差
    const heightDiff = Math.abs(leftHeight - rightHeight);

    // 如果高度差 > 1，返回 -1 表示不平衡
    // 否則返回當前子樹的高度
    return heightDiff > 1 ? -1 : Math.max(leftHeight, rightHeight) + 1;
  };

  return getHeight(root) !== -1;
}
```

## 技術亮點

1. **優雅的遞迴設計**：
   - 使用 -1 作為特殊標記
   - 一次遍歷完成所有判斷

2. **效能優化**：
   - 提早返回避免無用計算
   - 合併高度計算和平衡判斷

3. **程式碼品質**：
   - 清晰的變數命名
   - 適當的程式碼分層
   - 充分的註解說明

## 複雜度分析

- **時間複雜度**：O(n)
  - 每個節點只被訪問一次
  - 不需要重複計算高度

- **空間複雜度**：O(H)
  - H 為樹的高度
  - 主要來自遞迴堆疊

## 進階思考

1. **為什麼選擇 -1 作為標記？**
   - 高度永遠 ≥ 0
   - -1 是自然的特殊值
   - 容易與正常高度區分

2. **遞迴的優勢**：
   - 程式碼簡潔優雅
   - 邏輯清晰直觀
   - 易於理解和維護

## 實務應用

1. **資料庫索引**：
   - B-tree 需要保持平衡
   - 影響查詢效能

2. **負載均衡**：
   - 服務器負載需要平衡
   - 類似概念的應用
