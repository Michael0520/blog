---
title: Retry Promise
description: In this blog I will share a solution to the Retry Promise interview problem.
date: 2025-02-18
read: '10'
---

> 在前端面試中，重試機制是一個常見的考題。這個題目考察了對 Promise、遞迴和錯誤處理的理解。

## 題目分析

### 需求說明

實作一個重試機制，當異步操作失敗時，可以自動重試指定次數

### 函式 Promise

```typescript
function retry<T>(
  foo: () => Promise<T>,
  maxRetryCount: number
): Promise<T>;
```

### 預期行為

```typescript
// 使用範例
retry(() => fetch('https://api.example.com/data'), 3)
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## 解題思路

讓我們一步一步實作這個重試機制：

```typescript
/**
 * 解題步驟：
 * 1. 建立重試函式
 * 2. 實作遞迴邏輯
 * 3. 處理錯誤情況
 * 4. 回傳 Promise
 */

// 步驟 1: 定義重試函式
function retry<T>(
  foo: () => Promise<T>,
  maxRetryCount: number
): Promise<T> {
  // 步驟 2: 實作遞迴邏輯
  return new Promise((resolve, reject) => {
    // 定義重試邏輯
    function retryAttempt(attemptsLeft: number) {
      // 執行異步操作
      foo()
        .then(resolve) // 成功則直接回傳結果
        .catch((error) => {
          // 檢查是否還有重試次數
          if (attemptsLeft <= 0) {
            reject(error); // 沒有重試次數就拋出錯誤
            return;
          }

          // 遞迴呼叫，次數減一
          retryAttempt(attemptsLeft - 1);
        });
    }

    // 開始第一次嘗試
    retryAttempt(maxRetryCount);
  });
}
```

## Fetch + Hook 版本

在日常開發上，我們可以包裝成一個常用的 Hook：

```typescript
interface UseFetchRetryProps<T> {
  url: string;
  options?: RequestInit;
  maxRetries?: number;
}

function useFetchRetry<T>({
  url,
  options,
  maxRetries = 3
}: UseFetchRetryProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const retryCountRef = useRef(0);

  const fetchWithRetry = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await retry(
        () => fetch(url, options),
        maxRetries
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
      retryCountRef.current = 0;
    }
  }, [url, options, maxRetries]);

  return {
    data,
    error,
    loading,
    retryCount: retryCountRef.current,
    fetch: fetchWithRetry
  };
}
```

### 使用範例

```tsx
interface UserData {
  id: number;
  name: string;
}

function UserProfile() {
  const { data, error, loading, fetch } = useFetchRetry<UserData>({
    url: '/api/user',
    maxRetries: 3
  });

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (loading)
    return <div>載入中...</div>;

  if (error) {
    return (
      <div>
        <div>
          錯誤:
          {error.message}
        </div>
        <button onClick={fetch}>重試</button>
      </div>
    );
  }

  return data
    ? (
        <div>
          <h1>{data.name}</h1>
          <p>
            ID:
            {data.id}
          </p>
        </div>
      )
    : null;
}
```

## 實作重點

1. **Promise 處理**
   - 使用 Promise 包裝重試邏輯
   - 正確處理成功和失敗的情況

2. **遞迴控制**
   - 使用遞迴實現重試機制
   - 自定義重試次數，避免無限重試

3. **狀態管理**
   - 完整的載入狀態處理
   - 完整的錯誤狀態管理
   - 資料狀態的同步更新
