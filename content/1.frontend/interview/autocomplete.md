---
title: Autocomplete 系統設計
description: A comprehensive guide to designing a modern autocomplete component with React and TypeScript
date: 2025-03-09
read: '20'
---

# Autocomplete 系統設計指南

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:search
  icon-size: 26
  ---
  #title
  設計現代化的自動完成元件

  #description
  難度：Hard

  #content
  目標：實作一個高效能、可擴展的自動完成元件，適用於各種應用場景

  #footer
  :badge[React]
  :badge[TypeScript]
  :badge[System Design]
  :badge[Performance]
  ::
::

## 1. 系統概述

### 1.1 設計目標

自動完成（Autocomplete）元件是現代網頁應用中不可或缺的部分，它能夠：

1. **提升使用者體驗**
   - 減少使用者輸入時間
   - 提供即時搜尋建議
   - 支援鍵盤導航

2. **優化系統效能**
   - 透過快取減少請求
   - 防抖處理避免過度請求
   - 虛擬捲動處理大量數據

## 2. 系統架構

### 2.1 核心元件

```typescript
interface AutocompleteProps<T> {
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (item: T) => void;

  fetchSuggestions: (query: string) => Promise<T[]>;
  debounceTime?: number;
  minQueryLength?: number;

  cacheTime?: number;
  maxCacheSize?: number;

  renderItem?: (item: T) => React.ReactNode;
  renderInput?: (props: InputProps) => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  renderError?: (error: Error) => React.ReactNode;

  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

### 2.2 架構設計

```bash
┌─────────────────────────────────────────────┐
│                  View Layer                 │
│  ┌─────────────┐ ┌──────────┐ ┌─────────┐  │
│  │    Input    │ │ Results  │ │ Loading │  │
│  │  Component  │ │   List   │ │  State  │  │
│  └─────────────┘ └──────────┘ └─────────┘  │
└───────────────────────┬─────────────────────┘
                        │
┌───────────────────────▼─────────────────────┐
│               Controller Layer               │
│   ┌────────────────┐  ┌─────────────────┐   │
│   │      State     │  │      Event      │   │
│   │   Management   │  │    Handlers     │   │
│   └────────────────┘  └─────────────────┘   │
└───────────────────────┬─────────────────────┘
                        │
