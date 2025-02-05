/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

export function reverseList(head: ListNode | null): ListNode | null {
  type Pointers = Record<'prev' | 'curr', ListNode | null>;

  const pointers: Pointers = {
    prev: null, // 將成為新的頭節點
    curr: head, // 用於遍歷原始串列
  };

  while (pointers.curr) {
    const updatePointers = ({ curr, prev }: Pointers) => ({
      next: prev, // 反轉指針方向
      newPrev: curr!, // 當前節點將成為下一個的 prev
      newCurr: curr!.next, // 移動到下一個節點
    });

    const { next, newPrev, newCurr } = updatePointers(pointers);

    pointers.curr.next = next;
    pointers.prev = newPrev;
    pointers.curr = newCurr;
  }

  return pointers.prev; // prev 現在指向反轉後的頭節點
}
