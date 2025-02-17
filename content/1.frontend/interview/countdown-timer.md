---
title: Countdown Timer
description: In this blog I will share a solution to the Countdown Timer interview problem.
icon: 'fa6-solid:toolbox'
date: 2025-02-17
read: '15'
---

> 在前端面試中，倒數計時器是一個看似簡單但實際上涵蓋了許多重要概念的考題。從基本的 JavaScript 時間處理，到 React Hooks 的使用，再到效能優化，都是這個題目的重點。

## 題目分析

### 核心需求

1. **時間區間過濾**
   - 檢查當前時間是否在有效期間內
   - 處理時區問題

2. **路徑匹配**
   - 支援全站顯示 (`*`)
   - 支援特定路徑匹配

3. **時間格式化**
   - DD:HH:mm:ss 格式
   - 補零處理

### API 規格

```typescript
interface CountdownData {
  start_date: string; // 開始時間，ISO 格式
  end_date: string; // 結束時間，ISO 格式
  available_path: string[]; // 可顯示的路徑，"*" 表示全站
}

// API 回傳範例
const data = [
  {
    start_date: '2024-01-01T00:00:00.000Z',
    end_date: '2024-12-31T23:59:59.999Z',
    available_path: ['*']
  },
  {
    start_date: '2024-02-01T00:00:00.000Z',
    end_date: '2024-02-28T23:59:59.999Z',
    available_path: ['/campaign', '/special']
  }
];
```

## 解題思路

讓我們一步一步解決這個問題：

```tsx
/**
 * 解題步驟：
 * 1. 定義資料介面
 * 2. 實作時間驗證
 * 3. 實作路徑匹配
 * 4. 實作倒數計時
 * 5. 處理錯誤情況
 */

// 步驟 1: 定義資料介面
interface CountdownData {
  start_date: string;
  end_date: string;
  available_path: string[];
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// 步驟 2: 時間驗證
function isValidTime(item: CountdownData): boolean {
  const now = new Date().getTime();
  const startDate = new Date(item.start_date).getTime();
  const endDate = new Date(item.end_date).getTime();

  return now >= startDate && now <= endDate;
}

// 步驟 3: 路徑匹配
function isValidPath(item: CountdownData): boolean {
  const currentPath = window.location.pathname;
  const normalizedPath = currentPath.replace(/\/$/, '');

  return item.available_path.includes('*')
    || item.available_path.some(path =>
      path.replace(/\/$/, '') === normalizedPath
    );
}

// 步驟 4: 倒數計時邏輯
function calculateTimeLeft(endDate: string): TimeLeft {
  const diff = new Date(endDate).getTime() - new Date().getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  };
}

// 步驟 5: 主要組件
function Countdown({ data }: { data: CountdownData[] }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // 錯誤處理
  function handleError(message: string) {
    setError(message);
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  }

  // 驗證資料格式
  function validateData(data: unknown): data is CountdownData[] {
    if (!data || !Array.isArray(data)) {
      throw new Error('無效的資料格式');
    }
    return true;
  }

  // 尋找有效的倒數時間資料
  function findValidCountdown(data: CountdownData[]): CountdownData | undefined {
    return data.find(item => isValidTime(item) && isValidPath(item));
  }

  // 設定計時器
  function setupTimer(validData: CountdownData) {
    function updateTimer() {
      setTimeLeft(calculateTimeLeft(validData.end_date));
    }

    updateTimer(); // 立即執行一次
    timerRef.current = setInterval(updateTimer, 1000);

    // 返回清理函數
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }

  useEffect(() => {
    try {
      // 1. 驗證資料格式
      if (!validateData(data))
        return;

      // 2. 尋找有效資料
      const validData = findValidCountdown(data);
      if (!validData) {
        handleError('找不到有效的倒數時間');
        return;
      }

      // 3. 設定計時器
      return setupTimer(validData);
    } catch (e) {
      handleError('倒數計時器初始化失敗');
    }
  }, [data]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex gap-4">
      <TimeUnit value={timeLeft.days} unit="天" />
      <TimeUnit value={timeLeft.hours} unit="時" />
      <TimeUnit value={timeLeft.minutes} unit="分" />
      <TimeUnit value={timeLeft.seconds} unit="秒" />
    </div>
  );
}

// 格式化顯示組件
function TimeUnit({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xl font-bold">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-sm text-gray-500">{unit}</span>
    </div>
  );
}
```

## 總結重點們

1. **時間處理**
   - 使用 timestamp 比較避免時區問題
   - 統一使用 UTC 時間

2. **效能考慮**
   - 使用 useRef 管理計時器
   - 適當的清理機制

3. **錯誤處理**
   - 資料格式驗證
   - 邊界情況處理
