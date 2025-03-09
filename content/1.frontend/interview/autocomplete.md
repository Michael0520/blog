---
title: Autocomplete System Design
description: A comprehensive guide to designing a modern autocomplete component
date: 2025-03-09
read: '20'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:search
  icon-size: 26
  ---

  #title
  Autocomplete System Design

  #description
  難度：Hard

  #content
  ## 系統設計概述

  設計一個現代化的自動完成（Autocomplete）元件是前端開發中常見的需求。讓我們以 YouTube 搜尋欄為例，透過 RADIO 設計模式來建立一個可擴展、高效能的解決方案。

  ### RADIO 設計模式分析

  #### 1. Requirements（需求分析）

  ##### 基礎功能

  - 即時搜尋：使用者輸入時動態顯示建議
  - 智能建議：根據輸入內容提供相關建議
  - 鍵盤導航：完整的鍵盤操作支援
  - 點擊選擇：直覺的滑鼠操作體驗

  ##### 進階功能

  - UI 客製化：支援不同場景的介面需求
  - 快取機制：優化重複查詢的效能
  - 防抖處理：避免過度的 API 請求
  - 錯誤處理：優雅的錯誤狀態展示
  - 載入狀態：清晰的視覺回饋
  - 空結果處理：友善的無結果提示

  ##### 非功能需求

  - 效能優化：確保快速的回應時間
  - 無障礙設計：支援螢幕閱讀器
  - RWD 支援：適應不同裝置尺寸
  - 國際化：支援多語言

  #### 2. Architecture（架構設計）

  採用模組化的架構設計，主要分為以下幾個核心組件：

  1. **View Layer**
     - Input UI：處理使用者輸入
     - Results UI：顯示搜尋建議

  2. **Controller**
     - 狀態管理
     - 事件處理
     - 資料流控制

  3. **Cache Layer**
     - 本地快取管理
     - 過期機制

  4. **Network Layer**
     - API 請求處理
     - 錯誤重試機制
     - 離線支援

  #footer
  :badge[System Design]
  :badge[React]
  :badge[TypeScript]
  :badge[Performance]
  ::
