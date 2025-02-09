/**
 * Definition for a binary tree node.
 */
export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

export function maxDepth(root: TreeNode | null): number {
  // 基本情況：空節點的深度為 0
  if (!root)
    return 0;

  // 遞迴計算左右子樹的深度
  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);

  // 返回較大的深度 + 1（當前節點）
  return Math.max(leftDepth, rightDepth) + 1;
}
