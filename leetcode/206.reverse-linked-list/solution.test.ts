import { describe, expect, it } from 'vitest';
import { ListNode, reverseList } from './solution';

describe('206. Reverse Linked List', () => {
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

  function linkedListToArray(head: ListNode | null): number[] {
    const result: number[] = [];
    let current = head;
    while (current !== null) {
      result.push(current.val);
      current = current.next;
    }
    return result;
  }

  it('should reverse a linked list about 5 nodes', () => {
    const input = createLinkedList([1, 2, 3, 4, 5]);
    const result = reverseList(input);
    expect(linkedListToArray(result)).toEqual([5, 4, 3, 2, 1]);
  });

  it('should reverse a linked list about 3 nodes', () => {
    const input = createLinkedList([1, 2, 3]);
    const result = reverseList(input);
    expect(linkedListToArray(result)).toEqual([3, 2, 1]);
  });

  it('should handle empty list', () => {
    expect(reverseList(null)).toBeNull();
  });

  it('should handle single node', () => {
    const input = createLinkedList([1]);
    const result = reverseList(input);
    expect(linkedListToArray(result)).toEqual([1]);
  });
});