::

  ## 系統架構設計

  ### 1. 整體架構

  優先採用 TypeScript 來確保型別安全性，並搭配 React 來實作元件，以下是核心 interface：

  ```tsx
  interface AutocompleteProps<T> {
    // 核心配置
    value?: string;
    onChange?: (value: string) => void;
    onSelect?: (item: T) => void;

    // data 相關
    fetchSuggestions: (query: string) => Promise<T[]>;
    debounceTime?: number;
    minQueryLength?: number;

    // UI
    renderItem?: (item: T) => React.ReactNode;
    renderInput?: (props: InputProps) => React.ReactNode;
    renderNoResults?: () => React.ReactNode;

    // cache
    cacheTime?: number;
    maxCacheSize?: number;

    // a11y
    ariaLabel?: string;
    ariaDescribedBy?: string;
  }
  ```

  設計考慮了以下幾個關鍵點：

  - 泛型支援：使用泛型 T 來支援不同的資料類型
  - 自定義渲染：支援客製化 UI 呈現（參考 shadcn UI 設計模式）

  ### 2. YouTube 搜尋分析

  YouTube 的搜尋欄是自動完成功能的典範。讓我們分析其實現：

  ```tsx
  interface YouTubeSearchSuggestion {
    id: string;
    title: string;
    type: 'video' | 'channel' | 'playlist';
    thumbnail?: string;
    viewCount?: string;
    duration?: string;
    channelName?: string;
  }

  function YouTubeSearchBar() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<YouTubeSearchSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const cache = useCache<YouTubeSearchSuggestion>({
      maxSize: 100,
      cacheTime: 10 * 60 * 1000 // 10 min
    });

    const debouncedSearch = useDebounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // check cache
        const cachedResults = cache.get(searchQuery);
        if (cachedResults) {
          setSuggestions(cachedResults);
          setIsLoading(false);
          return;
        }

        // if have not cache, will trigger fetch request
        const results = await fetchYouTubeSuggestions(searchQuery);
        cache.set(searchQuery, results);
        setSuggestions(results);
      } catch (error) {
        console.error('result suggest fetch fail:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return (
      <div className="relative w-full max-w-2xl">
        {/* 搜尋輸入框 */}
        <div className="flex items-center overflow-hidden rounded-full border border-gray-300 bg-white">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              debouncedSearch(e.target.value);
            }}
            className="w-full px-4 py-2 outline-none"
            placeholder="搜尋"
            aria-label="YouTube 搜尋"
          />
          <button className="bg-gray-100 px-6 py-2 hover:bg-gray-200">
            <SearchIcon className="size-5" />
          </button>
        </div>

        {/* 搜尋建議下拉清單 */}
        {(suggestions.length > 0 || isLoading) && (
          <div className="absolute mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
            {isLoading
              ? (
                  <div className="p-4 text-center text-gray-500">
                    <LoadingSpinner className="mx-auto size-5" />
                  </div>
                )
              : (
                  <ul className="py-2">
                    {suggestions.map(suggestion => (
                      <li
                        key={suggestion.id}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          {suggestion.thumbnail && (
                            <img
                              src={suggestion.thumbnail}
                              alt=""
                              className="size-10 rounded object-cover"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">
                              {suggestion.title}
                            </div>
                            {suggestion.channelName && (
                              <div className="text-sm text-gray-500">
                                {suggestion.channelName}
                              </div>
                            )}
                          </div>
                          {suggestion.viewCount && (
                            <div className="text-sm text-gray-500">
                              觀看次數：
                              {suggestion.viewCount}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
          </div>
        )}
      </div>
    );
  }

  // mock fetch api
  async function fetchYouTubeSuggestions(query: string): Promise<YouTubeSearchSuggestion[]> {
    // example response
    return [
      {
        id: '1',
        title: `${query} - 最新影片`,
        type: 'video',
        thumbnail: 'video-thumbnail.jpg',
        viewCount: '100萬',
        duration: '10:30',
        channelName: 'YouTube 頻道'
      },
    ];
  }
  ```

  1. **即時搜尋體驗**
     - 使用防抖動避免過多請求
     - 快取機制提升回應速度
     - 載入狀態的使用者回饋

  2. **涵蓋基本資料的顯示**
     - 影片縮圖
     - 頻道資訊顯示
     - 觀看次數統計

  4. **效能考量**
     - 透過快取減少請求數量

  ## 技術實現細節

  ### 1. 快取機制設計

  使用 React Hooks 實現快取系統：

  ```tsx
  interface CacheItem<T> {
    data: T[];
    timestamp: number;
  }

  interface UseCacheOptions {
    maxSize?: number;
    cacheTime?: number;
  }

  function useCache<T>(options: UseCacheOptions = {}) {
    const {
      maxSize = 100,
      cacheTime = 5 * 60 * 1000 // default 5 min
    } = options;

    // useRef to save cache，reduce re-render case
    const cacheRef = useRef(new Map<string, CacheItem<T>>());

    const get = useCallback((key: string): T[] | null => {
      const item = cacheRef.current.get(key);
      if (!item)
        return null;

      // 檢查是否過期
      if (Date.now() - item.timestamp > cacheTime) {
        cacheRef.current.delete(key);
        return null;
      }

      return item.data;
    }, [cacheTime]);

    const set = useCallback((key: string, data: T[]): void => {
      // if cache is full, remove the oldest item
      if (cacheRef.current.size >= maxSize) {
        const oldestKey = cacheRef.current.keys().next().value;
        cacheRef.current.delete(oldestKey);
      }

      cacheRef.current.set(key, {
        data,
        timestamp: Date.now()
      });
    }, [maxSize]);

    const clear = useCallback(() => {
      cacheRef.current.clear();
    }, []);

    const size = useCallback(() => {
      return cacheRef.current.size;
    }, []);

    // remove target item
    const remove = useCallback((key: string) => {
      return cacheRef.current.delete(key);
    }, []);

    const has = useCallback((key: string) => {
      return cacheRef.current.has(key);
    }, []);

    // return verify item list
    const getAll = useCallback(() => {
      const validEntries: [string, T[]][] = [];
      cacheRef.current.forEach((item, key) => {
        if (Date.now() - item.timestamp <= cacheTime) {
          validEntries.push([key, item.data]);
        } else {
          cacheRef.current.delete(key);
        }
      });
      return validEntries;
    }, [cacheTime]);

    // setInterval to keep sync cache in target time
    useEffect(() => {
      const cleanup = () => {
        cacheRef.current.forEach((item, key) => {
          if (Date.now() - item.timestamp > cacheTime) {
            cacheRef.current.delete(key);
          }
        });
      };

      const interval = setInterval(cleanup, cacheTime);

      return () => {
        clearInterval(interval);
      };
    }, [cacheTime]);

    return {
      get,
      set,
      clear,
      size,
      remove,
      has,
      getAll
    };
  }
  ```

  1. **效能優化**
     - 使用 `useRef` 避免不必要的重新渲染
     - 記憶化函數減少重複計算
     - 自動清理過期數據

  2. **功能完整**
     - 支援資料過期機制
     - 容量限制管理
     - 完整的快取操作 API

  3. **使用範例**

  ```tsx
  function AutocompleteComponent<T>({ onSearch, ...props }: AutocompleteProps<T>) {
    const cache = useCache<T>({
      maxSize: 100,
      cacheTime: 5 * 60 * 1000
    });

    const handleSearch = useCallback(async (query: string) => {
      const cachedResults = cache.get(query);
      if (cachedResults) {
        return cachedResults;
      }

      const results = await onSearch(query);

      cache.set(query, results);

      return results;
    }, [cache, onSearch]);

    return (
      <div></div>
    );
  }
  ```

  ### 2. Debounce

  為了避免過多的 API 請求，實作常見的一個自定義的防抖動 Hook：

  ```tsx
  function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(timer);
      };
    }, [value, delay]);

    return debouncedValue;
  }
  ```

  ### 3. keyDown navigate

  ```tsx
  function useKeyboardNavigation<T>(
    suggestions: T[],
    onSelect: (item: T) => void,
  ) {
    const [activeIndex, setActiveIndex] = useState(-1);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            setActiveIndex(prev =>
              prev < suggestions.length - 1 ? prev + 1 : prev,
            );
            break;
          case 'ArrowUp':
            event.preventDefault();
            setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
            break;
          case 'Enter':
            if (activeIndex >= 0 && activeIndex < suggestions.length) {
              onSelect(suggestions[activeIndex]);
            }
            break;
          case 'Escape':
            setActiveIndex(-1);
            break;
        }
      },
      [suggestions, activeIndex, onSelect],
    );

    return { activeIndex, handleKeyDown };
  }
  ```

  功能包括：
  - 上下鍵移動選擇
  - Enter 鍵確認選擇
  - Escape 鍵清除選擇
  - 循環選擇邏輯

  ## 效能優化策略

  ### 1. virtual scroll

  處理大量數據時，virtual scroll 是提升效能的關鍵：

  ```tsx
  interface VirtualScrollProps<T> {
    items: T[];
    itemHeight: number;
    containerHeight: number;
    renderItem: (item: T) => React.ReactNode;
  }

  function VirtualScroll<T>({
    items,
    itemHeight,
    containerHeight,
    renderItem,
  }: VirtualScrollProps<T>) {
    const [scrollTop, setScrollTop] = useState(0);

    const visibleItemCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleItemCount, items.length);

    const visibleItems = items.slice(startIndex, endIndex);
    const totalHeight = items.length * itemHeight;

    return (
      <div
        style={{ height: containerHeight, overflow: 'auto' }}
        onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
            {visibleItems.map(renderItem)}
          </div>
        </div>
      </div>
    );
  }
  ```

  虛擬滾動的優勢：
  - 減少 DOM node 數量
  - 提升滾動效能
  - 優化記憶體使用

  ### 2. useOptimizedFetch Hook

  ```tsx
  function useOptimizedFetch<T>(
    fetchFn: (query: string) => Promise<T[]>,
    debounceTime: number,
    cacheTime: number,
  ) {
    const cache = useMemo(() => new SuggestionCache<T>(100, cacheTime), []);
    const debouncedFetch = useCallback(
      debounce(async (query: string) => {
        const cached = cache.get(query);
        if (cached)
          return cached;

        const data = await fetchFn(query);
        cache.set(query, data);
        return data;
      }, debounceTime),
      [fetchFn, debounceTime],
    );

    return debouncedFetch;
  }
  ```

  請求優化的特點：
  - 快取管理
  - 防抖動處理
  - 錯誤重試機制

  ## a11y

  遵循 WAI-ARIA 規範，確保無障礙支援：

  ```tsx
  const A11yProvider: React.FC = ({ children }) => {
    return (
      <div
        role="combobox"
        aria-expanded="true"
        aria-haspopup="listbox"
        aria-controls="autocomplete-list"
      >
        {children}
      </div>
    );
  };

  const A11yList: React.FC = ({ children, activeIndex }) => {
    return (
      <ul
        role="listbox"
        id="autocomplete-list"
        aria-label="搜尋建議"
      >
        {React.Children.map(children, (child, index) => (
          <li
            role="option"
            aria-selected={index === activeIndex}
            tabIndex={index === activeIndex ? 0 : -1}
          >
            {child}
          </li>
        ))}
      </ul>
    );
  };
  ```

  ## 使用範例

  ```tsx
  import { Autocomplete } from '@your-org/autocomplete';

  function App() {
    const fetchSuggestions = async (query: string) => {
      const response = await fetch(`/api/search?q=${query}`);
      return response.json();
    };

    const handleSelect = (item: any) => {
      console.log('Selected:', item);
    };

    return (
      <Autocomplete
        fetchSuggestions={fetchSuggestions}
        onSelect={handleSelect}
        debounceTime={300}
        renderItem={item => (
          <div className="flex items-center gap-2">
            <img src={item.avatar} className="size-8 rounded-full" />
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-500">{item.description}</div>
            </div>
          </div>
        )}
      />
    );
  }
  ```

  使用範例展示：
  - 基本配置設定
  - 自定義渲染
  - 事件處理

