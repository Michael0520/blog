import { describe, expect, it } from 'vitest';
import promiseAll, { promiseAllOptimized } from './solution';

describe('promiseAll', () => {
  it('應該處理空陣列', async () => {
    const result = await promiseAll([]);
    expect(result).toEqual([]);
  });

  it('應該按順序返回結果', async () => {
    const p1 = Promise.resolve(1);
    const p2 = Promise.resolve(2);
    const p3 = Promise.resolve(3);

    const result = await promiseAll([p1, p2, p3]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('應該處理混合輸入', async () => {
    const result = await promiseAll([
      Promise.resolve(1),
      2,
      Promise.resolve(3),
    ]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('應該立即處理錯誤', async () => {
    const error = new Error('測試錯誤');
    await expect(promiseAll([
      Promise.resolve(1),
      Promise.reject(error),
      Promise.resolve(3),
    ])).rejects.toEqual(error);
  });

  it('應該處理非同步 Promise', async () => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const p1 = delay(50).then(() => 1);
    const p2 = delay(10).then(() => 2);
    const p3 = delay(30).then(() => 3);

    const result = await promiseAll([p1, p2, p3]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('應該處理不同型別的值', async () => {
    interface MixedValue {
      key?: string;
      value?: string | number | boolean;
    }

    const result = await promiseAll<string | number | boolean | MixedValue>([
      Promise.resolve('string'),
      42,
      Promise.resolve(true),
      { key: 'value' },
    ]);
    expect(result).toEqual(['string', 42, true, { key: 'value' }]);
  });
});

describe('promiseAllOptimized', () => {
  it('應該處理空陣列', async () => {
    const result = await promiseAllOptimized([]);
    expect(result).toEqual([]);
  });

  it('應該拒絕非陣列輸入', async () => {
    // @ts-expect-error 測試非陣列輸入
    await expect(promiseAllOptimized('not an array')).rejects.toThrow(TypeError);
  });

  it('應該按順序返回結果', async () => {
    const p1 = Promise.resolve(1);
    const p2 = Promise.resolve(2);
    const p3 = Promise.resolve(3);

    const result = await promiseAllOptimized([p1, p2, p3]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('應該處理混合輸入', async () => {
    const result = await promiseAllOptimized([
      Promise.resolve(1),
      2,
      Promise.resolve(3),
    ]);
    expect(result).toEqual([1, 2, 3]);
  });

  it('應該立即處理錯誤', async () => {
    const error = new Error('測試錯誤');
    await expect(promiseAllOptimized([
      Promise.resolve(1),
      Promise.reject(error),
      Promise.resolve(3),
    ])).rejects.toEqual(error);
  });

  it('應該處理大量 Promise', async () => {
    const promises = Array.from({ length: 1000 }, (_, i) => Promise.resolve(i));
    const result = await promiseAllOptimized(promises);
    expect(result).toHaveLength(1000);
    expect(result[0]).toBe(0);
    expect(result[999]).toBe(999);
  });
});
