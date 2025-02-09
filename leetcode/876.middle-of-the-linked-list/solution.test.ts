import { describe, expect, it } from 'vitest';
import { ListNode, middleNode } from './solution';

describe('876. Middle of the Linked List', () => {
  // 輔助函數：建立鏈結串列
  function createLinkedList(arr: number[]): ListNode | null {
    if (arr.length === 0)
      return null;

    const head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
      current.next = new ListNode(arr[i]);
      current = current.next;
    }
    return head;
  }

  // 輔助函數：將鏈結串列轉換為陣列
  function linkedListToArray(head: ListNode | null): number[] {
    const result: number[] = [];
    let current = head;
    while (current !== null) {
      result.push(current.val);
      current = current.next;
    }
    return result;
  }

  it('should handle example case 1', () => {
    const head = createLinkedList([1, 2, 3, 4, 5]);
    const result = middleNode(head);
    expect(linkedListToArray(result)).toEqual([3, 4, 5]);
  });

  it('should handle example case 2', () => {
    const head = createLinkedList([1, 2, 3, 4, 5, 6]);
    const result = middleNode(head);
    expect(linkedListToArray(result)).toEqual([4, 5, 6]);
  });

  it('should handle single node', () => {
    const head = createLinkedList([1]);
    const result = middleNode(head);
    expect(linkedListToArray(result)).toEqual([1]);
  });

  it('should handle two nodes', () => {
    const head = createLinkedList([1, 2]);
    const result = middleNode(head);
    expect(linkedListToArray(result)).toEqual([2]);
  });

  it('should handle empty list', () => {
    const result = middleNode(null);
    expect(result).toBeNull();
  });
});