## 進階考量

### 1. 錯誤處理策略

```tsx
interface ErrorHandlerProps {
  fallback: React.ReactNode;
  onError?: (error: Error) => void;
  children: React.ReactNode;
}

function useErrorHandler(onError?: (error: Error) => void) {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error) => {
    setError(error);
    onError?.(error);
    // can set error tracking id in here
    console.error('Autocomplete encountered an error:', error);
  }, [onError]);

  return {
    error,
    handleError,
    resetError: () => setError(null)
  };
}

function ErrorBoundary({ children, fallback, onError }: ErrorHandlerProps) {
  const { error, handleError, resetError } = useErrorHandler(onError);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-red-600">
          <ExclamationIcon className="size-5" />
          <h3 className="font-medium">抱歉，發生了一點問題</h3>
        </div>
        <p className="mb-3 text-gray-600">
          {error.message || '搜尋時遇到了一些技術問題'}
        </p>
        <button
          onClick={resetError}
          className="rounded bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200"
        >
          重試
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}

// 使用範例
function SearchMovies() {
  const handleError = (error: Error) => {
    // custom error
    analytics.trackError('movie_search', error);
  };

  return (
    <ErrorBoundary
      onError={handleError}
      fallback={(
        <div className="py-8 text-center">
          <p>😅 抱歉，搜尋服務暫時不可用</p>
          <p className="text-sm text-gray-500">
            建議稍後再試，或是直接瀏覽我們的熱門電影列表
          </p>
        </div>
      )}
    >
      <MovieAutocomplete />
    </ErrorBoundary>
  );
}
```

