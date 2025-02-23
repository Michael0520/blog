---
title: Throttle and Debounce
description: Implement Throttle and Debounce Functions
date: 2025-02-24
read: '15'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  Throttle and Debounce Implementation

  #description
  難度：Easy

  #content
  ## 題目描述

  實作 throttle 和 debounce 函數，需要符合以下使用方式：

  ```typescript
  type Callback = (...args: any[]) => void;

  function throttle(callback: Callback, delay: number): Callback;
  function debounce(callback: Callback, delay: number): Callback;

  // 使用範例
  const throttledScroll = throttle(() => console.log('scroll'), 1000);
  const debouncedResize = debounce(() => console.log('resize'), 1000);

  window.addEventListener('scroll', throttledScroll);
  window.addEventListener('resize', debouncedResize);
  ```

  #footer
  :badge[Performance]
  ::
::

## 解題思路

### 1. 需求分析

這題要求我們實作兩個效能優化的函數：throttle（節流）和 debounce（防抖），用於處理高頻率事件。

1. **Throttle（節流）**
   - 在一定時間內，只執行一次函數
   - 適合處理持續性事件，例如視窗滾動

2. **Debounce（防抖）**
   - 在最後一次觸發後的一定時間才執行
   - 適合處理最終狀態，例如搜尋輸入

### 2. 實作步驟

首先是 Throttle 的實作：

::code-snippet
---
file: /interview/throttle/solution.ts
language: ts
title: throttle
---
::

接著是 Debounce 的實作：

::code-snippet
---
file: /interview/debounce/solution.ts
language: ts
title: debounce
---
::

## 使用範例

### 1. 滾動事件優化

```typescript
const handleScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 1000);

window.addEventListener('scroll', handleScroll);
```

### 2. 搜尋輸入優化

```typescript
const handleSearch = debounce(async (query: string) => {
  const results = await searchAPI(query);
  updateResults(results);
}, 500);

searchInput.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});
```

## 測試案例

::code-snippet
---
file: /interview/throttle/solution.test.ts
language: ts
title: throttle test
---
::

::code-snippet
---
file: /interview/debounce/solution.test.ts
language: ts
title: debounce test
---
::

## 注意事項

1. **使用場景**
   - Throttle：滾動、調整大小等持續性事件
   - Debounce：搜尋、表單驗證等最終狀態事件

2. **記憶體管理**
   - 記得清理計時器避免記憶體洩漏
