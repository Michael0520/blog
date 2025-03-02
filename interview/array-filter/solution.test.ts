import { describe, expect, it } from 'vitest';
import myFilter, { myFilterOptimized } from './solution';

describe('myFilter function', () => {
  // Test both implementations with the same test cases
  const implementations = [
    { name: 'myFilter', fn: myFilter },
    { name: 'myFilterOptimized', fn: myFilterOptimized },
  ];

  implementations.forEach(({ name, fn }) => {
    describe(`${name}`, () => {
      it('should filter elements based on the callback function', () => {
        const array = [1, 2, 3, 4, 5];
        const result = fn(array, num => num % 2 === 0);
        expect(result).toEqual([2, 4]);
      });

      it('should handle empty arrays', () => {
        const array: number[] = [];
        const result = fn(array, () => true);
        expect(result).toEqual([]);
      });

      it('should handle arrays with all elements passing the test', () => {
        const array = [2, 4, 6, 8];
        const result = fn(array, num => num % 2 === 0);
        expect(result).toEqual([2, 4, 6, 8]);
      });

      it('should handle arrays with no elements passing the test', () => {
        const array = [1, 3, 5, 7];
        const result = fn(array, num => num % 2 === 0);
        expect(result).toEqual([]);
      });

      it('should correctly pass index and array to callback', () => {
        const array = ['a', 'b', 'c'];
        const indices: number[] = [];
        const arrays: Array<string>[] = [];

        fn(array, (_, index, arr) => {
          indices.push(index);
          arrays.push(arr);
          return false;
        });

        expect(indices).toEqual([0, 1, 2]);
        expect(arrays).toEqual([array, array, array]);
      });

      it('should handle sparse arrays correctly', () => {
        // Create a sparse array
        const array: number[] = [];
        array[0] = 1;
        array[2] = 3;
        array[5] = 5;
        // array is now [1, empty, 3, empty, empty, 5]

        const result = fn(array, num => num > 2);
        expect(result).toEqual([3, 5]);
      });

      it('should respect thisArg parameter', () => {
        const array = [1, 2, 3, 4, 5];
        const context = { threshold: 3 };

        const result = fn(
          array,
          function (this: typeof context, num) {
            return num > this.threshold;
          },
          context,
        );

        expect(result).toEqual([4, 5]);
      });

      it('should throw TypeError if callbackFn is not a function', () => {
        const array = [1, 2, 3];
        // @ts-expect-error: Testing runtime type checking
        expect(() => fn(array, 'not a function')).toThrow(TypeError);
        // @ts-expect-error: Testing runtime type checking
        expect(() => fn(array, null)).toThrow(TypeError);
        // @ts-expect-error: Testing runtime type checking
        expect(() => fn(array, undefined)).toThrow(TypeError);
      });

      it('should handle arrays with different data types', () => {
        const array = ['apple', 'banana', 'cherry', 'date'];
        const result = fn(array, fruit => fruit.length > 5);
        expect(result).toEqual(['banana', 'cherry']);
      });

      it('should not modify the original array', () => {
        const array = [1, 2, 3, 4, 5];
        const originalArray = [...array];
        fn(array, num => num % 2 === 0);
        expect(array).toEqual(originalArray);
      });

      it('should behave the same as native Array.prototype.filter', () => {
        const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const nativeResult = array.filter(num => num % 3 === 0);
        const customResult = fn(array, num => num % 3 === 0);
        expect(customResult).toEqual(nativeResult);
      });
    });
  });
});