### 3. 測試策略

```tsx
describe('Autocomplete', () => {
  it('should render input and handle changes', async () => {
    const fetchSuggestions = vi.fn().mockResolvedValue([
      { id: 1, name: 'Test 1' },
      { id: 2, name: 'Test 2' },
    ]);

    render(
      <Autocomplete
        fetchSuggestions={fetchSuggestions}
        onSelect={vi.fn()}
      />
    );

    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'test');

    expect(fetchSuggestions).toHaveBeenCalledWith('test');
    expect(await screen.findByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
  });

  // More test cases...
});
```

## 效能指標

### 1. 關鍵指標

- 首次輸入到顯示結果的時間 < 100ms
- 快取命中率 > 80%
- 記憶體使用量 < 10MB
- 捲動時的幀率 > 60fps

### 2. 監控指標

實作完整的效能監控系統：

```tsx
interface PerformanceMetrics {
  inputLatency: number;
  renderTime: number;
  cacheHitRate: number;
  memoryUsage: number;
  networkRequests: number;
}

function trackMetrics(metrics: PerformanceMetrics) {
  // 實作監控邏輯
}
```

監控重點：

- 使用者輸入延遲
- 渲染效能
- 網路請求效能
- 記憶體使用情況

## 網路請求處理

### 1. 並發請求控制

