interface Cell {
  x: number;
  y: number;
  distance: number;
}

type Matrix = number[][];

export function updateMatrix(mat: Matrix): Matrix {
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
