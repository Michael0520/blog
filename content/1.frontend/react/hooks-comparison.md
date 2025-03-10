---
title: useCallback vs useMemo
description: A comprehensive guide to React performance optimization using useCallback and useMemo with real-world examples
date: 2025-03-11
read: '20'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:zap
  icon-size: 26
  ---
  #title
  React 效能優化：從實際問題出發

  #description
  難度：Medium

  #content
  目標：從實際開發問題出發，深入理解 React 效能優化的核心概念和最佳實踐

  :br

  ::alert{title="核心重點" type="info"}
  - 理解效能問題的本質
  - 掌握優化工具的使用時機
  - 學習 React 內部優化機制
  - 實戰案例分析與解決方案
  ::

  ::alert{title="學習成果" type="success"}
  - 能夠診斷和解決效能問題
  - 掌握 React 記憶化 API
  - 理解元件渲染原理
  - 實踐最佳優化方案
  ::

  #footer
  :badge[React]
  :badge[Performance]
  :badge[Hooks]
  :badge[Optimization]
  ::
::

## 1. 從問題開始

### 1.1 常見效能問題

```bash
┌─────────────────────────────────────┐
│ 問題 1：元件無謂重渲染             │
│ 問題 2：複雜計算重複執行            │
│ 問題 3：事件處理函數重複創建        │
└─────────────────────────────────────┘
```

從一個實際的例子開始：

```tsx
function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // ❌ 每次渲染都會重新創建
  const handleSearch = () => {
    fetchSearchResults(query).then(setResults);
  };

  // ❌ 每次渲染都會重新計算
  const sortedResults = results.sort((a, b) => b.score - a.score);

  return (
    <div>
      <SearchInput onSearch={handleSearch} />
      <SearchResults data={sortedResults} />
    </div>
  );
}
```

### 1.2 問題分析

::alert{title="效能瓶頸" type="warning"}
1. SearchInput 會因為 handleSearch 函數重新創建而重新渲染
2. 排序操作在每次渲染時重複執行
3. SearchResults 會因為 sortedResults 重新創建而重新渲染
::

## 2. 理解核心概念

### 2.1 React 的渲染機制

```bash
React 渲染流程：
1️⃣ 狀態改變或 props 更新
2️⃣ 元件函數重新執行
3️⃣ 創建新的虛擬 DOM
4️⃣ Diffing 算法比較差異
5️⃣ 更新實際 DOM
```

### 2.2 記憶化的本質

記憶化是一種用空間換時間的優化技術：

```tsx
// 未優化版本
function Component({ data }) {
  // ❌ 每次渲染都會重新創建新的函數和計算新的值
  const handleClick = () => processData(data);
  const processedData = heavyProcess(data);

  return <Child onClick={handleClick} data={processedData} />;
}

// 優化版本
function Component({ data }) {
  // ✅ 只在 data 改變時才會重新創建
  const handleClick = useCallback(() => processData(data), [data]);
  const processedData = useMemo(() => heavyProcess(data), [data]);

  return <Child onClick={handleClick} data={processedData} />;
}
```

## 3. 優化工具深入解析

### 3.1 useCallback vs useMemo

```bash
┌─────────────────────────────────────┐
│ useCallback：記憶化「函數參考」     │
│ - 適用於：事件處理函數              │
│ - 效果：保持函數引用穩定            │
│                                  │
│ useMemo：記憶化「計算結果」         │
│ - 適用於：複雜計算或物件創建         │
│ - 效果：避免重複計算                │
└─────────────────────────────────────┘
```

### 3.2 React.memo 的角色

```tsx
// 使用 React.memo 包裹元件
const MemoizedComponent = memo(({ data, onAction }) => {
  return (
    <div onClick={onAction}>
      {/* 複雜的渲染邏輯 */}
    </div>
  );
});

// 配合 useCallback 使用
function Parent() {
  const handleAction = useCallback(() => {
    // 處理邏輯
  }, []); // 空依賴陣列 = 函數永遠不變

  return <MemoizedComponent onAction={handleAction} />;
}
```

## 4. 實戰案例分析

### 4.1 搜尋功能優化

```tsx
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // ✅ 穩定的事件處理函數
  const handleSearch = useCallback(
    debounce((value) => {
      fetchSearchResults(value).then(setResults);
    }, 300),
    []
  );

  // ✅ 記憶化的排序結果
  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => b.score - a.score);
  }, [results]);

  return (
    <div>
      <SearchInput onChange={handleSearch} />
      <SearchResults data={sortedResults} />
    </div>
  );
}

// ✅ 記憶化子元件
const SearchResults = memo(({ data }) => {
  return (
    <ul>
      {data.map(item => (
        <SearchResultItem key={item.id} {...item} />
      ))}
    </ul>
  );
});
```

