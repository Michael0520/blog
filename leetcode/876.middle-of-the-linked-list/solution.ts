/**
 * Definition for singly-linked list.
 */
export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

export function middleNode(head: ListNode | null): ListNode | null {
  // 處理空鏈結串列
  if (!head)
    return null;

  let slowPointer = head;
  let fastPointer = head;

  // 繼續移動的條件：
  // 1. fastPointer 不為 null（處理奇數長度）
  // 2. fastPointer.next 不為 null（處理偶數長度）
  while (fastPointer && fastPointer.next) {
    // 因為 while 條件確保了 fastPointer 存在，所以 slowPointer 一定也存在
    slowPointer = slowPointer.next as ListNode;
    // 快指針移動兩步
    fastPointer = fastPointer.next.next as ListNode;
  }

  return slowPointer;
}