```tsx
interface RequestController {
  pendingRequests: Map<string, Promise<any>>;
  abortControllers: Map<string, AbortController>;
}

function createRequestController(): RequestController {
  return {
    pendingRequests: new Map(),
    abortControllers: new Map(),
  };
}

async function fetchWithControl<T>(
  query: string,
  fetchFn: (query: string, signal: AbortSignal) => Promise<T>,
  controller: RequestController,
): Promise<T> {
  // 取消之前的請求
  if (controller.abortControllers.has(query)) {
    controller.abortControllers.get(query)?.abort();
  }

  // 建立新的 AbortController
  const abortController = new AbortController();
  controller.abortControllers.set(query, abortController);

  try {
    const response = await fetchFn(query, abortController.signal);
    controller.pendingRequests.delete(query);
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request cancelled');
    }
    throw error;
  } finally {
    controller.abortControllers.delete(query);
  }
}
```

請求控制特點：

- 自動取消重複請求
- 請求狀態追蹤
- 錯誤處理機制

### 2. 離線支援

```tsx
interface UseOfflineSupportOptions<T> {
  storage?: Storage;
  maxItems?: number;
  searchKeys?: (keyof T)[];
}

function useOfflineSupport<T>({
  storage = localStorage,
  maxItems = 100,
  searchKeys = ['name', 'title']
}: UseOfflineSupportOptions<T> = {}) {
  const cache = useCache<T>();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 監聽網路狀態
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 從 localStorage 載入快取
  useEffect(() => {
    const stored = storage.getItem('autocomplete-cache');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([key, value]) => {
          cache.set(key, value as T[]);
        });
      } catch (error) {
        console.warn('Failed to load cache from storage:', error);
      }
    }
  }, []);

  // 儲存到 localStorage
  const saveToStorage = useCallback((key: string, data: T[]) => {
    try {
      const currentCache = JSON.parse(storage.getItem('autocomplete-cache') || '{}');
      currentCache[key] = data;
      storage.setItem('autocomplete-cache', JSON.stringify(currentCache));
    } catch (error) {
      console.warn('Failed to save to storage:', error);
    }
  }, [storage]);

  // 模糊搜尋實現
  const findSimilarResults = useCallback((query: string): T[] => {
    const allItems = cache.getAll().flatMap(([, items]) => items);
    return allItems.filter(item =>
      searchKeys.some(key =>
        String(item[key]).toLowerCase().includes(query.toLowerCase())
      )
    ).slice(0, maxItems);
  }, [cache, searchKeys, maxItems]);

  // 主要的搜尋函數
  const search = useCallback(async (
    query: string,
    fetchFn: (q: string) => Promise<T[]>
  ): Promise<T[]> => {
    // 先檢查快取
    const cached = cache.get(query);
    if (cached)
      return cached;

    // 如果離線，使用模糊搜尋
    if (!isOnline) {
      return findSimilarResults(query);
    }

    try {
      const results = await fetchFn(query);
      cache.set(query, results);
      saveToStorage(query, results);
      return results;
    } catch (error) {
      // 如果請求失敗，也使用模糊搜尋
      return findSimilarResults(query);
    }
  }, [isOnline, cache, findSimilarResults, saveToStorage]);

  return {
    search,
    isOnline,
    clearCache: cache.clear
  };
}

function MovieSearch() {
  const { search, isOnline } = useOfflineSupport<Movie>({
    searchKeys: ['title', 'description', 'actors'],
    maxItems: 50
  });

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    const searchResults = await search(newQuery, fetchMovies);
    setResults(searchResults);
  };

  return (
    <div>
      {!isOnline && (
        <div className="mb-2 flex items-center gap-1 text-sm text-amber-600">
          <WifiOffIcon className="size-4" />
          目前處於離線模式，顯示快取結果
        </div>
      )}
      <Autocomplete
        value={query}
        onChange={handleSearch}
        suggestions={results}
        renderItem={movie => (
          <div className="flex gap-3 p-2">
            <img
              src={movie.poster}
              alt={movie.title}
              className="h-16 w-12 rounded object-cover"
            />
            <div>
              <div className="font-medium">{movie.title}</div>
              <div className="text-sm text-gray-500">
                {movie.year}
                {' '}
                ·
                {movie.rating}
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
```

