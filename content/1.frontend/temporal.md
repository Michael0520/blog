---
title: JavaScript 原生時間日期處理庫 - Temporal
description: 介紹 Temporal 的時間日期處理
date: 2025-02-06
icon: 'fa6-solid:toolbox'
read: '15'
---

![temporal](https://developer.mozilla.org/en-US/blog/javascript-temporal-is-coming/featured.png)

## Introduction

**Temporal** 是 JavaScript 中即將推出的原生日期和時間處理 API（目前處於 Stage 3 提案階段），主要要解決現有 `Date` API 的多項不足，它提供了更強大、更精確且更易於使用的功能，使開發者能夠更有效地處理日期和時間相關的操作。

**主要特點包括：**

- **不可變性**：所有操作都會返回新物件，防止意外的資料修改
- **高精度**：支援奈秒級別的時間精度，超越了 `Date` 的毫秒級別
- **時區支援**：內建強大的時區處理能力，支援所有 IANA 時區
- **豐富的功能**：支援更複雜的日期和時間運算，如日曆計算、重複事件等
- **嚴格的字串格式**：提供統一的解析和格式化標準
- **支援非公曆系統**：內建多日曆系統支援

**安裝（僅適用於支援的環境）**：

```bash
npm install @js-temporal/polyfill
```

::alert{type="warning" icon="lucide:triangle-alert"}
  Temporal 尚未被所有瀏覽器和 Node.js 版本原生支援，目前仍處於實驗階段，建議在使用前引入 polyfill
::

## 與熱門的 dayjs & moment 的差異

`dayjs` 和 `moment` 是目前 JavaScript 中非常流行的日期處理庫，但它們也存在一些限制和問題。以下是 Temporal 相較於這兩者的主要差異：

| 特性            | Temporal                            | dayjs & moment                     |
|-----------------|-------------------------------------|------------------------------------|
| **原生支援**    | 是（即將成為標準的一部分）              | 否，需要額外安裝庫                    |
| **不可變性**    | 所有物件不可變，防止副作用               | `moment` 物件可變，`dayjs` 不可變   |
| **時間精度**    | 支援奈秒級別                           | 毫秒級別                             |
| **時區處理**    | 原生支援 IANA 時區，操作更簡便            | 需要額外外掛或手動處理時區           |
| **效能**        | 更優化的效能表現                         | `moment` 有效能瓶頸，`dayjs` 輕量化 |
| **API 設計**     | 現代化、清晰且一致的 API 設計             | `moment` API 複雜，`dayjs` 簡潔但功能有限 |
| **型別支援**    | 完整的 TypeScript 支援                   | 需要額外的型別定義                    |

## 核心概念

Temporal 提供了多個專門的類別來處理不同的時間日期場景，每個類別都有其特定的用途和優勢：

::field-group
  ::field{name="Temporal.Now.instant()" type="Temporal.Instant"}
  返回當前時間的 Instant 物件，用於精確時間點的表示
  ::
  ::field{name="Temporal.Now.zonedDateTimeISO()" type="Temporal.ZonedDateTime"}
  返回當前時間的 ZonedDateTime 物件，適合處理帶時區的日期時間
  ::
  ::field{name="Temporal.Now.plainDateISO()" type="Temporal.PlainDate"}
  返回當前日期的 PlainDate 物件
  ::
  ::field{name="Temporal.Now.plainTimeISO()" type="Temporal.PlainTime"}
  返回當前時間的 PlainTime 物件
  ::
  ::field{name="Temporal.PlainDateTime.from()" type="Temporal.PlainDateTime"}
  返回包含日期和時間的 PlainDateTime 物件
  ::
  ::field{name="Temporal.PlainYearMonth.from()" type="Temporal.PlainYearMonth"}
  返回包含年月的 PlainYearMonth 物件
  ::
  ::field{name="Temporal.PlainMonthDay.from()" type="Temporal.PlainMonthDay"}
  返回包含月日的 PlainMonthDay 物件
  ::
  ::field{name="Temporal.Duration.from()" type="Temporal.Duration"}
  返回表示時間長度的 Duration 物件
  ::
::

## 基礎用法

在開始使用 Temporal 之前，我們需要先引入相關依賴，並了解基本的操作方式：

### 引入 Temporal（使用 polyfill）

```javascript
// 在支援的環境中可以直接使用 Temporal，否則需要引入 polyfill
import { Temporal } from '@js-temporal/polyfill';

// 或者在全域範圍內引入 polyfill
require('@js-temporal/polyfill');
```

### 建立日期和時間物件

```javascript
// 得到當前時間的不同表示方式
const instant = Temporal.Now.instant();
const zonedDateTime = Temporal.Now.zonedDateTimeISO();
const plainDate = Temporal.Now.plainDateISO();

// 建立具體的日期時間
const date = Temporal.PlainDate.from('2024-02-02');

// 建立帶時區的日期時間
const tokyo = Temporal.ZonedDateTime.from({
  timeZone: 'Asia/Tokyo',
  year: 2024,
  month: 2,
  day: 2,
  hour: 12
});
```

### 時間運算

```javascript
// 日期運算
const tomorrow = date.add({ days: 1 });
const nextWeek = date.add({ weeks: 1 });
const lastMonth = date.subtract({ months: 1 });

// 時區轉換
const taipeiTime = tokyo.withTimeZone('Asia/Taipei');

// 計算時間差
const start = Temporal.PlainDate.from('2024-02-01');
const end = Temporal.PlainDate.from('2024-03-01');
const diff = end.since(start);
console.log(diff.days); // 直接獲得天數
console.log(diff.hours); // 直接獲得小時數
```

## 使用 Hook 包裝 Temporal + TypeScript 加強可讀性

在 React 專案中，結合 Temporal 和 TypeScript 可以提升日期時間操作的可讀性和可維護性。以下示範如何創建一個自定義 Hook，封裝 Temporal 的功能。

### 安裝依賴

首先，確保安裝了 `@js-temporal/polyfill` 和 TypeScript。

```bash
npm install @js-temporal/polyfill
npm install --save-dev typescript
```

### 建立倒數計時 Hook

```typescript
// hooks/useCountdown.ts

// 舊方式 (使用 Date)
function useTraditionalCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      // 複雜的時間換算
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (difference < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

// 使用 Temporal 的新方式
function useTemporalCountdown(targetDate: string) {
  const [duration, setDuration] = useState<Temporal.Duration>(
    Temporal.Duration.from({ seconds: 0 })
  );

  useEffect(() => {
    const target = Temporal.PlainDateTime.from(targetDate);

    const timer = setInterval(() => {
      const now = Temporal.Now.plainDateTimeISO();
      const diff = target.since(now);

      if (diff.sign === -1) {
        clearInterval(timer);
        setDuration(Temporal.Duration.from({ seconds: 0 }));
        return;
      }

      setDuration(diff);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return {
    days: duration.days,
    hours: duration.hours,
    minutes: duration.minutes,
    seconds: duration.seconds
  };
}
```

### 在元件中使用倒數計時 Hook

```tsx
// components/CountdownDisplay.tsx
const CountdownDisplay: React.FC = () => {
  // 設定目標時間為 2024 年底
  const { days, hours, minutes, seconds } = useTemporalCountdown('2024-12-31T23:59:59');

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold">距離 2024 年結束還有：</h2>
      <div className="mt-4 flex justify-center gap-4">
        <div>
          <span className="text-3xl">{days}</span>
          <p>天</p>
        </div>
        <div>
          <span className="text-3xl">{hours}</span>
          <p>時</p>
        </div>
        <div>
          <span className="text-3xl">{minutes}</span>
          <p>分</p>
        </div>
        <div>
          <span className="text-3xl">{seconds}</span>
          <p>秒</p>
        </div>
      </div>
    </div>
  );
};
```

### 說明

1. **Hook (`useCountdown`)**：
    - **參數**：目標時間的 ISO 格式字串，可以根據團隊喜好去客製化期望的格式
    - **狀態**：包含倒數計時的 `Temporal.Duration`
    - **效果**：使用 `setInterval` 每秒更新一次狀態，確保倒數計時實時刷新
    - **回傳值**：返回當前的倒數計時狀態

## 總結

Temporal 作為下一代的日期時間處理標準，提供了更直覺的 API 設計、更安全的不可變特性、更完整的時區支援、更精確的時間處理和更好的型別支援，雖然目前仍處於提案階段，但其設計和功能都非常完善，值得開始學習和嘗試使用，隨著它逐漸成為 JavaScript 標準的一部分，掌握 Temporal 將有助於在未來的開發中更高效地處理日期和時間相關的需求。

:read-more{title="Temporal 官方文件" to="https://tc39.es/proposal-temporal/docs/"}