### 4.2 表單處理優化

```tsx
function ComplexForm() {
  const [formData, setFormData] = useState({});

  // ✅ 穩定的驗證函數
  const validateForm = useCallback((data) => {
    // 複雜的驗證邏輯
  }, []);

  // ✅ 記憶化的表單狀態
  const formState = useMemo(() => ({
    isValid: validateForm(formData),
    isDirty: Object.keys(formData).length > 0,
    submitCount: 0
  }), [formData, validateForm]);

  return (
    <FormContext.Provider value={formState}>
      <FormFields />
      <SubmitButton />
    </FormContext.Provider>
  );
}
```

## 5. 效能優化

### 5.1 優化方式選擇

| 策略 | 使用時機 | 注意事項 |
|------|---------|----------|
| **使用 children** | 靜態內容 | React 內建優化，優先考慮 |
| **狀態下移** | 局部狀態 | 符合單一職責原則 |
| **使用 memo** | 複雜元件 | 需要配合 useCallback/useMemo |

### 5.2 依賴陣列優化

```tsx
function UserProfile({ user }) {
  // ❌ 錯誤：使用整個物件作為依賴
  const userInfo = useMemo(() => ({
    fullName: `${user.firstName} ${user.lastName}`,
    age: user.age
  }), [user]); // 整個 user 物件變化都會觸發

  // ✅ 正確：只使用需要的屬性
  const userInfo = useMemo(() => ({
    fullName: `${user.firstName} ${user.lastName}`,
    age: user.age
  }), [user.firstName, user.lastName, user.age]);
}
```

### 5.3 Children Props 優化

```tsx
// ✅ 最佳實踐：使用 children
function Layout({ children, sidebar }) {
  const [theme, setTheme] = useState('light');

  return (
    <div className={`layout ${theme}`}>
      <nav>{sidebar}</nav>
      <main>
        {/* children 不會因為 theme 改變而重新渲染 */}
        {children}
      </main>
    </div>
  );
}

// 使用方式
function App() {
  return (
    <Layout sidebar={<Sidebar />}>
      <ExpensiveComponent />
    </Layout>
  );
}
```

## 6. 常見面試題目

### 6.1 效能優化問題

::alert{title="Q1: 如何避免不必要的重渲染？" type="info"}
答題思路：

1. 分析重渲染的原因
2. 提供多層次的解決方案
3. 比較不同方案的優缺點
::

```tsx
// 解決方案示例
function ParentComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Counter count={count} setCount={setCount} />
      {/* 使用 children 避免重渲染 */}
      <ExpensiveWrapper>
        <ExpensiveComponent />
      </ExpensiveWrapper>
    </div>
  );
}
```

### 6.2 memo vs useMemo 的關鍵差異

::alert{title="核心差異" type="info"}
1. **使用目的不同**
   - `memo`: 用於記憶化整個元件
   - `useMemo`: 用於記憶化計算結果（值）

2. **使用層級不同**
   - `memo`: 元件層級的優化
   - `useMemo`: 值層級的優化

3. **觸發重新計算的條件不同**
   - `memo`: 只有當 props 改變時才重新渲染
   - `useMemo`: 只有當依賴陣列中的值改變時才重新計算
::

```tsx
// memo 使用示例
const MemoizedComponent = memo(({ data }) => {
  console.log('Component render');
  return <div>{data.value}</div>;
}); // 只有當 data prop 改變時才重新渲染

// useMemo 使用示例
function ParentComponent() {
  const [count, setCount] = useState(0);

  // 只有當 count 改變時才重新計算
  const expensiveValue = useMemo(() => {
    console.log('Computing value');
    return computeExpensiveValue(count);
  }, [count]);

  return <div>{expensiveValue}</div>;
}
```

::alert{title="使用建議" type="success"}
1. 使用 `memo` 當：
   - 元件經常重新渲染
   - 元件渲染很耗時
   - 元件的 props 很少改變

2. 使用 `useMemo` 當：
   - 需要記憶化複雜計算的結果
   - 需要避免在每次渲染時創建新的物件
   - 計算結果被用作其他 hooks 的依賴
::

## 效能優化檢查清單

1. ✅ 使用 React.memo() 記憶化元件
2. ✅ 使用 useCallback() 記憶化函數
3. ✅ 使用 useMemo() 記憶化計算結果
4. ✅ 優化依賴陣列
5. ✅ 使用 children prop 優化
6. ✅ 實施狀態下移
7. ✅ 使用效能監測工具
