import { describe, expect, it } from 'vitest';
import { updateMatrix } from './solution';

describe('542. 01 Matrix', () => {
  it('應該正確計算每個格子到最近的 0 的距離', () => {
    const input = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];
    const expected = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];
    expect(updateMatrix(input)).toEqual(expected);
  });

  it('應該處理較複雜的矩陣', () => {
    const input = [
      [0, 0, 0],
      [0, 1, 0],
      [1, 1, 1],
    ];
    const expected = [
      [0, 0, 0],
      [0, 1, 0],
      [1, 2, 1],
    ];
    expect(updateMatrix(input)).toEqual(expected);
  });

  it('應該處理只有一個元素的矩陣', () => {
    expect(updateMatrix([[0]])).toEqual([[0]]);
    expect(updateMatrix([[1]])).toEqual([[1]]);
  });

  it('應該處理較大的矩陣', () => {
    const input = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 0],
    ];
    const expected = [
      [4, 3, 2],
      [3, 2, 1],
      [2, 1, 0],
    ];
    expect(updateMatrix(input)).toEqual(expected);
  });
});
