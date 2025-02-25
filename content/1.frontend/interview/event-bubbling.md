---
title: Event Bubbling
description: Understanding Event Bubbling in DOM
date: 2025-02-25
read: '10'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  Event Bubbling Implementation

  #description
  難度：Easy

  #content
  ## 題目描述

  觀察以下程式碼，說明點擊 child 元素時的執行結果：

  ```typescript
  /*
  <div class="parent">
    <div class="child">child</div>
  </div>
  */

  const parent = document.querySelector('.parent');
  const child = document.querySelector('.child');

  function onParentClick() {
    console.log('parent click');
  }

  function onChildClick() {
    console.log('child click');
  }

  parent.addEventListener('click', onParentClick);
  child.addEventListener('click', onChildClick);
  ```

  #footer
  :badge[DOM]
  :badge[Event]
  ::
::

## 解題思路

### 1. 事件冒泡機制

當我們點擊 child 元素時，事件會依照 DOM 樹的結構向上傳遞：

1. 首先觸發 child 元素的點擊事件
2. 接著事件會「冒泡」到 parent 元素
3. 最後到達 document root

因此執行結果會是：
```bash
child click
parent click
```

### 2. 事件傳遞的三個階段

完整的事件傳遞包含三個階段：

1. **捕獲階段（Capturing Phase）**
   - 事件從 root 向下傳遞到目標元素
   - 預設不會觸發監聽器

2. **目標階段（Target Phase）**
   - 事件到達目標元素
   - 觸發元素上的事件處理器

3. **冒泡階段（Bubbling Phase）**
   - 事件從目標元素向上冒泡
   - 預設的事件觸發階段

### 3. 控制事件傳遞

我們可以通過以下方式控制事件傳遞：

```typescript
// 停止事件冒泡
function onChildClick(e: Event) {
  console.log('child click');
  e.stopPropagation();
}

// 在捕獲階段處理事件
parent.addEventListener('click', onParentClick, true);
```

## 使用範例

### 1. 基本事件冒泡

```typescript
const parent = document.querySelector('.parent');
const child = document.querySelector('.child');

parent.addEventListener('click', () => {
  console.log('parent');
});

child.addEventListener('click', () => {
  console.log('child');
});

// 點擊 child 時輸出：
// child
// parent
```

### 2. 停止事件冒泡

```typescript
const parent = document.querySelector('.parent');
const child = document.querySelector('.child');

parent.addEventListener('click', () => {
  console.log('parent');
});

child.addEventListener('click', (e) => {
  console.log('child');
  e.stopPropagation();
});

// 點擊 child 時輸出：
// child
```

## 測試案例

```typescript
describe('Event Bubbling', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="parent">
        <div class="child">child</div>
      </div>
    `;
  });

  it('should trigger both child and parent events', () => {
    const parent = document.querySelector('.parent');
    const child = document.querySelector('.child');
    const logs: string[] = [];

    parent?.addEventListener('click', () => {
      logs.push('parent');
    });

    child?.addEventListener('click', () => {
      logs.push('child');
    });

    child?.click();
    expect(logs).toEqual(['child', 'parent']);
  });

  it('should stop propagation', () => {
    const parent = document.querySelector('.parent');
    const child = document.querySelector('.child');
    const logs: string[] = [];

    parent?.addEventListener('click', () => {
      logs.push('parent');
    });

    child?.addEventListener('click', (e) => {
      logs.push('child');
      e.stopPropagation();
    });

    child?.click();
    expect(logs).toEqual(['child']);
  });
});
```

## 注意事項

1. **事件順序**
   - 冒泡是預設行為
   - 從內到外傳遞
   - 可以被停止

2. **效能考量**
   - 避免過多事件監聽
   - 考慮使用事件代理
   - 適時移除監聽器

3. **瀏覽器支援**
   - 所有現代瀏覽器都支援
   - IE8+ 支援標準事件模型
