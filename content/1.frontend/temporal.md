---
title: 原生時間日期處理庫 - Temporal
description: 介紹 Temporal 的時間日期處理
date: 2025-02-02
icon: 'fa6-solid:toolbox'
---

## Introduction

**Temporal** 是 JavaScript 中即將推出的原生日期和時間處理 API，旨在解決現有 `Date` API 的多項不足。它提供了更強大、更精確且更易於使用的功能，使開發者能夠更有效地處理日期和時間相關的操作。

**主要特點包括：**
- **不可變性**：Temporal 的所有對象都是不可變的，這有助於防止意外的數據修改。
- **高精度**：支持納秒級別的時間精度，超越了 `Date` 的毫秒級別。
- **時區支持**：內建強大的時區處理能力，簡化跨時區操作。
- **豐富的功能**：支持更複雜的日期和時間運算，如日曆計算、重複事件等。

**安裝（僅適用於支持的環境）**：
```bash
npm install @js-temporal/polyfill
```
> 注意：Temporal 尚未被所有瀏覽器和 Node.js 版本原生支持，因此在使用前建議引入 polyfill。

## 與熱門的 dayjs & moment 的差異

`dayjs` 和 `moment` 是目前 JavaScript 中非常流行的日期處理庫，但它們也存在一些限制和問題。以下是 Temporal 相較於這兩者的主要差異：

| 特性            | Temporal                            | dayjs & moment                     |
|-----------------|-------------------------------------|------------------------------------|
| **原生支持**    | 是（即將成為標準的一部分）              | 否，需要額外安裝庫                    |
| **不可變性**    | 所有對象不可變，防止副作用               | `moment` 對象可變，`dayjs` 不可變   |
| **時間精度**    | 支持納秒級別                           | 毫秒級別                             |
| **時區處理**    | 原生支持 IANA 時區，操作更簡便            | 需要額外插件或手動處理時區           |
| **性能**        | 更優化的性能表現                         | `moment` 有性能瓶頸，`dayjs` 輕量化 |
| **API 設計**     | 現代化、清晰且一致的 API 設計             | `moment` API 複雜，`dayjs` 簡潔但功能有限 |

**總結：**
- **Temporal** 提供了更現代化和強大的日期時間處理解決方案，易於學習和使用，並解決了現有庫的一些核心問題。
- **dayjs** 作為輕量級替代品，適合需要簡單功能且注重性能的場景。
- **moment** 雖然功能豐富，但因其體積和性能問題，逐漸被其他庫取代。

## 基礎用法

### 引入 Temporal（使用 polyfill）

```javascript
// 在支持的環境中可以直接使用 Temporal，否則需要引入 polyfill
import { Temporal } from '@js-temporal/polyfill';

// 或者在全局範圍內引入 polyfill
require('@js-temporal/polyfill');
```

### 創建日期和時間對象

```javascript
// 創建當前日期和時間
const now = Temporal.Now.instant();
console.log(now.toString()); // 例如：2023-04-16T12:34:56.789123456Z

// 創建具體的日期
const date = Temporal.PlainDate.from('2023-04-16');
console.log(date.toString()); // 2023-04-16

// 創建具體的日期時間
const dateTime = Temporal.PlainDateTime.from('2023-04-16T12:34');
console.log(dateTime.toString()); // 2023-04-16T12:34
```

### 時間運算

```javascript
// 加上 1 天
const tomorrow = date.add({ days: 1 });
console.log(tomorrow.toString()); // 2023-04-17

// 減去 2 小時
const earlier = dateTime.subtract({ hours: 2 });
console.log(earlier.toString()); // 2023-04-16T10:34
```

### 比較日期

```javascript
if (date.equals(tomorrow.subtract({ days: 1 }))) {
  console.log('日期相等');
} else {
  console.log('日期不相等');
}
```

### 處理時區

```javascript
// 創建帶有時區的日期時間
const zonedDateTime = Temporal.ZonedDateTime.from('2023-04-16T12:34:56+09:00[Asia/Tokyo]');
console.log(zonedDateTime.toString()); // 2023-04-16T12:34:56+09:00[Asia/Tokyo]

// 轉換時區
const utcDateTime = zonedDateTime.toZonedDateTimeISO('UTC');
console.log(utcDateTime.toString()); // 2023-04-16T03:34:56Z[UTC]
```

## 使用 Hook 包裝 Temporal + TypeScript 加強可讀性

在 React 專案中，結合 Temporal 和 TypeScript 可以提升日期時間操作的可讀性和可維護性。以下示範如何創建一個自定義 Hook，封裝 Temporal 的功能。

### 安裝依賴

首先，確保安裝了 `@js-temporal/polyfill` 和 TypeScript。

```bash
npm install @js-temporal/polyfill
npm install --save-dev typescript
```

### 創建 Temporal Hook

```typescript
import { Temporal } from '@js-temporal/polyfill';
// hooks/useTemporal.ts
import { useEffect, useState } from 'react';

interface TemporalState {
  now: Temporal.Instant;
  zonedDateTime: Temporal.ZonedDateTime;
}

function useTemporal(timeZone: string = 'UTC'): TemporalState {
  const [state, setState] = useState<TemporalState>({
    now: Temporal.Now.instant(),
    zonedDateTime: Temporal.Now.zonedDateTimeISO(timeZone),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setState({
        now: Temporal.Now.instant(),
        zonedDateTime: Temporal.Now.zonedDateTimeISO(timeZone),
      });
    }, 1000); // 每秒更新一次

    return () => clearInterval(interval);
  }, [timeZone]);

  return state;
}

export default useTemporal;
```

### 在組件中使用 Hook

```tsx
// components/DateTimeDisplay.tsx
import React from 'react';
import useTemporal from '../hooks/useTemporal';

const DateTimeDisplay: React.FC = () => {
  const { now, zonedDateTime } = useTemporal('Asia/Taipei');

  return (
    <div>
      <p>
        現在時間 (Instant):
        {now.toString()}
      </p>
      <p>
        當地時間 (ZonedDateTime):
        {zonedDateTime.toString()}
      </p>
    </div>
  );
};

export default DateTimeDisplay;
```

### 說明

1. **Hook 的創建 (`useTemporal`)**：
    - **參數**：可選的時區字符串，預設為 `'UTC'`。
    - **狀態**：包含當前的 `Temporal.Instant` 和 `Temporal.ZonedDateTime`。
    - **效果**：使用 `setInterval` 每秒更新一次狀態，確保時間實時刷新。
    - **回傳值**：返回當前的 `now` 和 `zonedDateTime` 對象。

2. **組件的使用 (`DateTimeDisplay`)**：
    - 調用 `useTemporal` 並傳入所需的時區，例如 `'Asia/Taipei'`。
    - 顯示當前的 `Instant` 和具體時區的 `ZonedDateTime`。

### 增強可讀性與可維護性

- **TypeScript** 提供了類型檢查，確保 Temporal 對象的正確使用，減少錯誤。
- **自定義 Hook** 封裝了 Temporal 的邏輯，使組件更加專注於 UI 展示。
- **時區參數化** 使 Hook 更加靈活，可在不同場景下重用。

## 總結

Temporal 提供了一個現代化、強大且易於使用的日期和時間處理方案，解決了現有 `Date` API 和其他第三方庫的一些核心問題，可以再包裝成 React Hook 來使用，來提升可讀性和可維護性

隨著 Temporal 成為 JavaScript 標準的一部分，學會它將有助於在未來的開發中更高效地處理日期和時間相關的需求，並且僅僅用著少量的程式碼
[1] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal
