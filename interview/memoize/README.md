# Question

```typescript
/*
let callCount = 0;
const memoizedFn = memoize(function (a, b) {
  callCount += 1;
  return a + b;
});
memoizedFn(2, 3); // 5
memoizedFn(2, 3); // 5
console.log(callCount); // 1

memoizedFn(1, -1); // 0
console.log(callCount); // 2
 */
// implement memoize function
type Fn = (...args: any[]) => any;
export default function memoize<T extends Fn>(fun: T): T {
  // TODO Please add your codes here
}
```
