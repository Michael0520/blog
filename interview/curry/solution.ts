/**
 * 將多參數函數轉換為柯里化函數
 * 柯里化後的函數每次只接受一個參數，直到收集到足夠的參數才執行原始函數
 */

// 定義柯里化後的函數型別
type Curry<P extends any[], R> =
  P extends []
    ? () => R
    : P extends [infer First, ...infer Rest]
      ? (arg: First) => Curry<Rest, R>
      : never;

/**
 * 將多參數函數轉換為柯里化函數
 * @param fn - 原始函數
 * @returns 柯里化後的函數，每次只接受一個參數
 *
 * @example
 * function add(a, b) { return a + b; }
 * const curriedAdd = curry(add);
 * curriedAdd(3)(4); // 7
 */
export function curry<P extends any[], R>(fn: (...args: P) => R): Curry<P, R> {
  // 特殊處理：如果原始函數不需要參數，直接返回一個調用它的函數
  if (fn.length === 0) {
    return function curried() {
      return fn(...([] as unknown as P));
    } as Curry<P, R>;
  }

  function curried(this: { args?: any[] } | undefined, arg: any): any {
    // 驗證參數：確保每次只接受一個參數
    if (arguments.length !== 1) {
      throw new Error('Each function must take exactly one argument');
    }

    // 收集參數：使用 this 儲存之前的參數，並添加新的參數
    const args = this?.args ? [...this.args, arg] : [arg];

    // 檢查參數數量：如果參數足夠，執行原始函數；否則返回新函數
    return args.length >= fn.length
      ? fn(...args as P)
      : curried.bind({ args });
  }

  // 保留原始函數資訊
  Object.defineProperties(curried, {
    length: { value: 1 },
    name: { value: `curried ${fn.name}` },
  });

  return curried as Curry<P, R>;
}

/**
 * 優化版本：使用 WeakMap 來管理參數，減少記憶體使用
 */
export function curryOptimized<P extends any[], R>(fn: (...args: P) => R): Curry<P, R> {
  // 特殊處理：如果原始函數不需要參數，直接返回一個調用它的函數
  if (fn.length === 0) {
    return function curried() {
      return fn(...([] as unknown as P));
    } as Curry<P, R>;
  }

  // 使用 WeakMap 儲存參數，避免記憶體洩漏
  const argsMap = new WeakMap<object, any[]>();
  const rootContext = Object.create(null);

  function curried(this: object | undefined, arg: any): any {
    // 驗證參數
    if (arguments.length !== 1) {
      throw new Error('Each function must take exactly one argument');
    }

    // 獲取當前上下文和之前的參數
    const context = this || rootContext;
    const prevArgs = argsMap.get(context) || [];
    const allArgs = [...prevArgs, arg];

    // 檢查參數數量
    if (allArgs.length >= fn.length) {
      // 參數足夠：執行原始函數
      return fn(...allArgs as P);
    }

    // 參數不足：創建新函數
    const next = function (nextArg: any) {
      const nextContext = Object.create(null);
      argsMap.set(nextContext, allArgs);
      return curried.call(nextContext, nextArg);
    };

    return next;
  }

  // 保留原始函數資訊
  Object.defineProperties(curried, {
    length: { value: 1 },
    name: { value: `curried ${fn.name}` },
  });

  return curried as Curry<P, R>;
}
