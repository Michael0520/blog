---
title: Grid Template：最直覺的 CMS Layout 解決方案
description: 使用 Grid Template Areas 打造直覺且易維護的 CMS 版面配置
icon: 'fa6-solid:toolbox'
date: 2025-02-14
read: '15'
---

> 你是否曾經為了實現複雜的 CMS  Layout 而煩惱？在處理後台介面時，總是需要寫大量的 CSS 來控制版面配置？Grid Template Areas 提供了一個優雅的解決方案。

## 為什麼選擇 Grid Template Areas？

Grid Template Areas 是 CSS Grid 提供的一個強大功能，它讓我們可以：

1. 用視覺化的方式定義網格 Layout
2. 透過命名區域來管理版面結構
3. 輕鬆實現響應式設計
4. 提升程式碼的可維護性

### 視覺化 Layout 結構

看看這個簡單的後台 Layout 示意圖：

```bash
┌─────────────── header ───────────────┐
│                                      │
├──────────┬─────────────┬─────────────┤
│          │             │             │
│          │             │             │
│   left   │    main     │   right     │
│          │             │             │
│          │             │             │
├─────────────── footer ───────────────┤
│                                      │
└──────────────────────────────────────┘
```

這個視覺化的 Layout 可以直接對應到簡潔的 Grid Template Areas 語法：

```css
grid-template-areas:
  "header header header"  // 頂部橫跨三列
  "left   main   right"  // 中間三列分布
  "footer footer footer" // 底部橫跨三列
```

## 實作指南

### 1. 基礎結構

首先，我們需要建立 HTML 結構：

```html
<div class="layout">
  <header>Header</header>
  <aside class="left-side">Left Sidebar</aside>
  <main>Main Content</main>
  <aside class="right-side">Right Sidebar</aside>
  <footer>Footer</footer>
</div>
```

### 2. Grid  Layout 設定

接著，定義 Grid 的基本 Layout ：

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "left main right"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 50px 1fr auto;
  min-height: 100vh;
  gap: 8px;

  // 區域定義
  header { grid-area: header; }
  .left-side { grid-area: left; }
  main { grid-area: main; }
  .right-side { grid-area: right; }
  footer { grid-area: footer; }
}
```

## Grid 尺寸設定說明

在設計 Grid  Layout 時，我們使用三種主要的尺寸單位：

### 1. 固定尺寸 (px)

用於需要精確控制的元素：

```css
grid-template-columns: 200px 1fr 200px;
//                 側邊欄寬度 ↑   ↑ 側邊欄寬度
```

- 適合固定寬度的側邊欄
- 確保內容不會變形
- 常用於導航選單、工具列

### 2. 彈性尺寸 (fr)

用於需要自適應的區域：

```css
grid-template-columns: 200px 1fr 200px;
//                        ↑ 彈性寬度
```

- 自動分配剩餘空間
- 適合主要內容區域
- 可設定不同比例（如：1fr 2fr）

### 3. 自適應尺寸 (auto)

用於內容決定大小的區域：

```css
grid-template-rows: 50px 1fr auto;
//               頂部高度 ↑   ↑ 依內容自適應
//                    主內容高度
```

::alert{type="tip"}
選擇適當的尺寸單位很重要：

- `px` 用於固定尺寸元素
- `fr` 用於彈性區域
- `auto` 用於內容驅動的區域
::

## 響應式設計實作

Grid Template Areas 的一大優勢是能輕鬆實現響應式 Layout ：

```css
// 桌面版 (預設)
.layout {
  grid-template-areas:
    "header header header"
    "left main right"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
}

// 平板版 (< 1024px)
@media (max-width: 1024px) {
  .layout {
    grid-template-areas:
      "header header"
      "left main"
      "footer footer";
    grid-template-columns: 200px 1fr;
  }
}

// 手機版 (< 768px)
@media (max-width: 768px) {
  .layout {
    grid-template-areas:
      "header"
      "main"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

## 使用 Tailwind 實作

如果你使用 Tailwind CSS，可以這樣實現相同的 Layout ：

```html
<div class="grid min-h-screen
            grid-cols-[200px_1fr_200px]
            grid-rows-[50px_1fr_auto]
            gap-2">
  <header class="col-span-3">Header</header>
  <aside class="col-start-1">Left Sidebar</aside>
  <main class="col-start-2">Main Content</main>
  <aside class="col-start-3">Right Sidebar</aside>
  <footer class="col-span-3">Footer</footer>
</div>
```

### Tailwind 響應式設計

```html
<div class="grid min-h-screen
            grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[200px_1fr_200px]
            grid-rows-[50px_1fr_auto]
            gap-2">
  <!-- ... 內容相同 ... -->
</div>
```

## 結論

Grid Template Areas 為複雜的 CMS Layout 提供了一個優雅的解決方案，
不僅提供了讓 Layout 的程式碼更容易理解和維護，也大大提升了開發效率。

## 實際應用場景

### 1. 後台管理系統

```css
.admin-layout {
  grid-template-areas:
    "nav nav nav"
    "menu content user"
    "footer footer footer";
}
```

特點：

- 頂部導航欄
- 左側選單
- 中間內容區
- 右側用戶資訊
- 底部狀態列

### 2. 內容管理平台

```css
.cms-layout {
  grid-template-areas:
    "header header header"
    "tools editor preview"
    "status status status";
}
```

特點：

- 工具列
- 編輯器
- 即時預覽
- 狀態提示

### 3. 電商產品頁

```css
.product-layout {
  grid-template-areas:
    "header header header"
    "gallery info related"
    "desc desc desc"
    "footer footer footer";
}
```

特點：

- 產品圖片
- 商品資訊
- 相關商品
- 詳細描述
