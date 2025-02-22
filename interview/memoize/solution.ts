type Fn = (...args: any[]) => any;
export default function memoize<T extends Fn>(fun: T): T {
  // 步驟 1: 快取設置
  const cache = new Map<string, any>();

  // 步驟 2: 建立快取鍵生成函數
  function getCacheKey(...args: any[]): string {
    return JSON.stringify(args);
  }

  // 步驟 3: 記憶化實現
  return function (this: any, ...args: any[]) {
    const key = getCacheKey(...args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fun.apply(this, args);
    cache.set(key, result);
    return result;
  } as T;
}