┌───────────────────────▼─────────────────────┐
│               Service Layer                  │
│   ┌────────────────┐  ┌─────────────────┐   │
│   │      Cache     │  │     Network     │   │
│   │    Service     │  │     Service     │   │
│   └────────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────┘
```

## 3. 核心功能實作

### 3.1 基礎元件

```tsx
function Autocomplete<T>({
  value,
  onChange,
  onSelect,
  fetchSuggestions,
  debounceTime = 300,
  minQueryLength = 1,
  ...props
}: AutocompleteProps<T>) {
  // 狀態管理
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 快取系統
  const cache = useCache<T>({
    maxSize: props.maxCacheSize || 100,
    cacheTime: props.cacheTime || 5 * 60 * 1000
  });

  // 防抖搜尋
  const debouncedSearch = useDebounce(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < minQueryLength) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 檢查快取
      const cachedResults = cache.get(searchQuery);
      if (cachedResults) {
        setSuggestions(cachedResults);
        setIsLoading(false);
        return;
      }

      // 發送請求
      const results = await fetchSuggestions(searchQuery);
      cache.set(searchQuery, results);
      setSuggestions(results);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, debounceTime);

  return (
    <div
      className="relative w-full"
      role="combobox"
      aria-expanded={suggestions.length > 0}
      aria-haspopup="listbox"
    >
      {/* 輸入框 */}
      <input
        type="text"
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          onChange?.(value);
          debouncedSearch(value);
        }}
        className="w-full rounded-lg border px-4 py-2 focus:ring-2"
        aria-label={props.ariaLabel}
        aria-describedby={props.ariaDescribedBy}
        aria-controls="suggestions-list"
      />

      {/* 建議列表 */}
      {(suggestions.length > 0 || isLoading || error) && (
        <div
          id="suggestions-list"
          className="absolute mt-1 w-full rounded-lg border bg-white shadow-lg"
        >
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-red-500">
              {error.message}
            </div>
          )}

          {!isLoading && !error && (
            <ul className="py-2" role="listbox">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  role="option"
                  className="cursor-pointer px-4 py-2 hover:bg-gray-50"
                  onClick={() => onSelect?.(item)}
                >
                  {props.renderItem?.(item) || JSON.stringify(item)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
```

### 3.2 效能優化

::alert{title="優化重點" type="warning"}
1. **快取系統**：減少不必要的網路請求
2. **防抖處理**：避免頻繁觸發搜尋
3. **虛擬捲動**：處理大量搜尋結果
::

#### 快取實作

```typescript
interface CacheOptions {
  maxSize?: number;
  cacheTime?: number;
}

function useCache<T>({
  maxSize = 100,
  cacheTime = 5 * 60 * 1000
}: CacheOptions = {}) {
  const cache = useRef(new Map<string, {
    data: T[];
    timestamp: number;
  }>());

  const get = useCallback((key: string) => {
    const item = cache.current.get(key);
    if (!item)
      return null;

    if (Date.now() - item.timestamp > cacheTime) {
      cache.current.delete(key);
      return null;
    }

    return item.data;
  }, [cacheTime]);

  const set = useCallback((key: string, data: T[]) => {
    if (cache.current.size >= maxSize) {
      const oldestKey = cache.current.keys().next().value;
      cache.current.delete(oldestKey);
    }

    cache.current.set(key, {
      data,
      timestamp: Date.now()
    });
  }, [maxSize]);

  return { get, set };
}
```

## 4. 實際應用範例

### 4.1 YouTube 搜尋

```tsx
interface VideoResult {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  duration: string;
  channelName: string;
}

function YouTubeSearch() {
  const fetchSuggestions = async (query: string): Promise<VideoResult[]> => {
    const response = await fetch(`/api/search?q=${query}`);
    if (!response.ok) {
      throw new Error('搜尋失敗');
    }
    return response.json();
  };

  const renderVideo = (video: VideoResult) => (
    <div className="flex gap-3 p-2">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="h-20 w-36 rounded object-cover"
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium">{video.title}</h3>
        <p className="truncate text-sm text-gray-500">{video.channelName}</p>
        <div className="mt-1 text-sm text-gray-500">
          {video.views}
          {' '}
          •
          {video.duration}
        </div>
      </div>
    </div>
  );

  return (
    <Autocomplete<VideoResult>
      fetchSuggestions={fetchSuggestions}
      renderItem={renderVideo}
      debounceTime={300}
      minQueryLength={2}
      cacheTime={5 * 60 * 1000}
      ariaLabel="搜尋影片"
    />
  );
}
```

## 5. 延伸議題

### 延伸功能

可以再延伸出以下常見的功能：

1. **智能搜尋**
   - 模糊搜尋支援
   - 拼寫錯誤修正
   - AI 驅動的搜尋建議

2. **效能優化**
   - 預測性快取
   - WebWorker 支援
   - 智能請求批處理

3. **使用者體驗**
   - 多語言支援
   - 深色模式
   - 更豐富的鍵盤快捷鍵

### 延伸問題

也可能被問到以下常見問題：

1. **如何處理大量數據？**
   - 使用虛擬捲動
   - 實作分頁加載
   - 優化渲染效能

2. **如何確保快取效率？**
   - 設定合理的快取大小
   - 實作 LRU 淘汰策略
   - 定期清理過期數據

3. **如何處理並發請求？**
   - 使用請求防抖
   - 實作請求合併
   - 智能重試機制
::

## 6. 總結

本文詳細介紹了如何設計和實作一個現代化的自動完成元，通過合理的架構設計、效能優化和使用者體驗考量，建立出一個效能好、可擴展且易用的元件。

- **防抖 (Debounce)**: 限制函數在一定時間內只能執行一次的技術
- **虛擬捲動 (Virtual Scrolling)**: 只渲染可視區域內的列表項目的技術
- **LRU (Least Recently Used)**: 最近最少使用快取淘汰策略
- **ARIA**: Accessible Rich Internet Applications，無障礙網頁應用程式規範
