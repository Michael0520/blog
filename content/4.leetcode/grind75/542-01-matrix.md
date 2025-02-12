---
title: Medium 542 - 01 Matrix
description: In this blog I will share a solution to the 01 Matrix problem.
date: 2025-02-13
read: '10'
---

::div{class="mt-6"}
  ::card
  ---
  icon: lucide:book-open
  icon-size: 26
  ---

  #title
  [題目連結](https://leetcode.com/problems/01-matrix)

  #description
  難度：Medium

  #content
  目標：找出矩陣中每個位置到最近的 0 的距離

  - 只能往上下左右移動
  - 每移動一格算 1 步
  - 0 到 0 的距離是 0

  ```bash
  例子1：所有的 1 都緊鄰著 0
  Input:  [0,0,0]    Output: [0,0,0]
          [0,1,0]            [0,1,0]
          [0,0,0]            [0,0,0]

  例子2：有些 1 需要走兩步才能到 0
  Input:  [0,0,0]    Output: [0,0,0]
          [0,1,0]            [0,1,0]
          [1,1,1]            [1,2,1]
  ```

  ::alert{title="限制條件" type="warning"}
  - 矩陣大小：1 ~ 10^4
  - 只會有 0 和 1 兩種數字
  - 一定至少有一個 0
  ::

  #footer
  :badge[Array]
  :badge[BFS]
  :badge[Matrix]
  ::

## 解題思路

想像你在尋找最近的出口：

- 傳統思考：從每個位置去找最近的出口
- 更好的方法：從所有出口同時向外擴散～

```bash
傳統方法 vs 優化方法：

❌ 傳統：從每個 1 找最近的 0
[1,1,1]     🔍->🔍->🔍 重複搜尋
[1,0,1]     ⬆️  0  ⬇️
[1,1,1]     🔍->🔍->🔍

✅ 優化：從 0 開始擴散
[2,1,2]     ↖️⬆️↗️  第二層
[1,0,1]     ⬅️ 0 ➡️  第一層
[2,1,2]     ↙️⬇️↘️  第二層
```

### 解題步驟

```typescript
function updateMatrix(mat: Matrix): Matrix {
  // 1. 取得矩陣尺寸
  // 2. 處理特殊情況（1x1 矩陣）

  // 3. 初始化
  //    - 建立距離矩陣，使用 Infinity 標記未訪問
  //    - 準備 BFS 隊列

  // 4. 找出所有的 0
  //    - 設定其距離為 0
  //    - 加入 BFS 隊列作為起點
  //    - 如果沒有 0，直接返回原矩陣

  // 5. 定義四個移動方向（上、右、下、左）

  // 6. BFS 擴散
  //    - 從隊列取出當前格子
  //    - 檢查四個方向
  //    - 驗證新位置是否在邊界內
  //    - 更新較短的距離
  //    - 將更新過的位置加入隊列

  // 7. 返回完成的距離矩陣
}
```

### 程式碼實作

```typescript
interface Cell {
  x: number;
  y: number;
  distance: number;
}

type Matrix = number[][];

function updateMatrix(mat: Matrix): Matrix {
  // 矩陣尺寸
  const HEIGHT = mat.length;
  const WIDTH = mat[0].length;

  // 特殊情況：如果矩陣只有一個元素
  if (HEIGHT === 1 && WIDTH === 1) {
    return [[mat[0][0]]];
  }

  // 初始化距離矩陣和 BFS 隊列
  const distances = Array.from({ length: HEIGHT }, () =>
    Array.from({ length: WIDTH }).fill(Infinity)) as Matrix;

  // 使用 Queue 來管理 BFS
  const bfsQueue: Cell[] = [];

  // 找出所有的 0 作為起始點
  mat.forEach((row, x) => {
    row.forEach((cell, y) => {
      if (cell === 0) {
        distances[x][y] = 0;
        bfsQueue.push({ x, y, distance: 0 });
      }
    });
  });

  // 如果沒有找到任何 0，返回原矩陣
  if (bfsQueue.length === 0) {
    return mat;
  }

  // 定義移動方向（上、右、下、左）
  const DIRECTIONS = [
    [-1, 0], // 上
    [0, 1], // 右
    [1, 0], // 下
    [0, -1], // 左
  ] as const;

  // BFS 擴散
  while (bfsQueue.length > 0) {
    const currentCell = bfsQueue.shift()!;

    // 檢查四個方向
    DIRECTIONS.forEach(([dx, dy]) => {
      const nextX = currentCell.x + dx;
      const nextY = currentCell.y + dy;

      // 檢查是否可以更新距離
      const isInBounds = nextX >= 0 && nextX < HEIGHT
        && nextY >= 0 && nextY < WIDTH;

      if (isInBounds) {
        const newDistance = currentCell.distance + 1;
        const canUpdate = distances[nextX][nextY] > newDistance;

        if (canUpdate) {
          distances[nextX][nextY] = newDistance;
          bfsQueue.push({
            x: nextX,
            y: nextY,
            distance: newDistance,
          });
        }
      }
    });
  }

  return distances;
}
```

### 程式碼說明

1. **型別定義**
   ```typescript
   interface Cell {
     x: number; // x 座標
     y: number; // y 座標
     distance: number; // 到最近 0 的距離
   }
   ```

2. **初始化**
   ```typescript
   const distances = Array.from({ length: HEIGHT }, () =>
     Array.from({ length: WIDTH }).fill(Infinity));
   ```
   - 使用 `Infinity` 標記未訪問的格子
   - 使用 `Array.from` 建立二維陣列

3. **BFS 實作**
   ```typescript
   while (bfsQueue.length > 0) {
     const currentCell = bfsQueue.shift()!;
     // ... 檢查四個方向並更新距離
   }
   ```
   - 使用隊列實現廣度優先搜尋
   - 每次取出一個格子，檢查其四周

4. **邊界檢查**
   ```typescript
   const isInBounds = nextX >= 0 && nextX < HEIGHT
     && nextY >= 0 && nextY < WIDTH;
   ```
   - 確保不會超出矩陣範圍
   - 提高程式碼可讀性

5. **距離更新**
   ```typescript
   if (canUpdate) {
     distances[nextX][nextY] = newDistance;
     bfsQueue.push({
       x: nextX,
       y: nextY,
       distance: newDistance,
     });
   }
   ```
   - 只有找到更短距離時才更新
   - 將新位置加入隊列繼續擴散

### 為什麼這樣做比較適合？

1. **效率比較**
   ```bash
   傳統方法（從 1 找 0）：
   - 10000 x 10000 矩陣
   - 只有一個角落是 0
   - 需要遍歷：10^8 次 ❌

   優化方法（從 0 擴散）：
   - 同樣的矩陣
   - 每個位置只會被訪問一次
   - 遍歷次數：10^4 x 10^4 = 10^8 ✅
   ```

2. **優化後的優點**
   - 使用 `Infinity` 初始化：方便判斷未訪問
   - 使用 `Point` 型別：提高程式碼可讀性
   - 使用 BFS：確保找到最短距離

### 解題重點
1. 反向思考：從終點（0）往回找，而不是從起點（1）開始找
2. 使用 BFS 確保最短距離
3. 同時從多個起點（所有的 0）開始擴散
4. 善用 `Infinity` 來標記未訪問的點
