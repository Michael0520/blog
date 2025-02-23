# Question

實作 throttle 函數，需要符合以下使用方式：

```typescript
type Callback = (...args: any[]) => void;

function throttle(callback: Callback, delay: number): Callback;

// 使用範例
const throttledScroll = throttle(() => console.log('scroll'), 1000);
window.addEventListener('scroll', throttledScroll);
```
