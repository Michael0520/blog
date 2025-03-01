/**
 * 實作 Promise.all 函數
 * @param iterable - Promise 陣列
 * @returns 包含所有 Promise 結果的陣列
 */
export default function promiseAll<T>(iterable: Array<T | Promise<T>>): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    const results: T[] = Array.from({ length: iterable.length });
    let unresolved = iterable.length;

    // 處理空陣列的情況
    if (unresolved === 0) {
      resolve(results);
      return;
    }

    // 處理每個輸入值
    iterable.forEach((item, index) => {
      Promise.resolve(item)
        .then((value) => {
          results[index] = value;
          unresolved -= 1;

          // 當所有 Promise 都解析完成時，返回結果
          if (unresolved === 0) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}

/**
 * 效能優化版本
 */
export function promiseAllOptimized<T>(iterable: Array<T | Promise<T>>): Promise<T[]> {
  // 預先檢查輸入
  if (!Array.isArray(iterable)) {
    return Promise.reject(new TypeError('Input must be an array'));
  }

  const len = iterable.length;
  if (len === 0)
    return Promise.resolve<T[]>([]);

  // 使用 Map 追蹤狀態
  const results = new Map<number, T>();
  let completed = 0;

  return new Promise<T[]>((resolve, reject) => {
    iterable.forEach((item, index) => {
      Promise.resolve(item)
        .then((value) => {
          results.set(index, value);
          completed++;

          // 使用 Map.size 檢查完成狀態
          if (completed === len) {
            resolve(Array.from(results.values()));
          }
        })
        .catch(reject);
    });
  });
}
