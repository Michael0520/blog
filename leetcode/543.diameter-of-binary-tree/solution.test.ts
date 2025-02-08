import { describe, expect, it } from 'vitest';
import { diameterOfBinaryTree, TreeNode } from './solution';

describe('543. Diameter of Binary Tree', () => {
  // 輔助函數：建立測試樹
  function createTree(values: (number | null)[]): TreeNode | null {
    if (!values.length)
      return null;

    const root = new TreeNode(values[0] as number);
    const queue = [root];
    let i = 1;

    while (queue.length && i < values.length) {
      const node = queue.shift()!;

      // 左子節點
      if (i < values.length && values[i] !== null) {
        node.left = new TreeNode(values[i] as number);
        queue.push(node.left);
      }
      i++;

      // 右子節點
      if (i < values.length && values[i] !== null) {
        node.right = new TreeNode(values[i] as number);
        queue.push(node.right);
      }
      i++;
    }

    return root;
  }

  it('should handle example case 1', () => {
    const root = createTree([1, 2, 3, 4, 5]);
    expect(diameterOfBinaryTree(root)).toBe(3);
  });

  it('should handle example case 2', () => {
    const root = createTree([1, 2]);
    expect(diameterOfBinaryTree(root)).toBe(1);
  });

  it('should handle empty tree', () => {
    expect(diameterOfBinaryTree(null)).toBe(0);
  });

  it('should handle single node', () => {
    const root = createTree([1]);
    expect(diameterOfBinaryTree(root)).toBe(0);
  });

  it('should handle long path through root', () => {
    const root = createTree([1, 2, 3, 4, null, null, 5]);
    expect(diameterOfBinaryTree(root)).toBe(4);
  });

  it('should handle unbalanced tree', () => {
    const root = createTree([1, 2, null, 3, null, 4]);
    expect(diameterOfBinaryTree(root)).toBe(3);
  });
});
