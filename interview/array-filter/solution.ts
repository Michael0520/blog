/**
 * 實作 Array.prototype.filter 方法的獨立版本
 *
 * @param array - 要過濾的陣列
 * @param callbackFn - 用於測試陣列中每個元素的函數
 * @param thisArg - 執行 callbackFn 時使用的 this 值
 * @returns 通過測試的元素組成的新陣列
 */
export default function myFilter<T>(
  array: Array<T>,
  callbackFn: (value: T, index: number, array: Array<T>) => boolean,
  thisArg?: any,
): Array<T> {
  // 檢查 callbackFn 是否為函數
  if (typeof callbackFn !== 'function') {
    throw new TypeError(`${callbackFn} is not a function`);
  }

  const len = array.length;
  const results: Array<T> = [];

  // 遍歷陣列
  for (let k = 0; k < len; k++) {
    // 檢查索引是否存在（處理稀疏陣列）
    if (Object.hasOwn(array, k)) {
      const kValue = array[k];
      // 執行回調函數，如果返回 true，則將元素加入結果陣列
      if (callbackFn.call(thisArg, kValue, k, array)) {
        results.push(kValue);
      }
    }
  }

  return results;
}

/**
 * 效能優化版本的 myFilter 實作
 * 使用直接索引賦值代替 push 方法，可能在大型陣列上有更好的效能
 *
 * @param array - 要過濾的陣列
 * @param callbackFn - 用於測試陣列中每個元素的函數
 * @param thisArg - 執行 callbackFn 時使用的 this 值
 * @returns 通過測試的元素組成的新陣列
 */
export function myFilterOptimized<T>(
  array: Array<T>,
  callbackFn: (value: T, index: number, array: Array<T>) => boolean,
  thisArg?: any,
): Array<T> {
  // 檢查 callbackFn 是否為函數
  if (typeof callbackFn !== 'function') {
    throw new TypeError(`${callbackFn} is not a function`);
  }

  const len = array.length;
  const results: Array<T> = [];
  let resultIndex = 0;

  // 遍歷陣列
  for (let k = 0; k < len; k++) {
    // 使用 in 運算符檢查索引是否存在（處理稀疏陣列）
    if (k in array) {
      const kValue = array[k];
      // 執行回調函數，如果返回 true，則將元素加入結果陣列
      if (callbackFn.call(thisArg, kValue, k, array)) {
        results[resultIndex++] = kValue;
      }
    }
  }

  return results;
}
