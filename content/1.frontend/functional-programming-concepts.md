---
title: Functional Programming Concepts - Curry、Compose、Pipe
description: 探討函數式編程中的 Curry、Compose、Pipe 的實作與應用
date: 2025-02-19
icon: lucide:book-open-text
read: '15'
---

> 函數式編程（Functional Programming, FP）中，高階函數是核心概念之一。本文將探討三個重要的函數轉換技巧：Curry、Compose、Pipe，並著重分析它們在現代前端開發中的應用。

## 概念比較

| 概念 | 主要用途 | 執行順序 | 實際應用 |
|------|---------|----------|----------|
| Curry | 參數部分應用 | 依序傳入參數 | API 請求配置 |
| Compose | 函數組合 | 從右到左 | 數學運算、資料轉換 |
| Pipe | 資料流處理 | 從左到右 | 表單處理、API 資料流 |

## 實作與範例

### Curry (柯里化)

```typescript
type Curry<T extends (...args: any[]) => any> =
  T extends (arg: infer A, ...args: infer R) => infer O
    ? R extends []
      ? T
      : (arg: A) => Curry<(...args: R) => O>
    : never;

// 實際應用：API 請求配置
const fetchFromAPI = curry((baseURL: string, endpoint: string, id: string) =>
  fetch(`${baseURL}${endpoint}/${id}`)
);

const fetchFromMyAPI = fetchFromAPI('https://api.example.com');
const fetchUser = fetchFromMyAPI('/users');
```

### Compose 與 Pipe

| 特性 | Compose | Pipe |
|------|----------|------|
| 執行順序 | 從右到左 (f(g(x))) | 從左到右 (x → g → f) |
| 數學概念 | 符合數學函數組合 | 符合資料流處理 |
| 可讀性 | 需要從內到外閱讀 | 符合直覺閱讀順序 |
| 適用場景 | 數學運算、純函數組合 | 資料處理流程、事件處理 |

```typescript
// Compose 示例
const processData = compose(
  formatOutput, // 3. 格式化
  validateData, // 2. 驗證
  normalizeInput // 1. 標準化
);

// Pipe 示例
const processData = pipe(
  normalizeInput, // 1. 標準化
  validateData, // 2. 驗證
  formatOutput // 3. 格式化
);
```

## 工具結合

### 與 RxJS 的結合

```typescript
// 搜尋功能實作
const searchInput$ = fromEvent<InputEvent>(searchInput, 'input').pipe(
  map(event => (event.target as HTMLInputElement).value),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(async (term) => {
    const response = await fetch(`/api/search?q=${term}`);
    return response.json();
  })
);
```

### 常見應用場景

| 場景 | 推薦方案 | 原因 |
|------|----------|------|
| 表單處理 | Pipe + RxJS | 清晰的資料流、方便的異步處理 |
| API 資料處理 | Pipe | 直觀的轉換流程 |
| 配置管理 | Curry | 靈活的參數應用 |
| 數學計算 | Compose | 符合數學直覺 |

## 選擇方向

| 考量面向 | 建議選擇 | 說明 |
|----------|----------|------|
| 團隊經驗 | Pipe | 最直觀、容易理解 |
| 資料處理 | Pipe + RxJS | 強大的資料流處理能力 |
| 函數組合 | Compose | 符合 functional programming 的特性 |
| 配置管理 | Curry | 靈活的參數管理 |

## 總結

在日常開發中：

1. Pipe 因爲比較直觀所以比較常見一些
2. 結合 RxJS 能夠處理複雜的非同步資料流
3. Curry 和 Compose 在特定場景下也是有幫助，但需要謹慎使用，建議盡可能跟團隊有共識，避免過度使用，導致程式碼難以閱讀
