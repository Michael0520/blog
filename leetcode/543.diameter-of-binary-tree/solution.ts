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

export function diameterOfBinaryTree(root: TreeNode | null): number {
  // 用來追蹤最大直徑
  let maxDiameter = 0;

  // 遞迴計算每個節點的高度，同時更新最大直徑
  function calculateHeight(node: TreeNode | null): number {
    // 基本情況：空節點的高度為 0
    if (node === null)
      return 0;

    // 遞迴計算左右子樹的高度
    const leftHeight = calculateHeight(node.left);
    const rightHeight = calculateHeight(node.right);

    // 更新最大直徑（左子樹高度 + 右子樹高度）
    maxDiameter = Math.max(maxDiameter, leftHeight + rightHeight);

    // 返回當前節點的高度（左右子樹中較高的一個 + 1）
    return Math.max(leftHeight, rightHeight) + 1;
  }

  calculateHeight(root);
  return maxDiameter;
}
