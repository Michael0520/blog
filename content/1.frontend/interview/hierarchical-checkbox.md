---
title: Hierarchical Checkbox Selection
description: Implement a Hierarchical Checkbox Selection System
date: 2025-02-27
read: '12'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:check-square
  icon-size: 26
  ---

  #title
  Hierarchical Checkbox Selection

  #description
  難度：Easy

  #content
  ## 題目描述

  實作一個具有層級關係的多選框系統，需要處理父子選項之間的關聯性：

  ```typescript
  // 資料結構
  const data = [
    {
      id: 'apple',
      type: 'Apple',
      children: [
        { id: 1, name: 'a01' },
        { id: 2, name: 'a02' }
      ]
    },
    {
      id: 'banana',
      type: 'Banana',
      children: [
        { id: 3, name: 'b01' },
        { id: 4, name: 'b02' }
      ]
    }
  ];
  ```

  需求：
  1. 父層選項可以控制所有子層選項的選取狀態
  2. 當所有子層選項被選取時，父層選項自動被選取
  3. 選取狀態需要正確更新且不重複
  4. 需要顯示已選取的項目數量

  #footer
  :badge[React]
  :badge[TypeScript]
  ::
::

  ## 解題思路

  ### 1. 需求分析

  讓我們分析這個問題的核心需求：

  1. **資料結構設計**
     - 父層項目需要唯一識別符（id）
     - 子層項目需要唯一識別符（id）
     - 父子層關係需要清晰定義

  2. **狀態管理**
     - 使用單一陣列追蹤所有選取的 ID
     - 不區分父層或子層的 ID
     - 使用 useState 管理狀態

  3. **選取邏輯**
     - 父層選取時同時處理自身和子層
     - 子層選取時只處理單一項目
     - 需要處理選取和取消選取兩種情況

  ### 2. 實作步驟

  ```typescript
  function App() {
    // 步驟 1: 初始化狀態
    // - 使用 useState 儲存所有選取的 ID
    // - ID 可以是父層或子層的識別符

    // 步驟 2: 實作輔助函數
    // - 檢查項目是否被選中
    // - 處理選取邏輯

    // 步驟 3: 實作渲染邏輯
    // - 渲染父層選項
    // - 渲染子層選項
    // - 處理選取狀態顯示
  }
  ```

  ## 詳細解析

  ### 步驟 1: 初始化狀態

  首先，我們需要設置狀態來追蹤所有選取的 ID：

  ```typescript
  import { useState } from 'react';

  function App() {
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    // ... 其他實作
  }
  ```

  ### 步驟 2: 實作輔助函數

  接著，實作檢查和處理選取的核心邏輯：

  ```typescript
  // 檢查項目是否被選中
  const isSelected = (id: string | number) => selectedIds.includes(id);

  // 處理選擇邏輯
  function handleSelect(item: any, isParent = false) {
    setSelectedIds((prev) => {
      // 如果是父項目
      if (isParent) {
        const childIds = item.children.map(child => child.id);

        // 如果父項目已被選中，移除父項目和所有子項目
        if (isSelected(item.id)) {
          return prev.filter(id => !childIds.includes(id) && id !== item.id);
        }

        // 否則添加父項目和所有子項目
        return [...prev, item.id, ...childIds];
      }

      // 如果是子項目
      return isSelected(item.id)
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id];
    });
  }
  ```

  ### 步驟 3: 實作渲染邏輯

  最後，實作 UI 渲染和事件處理：

  ```tsx
  return (
    <>
      <h1>
        Selected:
        {selectedIds.length}
      </h1>

      <div className="p-4">
        {data.map(item => (
          <div key={item.id} className="mb-4">
            {/* 父層選項 */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isSelected(item.id)}
                onChange={() => handleSelect(item, true)}
              />
              <h3>{item.type}</h3>
            </div>

            {/* 子層選項 */}
            <div className="ml-6">
              {item.children.map(child => (
                <div key={child.id} className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected(child.id)}
                    onChange={() => handleSelect(child)}
                  />
                  <h5>{child.name}</h5>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
  ```

  ## 完整實作

  ```tsx
  import { useState } from 'react';

  interface Child {
    id: number;
    name: string;
  }

  interface Item {
    id: string;
    type: string;
    children: Child[];
  }

  const data: Item[] = [
    {
      id: 'apple',
      type: 'Apple',
      children: [
        { id: 1, name: 'a01' },
        { id: 2, name: 'a02' }
      ]
    },
    {
      id: 'banana',
      type: 'Banana',
      children: [
        { id: 3, name: 'b01' },
        { id: 4, name: 'b02' }
      ]
    }
  ];

  function App() {
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const isSelected = (id: string | number) => selectedIds.includes(id);

    const handleSelect = (item: Item | Child, isParent = false) => {
      setSelectedIds((prev) => {
        if (isParent) {
          const parentItem = item as Item;
          const childIds = parentItem.children.map(child => child.id);

          if (isSelected(parentItem.id)) {
            return prev.filter(id => !childIds.includes(id) && id !== parentItem.id);
          }

          return [...prev, parentItem.id, ...childIds];
        }

        return isSelected(item.id)
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id];
      });
    };

    return (
      <>
        <h1>
          Selected:
          {selectedIds.length}
        </h1>

        <div className="p-4">
          {data.map(item => (
            <div key={item.id} className="mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSelected(item.id)}
                  onChange={() => handleSelect(item, true)}
                />
                <h3>{item.type}</h3>
              </div>

              <div className="ml-6">
                {item.children.map(child => (
                  <div key={child.id} className="mt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected(child.id)}
                      onChange={() => handleSelect(child)}
                    />
                    <h5>{child.name}</h5>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  export default App;
  ```

  ## 優化考量

  ### 1. 型別安全

  ```typescript
  // 定義更精確的型別
  type ID = string | number;

  interface BaseItem {
    id: ID;
  }

  interface Child extends BaseItem {
    name: string;
  }

  interface Parent extends BaseItem {
    type: string;
    children: Child[];
  }

  // 使用聯合型別處理選取邏輯
  function handleSelect(item: Parent | Child, isParent = false) {
    // ... 實作邏輯
  }
  ```

  ### 2. 效能優化

  ```typescript
  // 使用 Set 優化查找效能
  const [selectedIds, setSelectedIds] = useState<Set<ID>>(new Set());

  const isSelected = (id: ID) => selectedIds.has(id);

  function handleSelect(item: Parent | Child, isParent = false) {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (isParent) {
        const parent = item as Parent;
        const allIds = [parent.id, ...parent.children.map(c => c.id)];

        if (isSelected(parent.id)) {
          allIds.forEach(id => next.delete(id));
        } else {
          allIds.forEach(id => next.add(id));
        }
      } else {
        if (isSelected(item.id)) {
          next.delete(item.id);
        } else {
          next.add(item.id);
        }
      }

      return next;
    });
  }
  ```

  ## 測試案例

  ```tsx
  describe('HierarchicalCheckbox', () => {
    test('選取父項目應該同時選取所有子項目', () => {
      const { getByLabelText } = render(<App />);

      // 點擊 Apple 群組
      fireEvent.click(getByLabelText('Select all Apple items'));

      // 驗證父項目和子項目都被選中
      expect(screen.getByLabelText('Select all Apple items')).toBeChecked();
      expect(screen.getByLabelText('a01')).toBeChecked();
      expect(screen.getByLabelText('a02')).toBeChecked();
    });

    test('取消選取父項目應該取消所有子項目', () => {
      const { getByLabelText } = render(<App />);

      // 先選取後取消
      const appleCheckbox = getByLabelText('Select all Apple items');
      fireEvent.click(appleCheckbox);
      fireEvent.click(appleCheckbox);

      // 驗證所有項目都被取消選取
      expect(appleCheckbox).not.toBeChecked();
      expect(screen.getByLabelText('a01')).not.toBeChecked();
      expect(screen.getByLabelText('a02')).not.toBeChecked();
    });
  });
  ```

  ## 實際應用

  這種層級選取模式在許多場景中都很有用：

  1. **檔案系統**：選取資料夾和檔案
  2. **權限管理**：設置群組和個別權限
  3. **商品分類**：選取商品類別和具體商品
  4. **任務管理**：處理專案和子任務的狀態
