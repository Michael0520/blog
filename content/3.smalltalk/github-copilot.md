---
title: GitHub Copilot 是什麼?
description: GitHub Copilot 是甚麼?
icon: 'lucide:bot'
date: 2025-02-01 23:00:00
read: '10'
---

## 什麼是 GitHub Copilot

基於 AI / LLM 技術的開發助手，用於改善開發者體驗(DX)

- 核心技術來自於 OpenAI 的 GPT-3.5 Turbo 模型
- 該模型基於海量的自然語言文本資料集進行訓練，並具備一定的推理能力
• 主要能力
- 可以透過使用者輸入的部分程式碼和描述(註解)來產生相應的程式碼
- 可以解釋程式碼的邏輯與行為，任何複雜的邏輯都可以解釋
• 注意事項
- 可以透過精鍊的提示 (Prompt) 告訴它該如何行動 (Action)

## 提升 DX

幾乎支援「任何」程式語言

- 包含但不限於 Java, PHP, Python, JavaScript, Ruby, Go, C#, C++, ...
- 只要是 GitHub 公開儲存庫找的到的 Code 它都看的懂！
- 越少公開的程式語言範例，產生的程式碼就越爛！
• 專注於解決問題
- 幫助開發人員花更少的時間在重複與單調的開發工作上
- 快速完成開發並產生有品質的程式碼
• Flow
- 強調寫 Code 的「心流」模式不被破壞！

---

![GitHub Copilot](/images/smalltalk/github-copilot01.webp)

## GitHub Copilot 特色

精準的判斷上下文，並自動完成程式碼

- 檔名、路徑名、類別名、已開啟的檔案內容、現有程式碼的上下文內容
    - 沒有足夠的上下文，也可以透過「註解」提供更完整的上下文資訊
    - 可透過妥善命名的類別、方法、參數即可自動產生適合的程式碼
    - 擅長撰寫重複的程式碼，可幫助開發人員節省時間和精力，提高開發效率
    - 可以幫助新手開發者快速上手一門技術，如 HTML, CSS, JS, C#, ...
    - 可自動建立與撰寫單元測試程式碼
    - 可促進程式碼的標準化和可讀性
- 可以快速生成程式碼，節省開發人員的時間和精力
- 可以在不熟悉的領域提高寫 Code 的自信度
• 可以根據上下文提供建議和提示，幫助開發人員更好地理解程式和問題
• 可以提高程式碼品質和開發效率，減少錯誤和瑕疵！(Maybe)
• 可以學習和進化，不斷提高其生成程式碼的品質和準確性

---

## VSCode 常用鍵盤快捷鍵

![GitHub Copilot](/images/smalltalk/github-copilot02.webp)

---

## 理解 Github Copilot 如何分析你的程式碼

- 你在提問時主要的資訊來源
    - 當前的檔案
    - 已經開啟的分頁
- 上下文 (Context) 包含哪些
    - 你目前正在編輯的程式
    - 你目前鍵盤游標的前幾行與後幾行
    - 還包含了所有已經開啟的程式碼檔案
    - 他會分析你的程式碼結構並取出重要的資訊
    - 不僅僅只是註解，還有檔案名稱、類別名稱、函式名稱、參數名稱、..

---

## 使用 GitHub Copilot 的兩種方式

- CDD (Comment Driven Development)
    - 透過**註解**來開發（註解導向的開發模式）
        - 目標
        - 需求
        - 範例導向

### TypeScript generate

- 程式語言：TypeScript
- 程式需求：透過註解提示接下來要寫的 Code

![GitHub Copilot](/images/smalltalk/github-copilot03.webp)

- The Flow
    - 順著你的**開發流程**自動產生程式碼（命名很重要）

        ![GitHub Copilot](/images/smalltalk/github-copilot04.webp)

    - 開發的過程中不需要特別撰寫提示（命名很重要）
    - GitHub Copilot 會依據「上下文」自動組成 GPT-3.5 Turbo 所需的提示

---

## 常用的實戰技巧

自動生成的建議可能包含多種不同建議版本

- 滑鼠滑到灰底的程式碼建議處，就會自動顯示**隱藏版**工具列

    ![GitHub Copilot](/images/smalltalk/github-copilot05.webp)

- 你可以設定『永遠顯示工具列』

    ![GitHub Copilot](/images/smalltalk/github-copilot06.webp)

### generate commit message

![GitHub Copilot](/images/smalltalk/github-copilot07.gif)

### 提供額外 10 組程式碼建議

可按下 Commend + Enter 提供額外 10 組程式碼建議

### Config Setting 生成建議設定

會根據專案內已有的檔案及內容，生成推薦或可能需要的 config setting

![GitHub Copilot](/images/smalltalk/github-copilot08.webp)

## 文件補齊內容

![GitHub Copilot](/images/smalltalk/github-copilot09.webp)

## Copilot Chat

- 一般聊天視窗

    ![GitHub Copilot](/images/smalltalk/github-copilot10.webp)

- 快速聊天視窗 (Comment + Shift + I)

    ![GitHub Copilot](/images/smalltalk/github-copilot11.webp)

- 內嵌式聊天視窗 (Comment + I)

    ![GitHub Copilot](/images/smalltalk/github-copilot12.webp)

---

## 聊天視窗中的 slash 命令 (/help)

| Slash 命令 | 說明 |
| --- | --- |
| @workspace | 關於您當前工作區中的檔案或專案提出問題 |
| /explain | 解釋所選程式碼的工作原理 |
| /tests | 為所選程式碼產生單元測試程式碼 |
| /fix | 提出解決所選程式碼問題的建議 |
| /new | 為新的工作區建立專案架構 |
| /newNotebook | 建立新的 Jupyter 筆記本 |
| @terminal | 請教如何在終端中執行某些操作 |
| @vscode | 提問關於 VS Code 的問題 |
| /api | 請教有關 VS Code 擴充套件開發的問題 |
| /search | 請教有關如何在 VS Code 裡面搜尋檔案 |