這個離線支援機制的特色：

1. **離線體驗提升**
   - 自動偵測網路狀態
   - 自動切換搜尋模式

2. **資料持久化**
   - 自動儲存到 localStorage
   - 快取管理
   - 錯誤處理機制

### 3. 錯誤重試機制

```tsx
interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  config: RetryConfig,
): Promise<T> {
  let attempt = 0;
  let delay = config.initialDelay;

  while (attempt < config.maxAttempts) {
    try {
      return await fetchFn();
    } catch (error) {
      attempt++;
      if (attempt === config.maxAttempts) {
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * config.backoffFactor, config.maxDelay);
    }
  }

  throw new Error('Max retry attempts reached');
}
```

重試機制特點：

- 指數退避策略
- 可以客製化的重試次數

### 3. YouTube 搜尋欄實例分析

為了更好地理解這個設計，讓我們以 YouTube 的搜尋欄為例。YouTube 的搜尋功能不僅提供基本的文字搜尋，還包含了豐富的影片預覽、頻道資訊等進階功能。

#### 核心資料結構
```tsx
interface YouTubeSearchSuggestion {
  id: string;
  title: string;
  type: 'video' | 'channel' | 'playlist';
  thumbnail?: string;
  viewCount?: string;
  duration?: string;
  channelName?: string;
}
```

#### 元件實現
```tsx
function YouTubeSearchBar() {
  // 狀態管理
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<YouTubeSearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 快取設定
  const cache = useCache<YouTubeSearchSuggestion>({
    maxSize: 100,
    cacheTime: 10 * 60 * 1000 // 10 分鐘快取
  });

  // 搜尋邏輯
  const debouncedSearch = useDebounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // 優先使用快取資料
      const cachedResults = cache.get(searchQuery);
      if (cachedResults) {
        setSuggestions(cachedResults);
        setIsLoading(false);
        return;
      }

      // 發送 API 請求
      const results = await fetchYouTubeSuggestions(searchQuery);
      cache.set(searchQuery, results);
      setSuggestions(results);
    } catch (error) {
      console.error('搜尋建議載入失敗:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, 300); // 300ms 的防抖延遲

  return (
    <div className="relative w-full max-w-2xl">
      {/* 搜尋輸入框 */}
      <div className="flex items-center overflow-hidden rounded-full border border-gray-300 bg-white">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            debouncedSearch(e.target.value);
          }}
          className="w-full px-4 py-2 outline-none"
          placeholder="搜尋"
          aria-label="YouTube 搜尋"
        />
        <button className="bg-gray-100 px-6 py-2 hover:bg-gray-200">
          <SearchIcon className="size-5" />
        </button>
      </div>

      {/* 搜尋建議下拉選單 */}
      {(suggestions.length > 0 || isLoading) && (
        <div className="absolute mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {isLoading
            ? (
                <div className="p-4 text-center text-gray-500">
                  <LoadingSpinner className="mx-auto size-5" />
                </div>
              )
            : (
                <ul className="py-2">
                  {suggestions.map(suggestion => (
                    <li
                      key={suggestion.id}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        {suggestion.thumbnail && (
                          <img
                            src={suggestion.thumbnail}
                            alt=""
                            className="size-10 rounded object-cover"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">
                            {suggestion.title}
                          </div>
                          {suggestion.channelName && (
                            <div className="text-sm text-gray-500">
                              {suggestion.channelName}
                            </div>
                          )}
                        </div>
                        {suggestion.viewCount && (
                          <div className="text-sm text-gray-500">
                            觀看次數：
                            {suggestion.viewCount}
                          </div>
                        )}
                      </div>
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

#### 實現特點

1. **使用者體驗優化**
   - 防抖處理避免頻繁請求
   - 快取機制提升回應速度
   - 載入狀態視覺回饋

2. **資料展示優化**
   - 縮圖預覽功能
   - 頻道資訊整合
   - 觀看數據顯示

3. **效能考量**
   - 本地快取減少請求
   - 條件渲染優化效能
   - 智能的資源載入

### 4. 核心功能實現

#### 快取機制
快取是提升搜尋效能的關鍵。我們使用 React Hooks 實現一個高效的快取系統：

```tsx
// ... rest of the existing code ...
```
