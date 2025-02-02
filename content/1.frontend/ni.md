---
title: 用 ni 管理所有 Node 套件
description: 學習如何安裝與使用 ni，統一處理多種包管理器需求，專注於開發本身
icon: 'fa6-solid:toolbox'
gitTalk: false
date: 2025-02-03 21:18:08
read: '5'
---

### 前言

你是否曾經遇到在接手新專案時，猶豫不決應該使用 `npm install` 還是 `yarn install` 呢？現在有一個稱為 `ni` 的套件管理器，可以幫助我們解決這個問題。

### ni 是什麼？

`ni` 是由知名開發者 antfu 所開發的套件管理器。它允許你在任何專案中使用同一個命令來安裝依賴，而不必擔心背後使用的具體套件管理器是什麼。

### 如何使用 ni？

首先，你需要在全局環境中安裝 `ni`：

```bash
npm i -g @antfu/ni
```

然後，在你的專案目錄中，只需輸入 `ni` 命令，`ni` 會自動根據你的專案配置安裝所有依賴。

### ni 指令介紹

- `ni`：普通安裝，等同於 `npm install`、`yarn install` 等。
- `nr`：運行指令，例如 `nr dev` 對應 `npm run dev`。
- `nx`：執行命令，如 `nx create-nuxt-app` 等。
- `nu`：更新套件，類似 `npm update` 或 `yarn upgrade`。
- `nun`：卸載套件，對應 `npm uninstall` 等。
- `nci`：清理並重新安裝，類似 `npm ci`。
- `na`：代理別名，用途較少。

### PowerShell 的注意事項

Windows PowerShell 中原生的 `ni` 指令是 New-Item 的縮寫。如果你在 PowerShell 使用 `ni`，可能需要移除原生別名：

```bash
Remove-Item Alias:ni -Force -ErrorAction Ignore
```

請確定你不需要 PowerShell 的原生 `ni` 指令再進行此操作。

### 總結

使用 `ni` 可以讓我們不再糾結於不同的套件管理器之間的差異，專注於開發工作。希望這篇技術筆記對你有所幫助！
