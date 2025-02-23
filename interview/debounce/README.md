# Question

實作 debounce 函數，需要符合以下使用方式：

```typescript
type Callback = (...args: any[]) => void;

function debounce(callback: Callback, delay: number): Callback;

// 使用範例
const debouncedResize = debounce(() => console.log('resize'), 1000);
window.addEventListener('resize', debouncedResize);
```
