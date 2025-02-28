import { describe, expect, it } from 'vitest';
import { curry, curryOptimized } from './solution';

describe('curry function', () => {
  // 基本測試：確保函數正確柯里化
  it('應該正確柯里化二元函數', () => {
    const add = (a: number, b: number) => a + b;
    const curriedAdd = curry(add);

    expect(curriedAdd(3)(4)).toBe(7);

    const addThree = curriedAdd(3);
    expect(addThree(4)).toBe(7);
  });

  // 多參數測試：確保能處理三個或更多參數
  it('應該正確柯里化三元函數', () => {
    const multiply = (a: number, b: number, c: number) => a * b * c;
    const curriedMultiply = curry(multiply);

    expect(curriedMultiply(4)(5)(6)).toBe(120);

    const multiplyFour = curriedMultiply(4);
    const multiplyFourFive = multiplyFour(5);
    expect(multiplyFourFive(6)).toBe(120);
  });

  // 參數驗證：確保每次只接受一個參數
  it('應該拒絕多參數調用', () => {
    const add = (a: number, b: number) => a + b;
    const curriedAdd = curry(add);

    expect(() => {
      // @ts-expect-error - 故意傳入多個參數
      curriedAdd(1, 2);
    }).toThrow('Each function must take exactly one argument');
  });

  // 型別安全：確保型別檢查正常工作
  it('應該保持型別安全', () => {
    const concat = (a: string, b: number) => a + b;
    const curriedConcat = curry(concat);

    expect(curriedConcat('hello')(42)).toBe('hello42');
  });

  // 邊界情況：處理零參數函數
  it('應該處理零參數函數', () => {
    const getAnswer = () => 42;
    const curriedGetAnswer = curry(getAnswer);

    expect(curriedGetAnswer()).toBe(42);
  });

  // 邊界情況：處理單參數函數
  it('應該處理單參數函數', () => {
    const double = (x: number) => x * 2;
    const curriedDouble = curry(double);

    expect(curriedDouble(21)).toBe(42);
  });

  // 保留 this 上下文
  it('應該保留 this 上下文', () => {
    const obj = {
      multiplier: 2,
      multiply(a: number, b: number) {
        return a * b * this.multiplier;
      },
    };

    const boundMultiply = obj.multiply.bind(obj);
    const curriedMultiply = curry(boundMultiply);

    expect(curriedMultiply(3)(4)).toBe(24); // 3 * 4 * 2 = 24
  });
});

// 測試優化版本
describe('curryOptimized function', () => {
  // 基本功能測試
  it('應該正確柯里化函數', () => {
    const add = (a: number, b: number) => a + b;
    const curriedAdd = curryOptimized(add);

    expect(curriedAdd(3)(4)).toBe(7);
  });

  // 記憶體管理測試
  it('應該在執行後清理記憶體', () => {
    let executed = false;
    const fn = (a: number, b: number) => {
      executed = true;
      return a + b;
    };

    const curriedFn = curryOptimized(fn);
    const partial = curriedFn(1);

    // 執行函數
    partial(2);
    expect(executed).toBe(true);

    // 重置標記
    executed = false;

    // 再次執行，確保不會重用之前的參數
    partial(3);
    expect(executed).toBe(true);
  });

  // 參數驗證
  it('應該拒絕多參數調用', () => {
    const add = (a: number, b: number) => a + b;
    const curriedAdd = curryOptimized(add);

    expect(() => {
      // @ts-expect-error - 故意傳入多個參數
      curriedAdd(1, 2);
    }).toThrow('Each function must take exactly one argument');
  });

  // 零參數函數測試
  it('應該處理零參數函數', () => {
    const getAnswer = () => 42;
    const curriedGetAnswer = curryOptimized(getAnswer);

    expect(curriedGetAnswer()).toBe(42);
  });

  // 多參數函數測試
  it('應該正確柯里化三元函數', () => {
    const multiply = (a: number, b: number, c: number) => a * b * c;
    const curriedMultiply = curryOptimized(multiply);

    expect(curriedMultiply(2)(3)(4)).toBe(24);
  });
});
