---
 title: Easy 141. Linked List Cycle
 description: In this blog I will share a solution to the Linked List Cycle problem.
 date: 2025-01-20
 read: '10'
---

 ::div{class="mt-6"}
   ::card
   ---
   icon: lucide:book-open
   icon-size: 26
   ---

   #title
   [題目連結](https://leetcode.com/problems/linked-list-cycle/)

   #description
   難度：Easy

   #content
   給定一個 Linked List，判斷其中是否包含 cycle，如果 Linked List 中存在 cycle，則返回 true；否則，返回 false。

   Example 1:

   ```bash
   Input: head = [3,2,0,-4], pos = 1
   Output: true
   ```

   Example 2:

   ```bash
   Input: head = [1,2], pos = 0
   Output: true
   ```

   Example 3:

   ```bash
   Input: head = [1], pos = -1
   Output: false
   ```

   ::alert{title="限制" type="warning"}
   - 鏈結串列中的節點數在範圍 [0, 10^4] 內
   - -10^5 <= Node.val <= 10^5
   - pos 為 -1 或一個有效的索引
   ::

   #footer
   :badge[Linked List]
   :badge[Two Pointers]
   :badge[Hash Table]
   :badge[Cycle Detection]
   ::
 ::

 ## 什麼是 cycle？

   cycle 的形成與節點值無關，而是取決於節點之間的連接方式：

   1. **無 cycle 的情況**：

      ```bash
      // 正常的鏈結串列，像排隊一樣
      1 → 2 → 3 → 4 → null
      // 每個人只看著前面一個人
      // 最後一個人前面沒有人了（指向 null）

      // 即使數字亂序也可以是無 cycle
      3 → 1 → 4 → 2 → null
      ```

   2. **有 cycle 的情況**：

      ```bash
      // 像圓桌會議一樣
      1 → 2 → 3 → 4
      ↑_______________↓
      // 每個人都看著前面一個人
      // 最後一個人看著第一個人，形成 cycle

      // 數字亂序一樣可以形成 cycle
      3 → 1 → 4 → 2
      ↑_______________↓
      ```

   ## 實務應用情境

   在實際開發中，「cycle」的檢測有許多重要應用：

   1. **記憶體洩漏檢測**

      ```typescript
      // 物件互相引用形成 cycle
      const objA = { name: 'A' };
      const objB = { name: 'B' };
      const objC = { name: 'C' };

      objA.next = objB;
      objB.next = objC;
      objC.next = objA; // 形成 cycle！
      ```

   2. **死鎖檢測**

      ```typescript
      // 程序互相等待形成 cycle
      async function processA() {
        await lockB.acquire();
        await lockA.acquire(); // 死鎖！
      }

      async function processB() {
        await lockA.acquire();
        await lockB.acquire(); // 死鎖！
      }
      ```

   3. **循環依賴**

      ```typescript
      // moduleC.ts
      import { funcA } from './moduleA';

      // 模組互相引用形成 cycle
      // moduleA.ts
      import { funcB } from './moduleB';

      // moduleB.ts
      import { funcC } from './moduleC';
      export const funcA = () => funcB();
      export const funcB = () => funcC();
      export const funcC = () => funcA(); // 循環依賴！
      ```

   ## 範例

   ```bash
   Example 1: ⭕
   Input: head = [3,2,0,-4], pos = 1
   3 → 2 → 0 → -4
       ↑___________|

   Output: true
   解釋：鏈結串列中存在一個環，其中最後一個節點指向第二個節點。

   Example 2: ❌
   Input: head = [1,2], pos = 0
   1 → 2 → null

   Output: false
   解釋：鏈結串列中不存在環。
   ```

   ## 解題思路

   這題使用「龜兔賽跑」算法（又稱 Floyd's Cycle Finding Algorithm）來解，可以想像一個跑道上有兩個跑者（烏龜和兔子）：

   1. **基本概念**：
      - 烏龜（慢跑者）：每次跑 1 步
      - 兔子（快跑者）：每次跑 2 步
      - 如果是環形跑道，兔子一定會追上烏龜
      - 如果是直線跑道，兔子會先到終點

   2. **圖解過程**：

        ```bash
        # 初始狀態
        +---+    +---+    +---+    +---+
        | 3 | -> | 2 | -> | 0 | -> |-4 |
        +---+    +---+    +---+    +---+
         🐰       🐢         |        |
          |        |        |        |
          +--------+--------+--------+

        # 第一步移動
        +---+    +---+    +---+    +---+
        | 3 | -> | 2 | -> | 0 | -> |-4 |
        +---+    +---+    +---+    +---+
               🐰                  🐢
          |        |        |        |
          +--------+--------+--------+

        # 第二步移動
        +---+    +---+    +---+    +---+
        | 3 | -> | 2 | -> | 0 | -> |-4 |
        +---+    +---+    +---+    +---+
                        🐰         🐢
          |        |        |        |
          +--------+--------+--------+

        # 相遇！（在環中）
        +---+    +---+    +---+    +---+
        | 3 | -> | 2 | -> | 0 | -> |-4 |
        +---+    +---+    +---+    +---+
               🐢🐰
          |        |        |        |
          +--------+--------+--------+
        ```

   ## 程式碼實作

   ```typescript
   function hasCycle(head: ListNode | null): boolean {
     // 處理空串列或單節點的情況
     if (!head?.next) {
       return false;
     }

     // 建立兩個跑者
     const runners = {
       turtle: head, // 烏龜從起點開始
       rabbit: head // 兔子也從起點開始
     };

     // 使用遞迴取代 while 迴圈
     const race = ({ turtle, rabbit }: typeof runners): boolean => {
       // 兔子撞到終點，表示不是環形跑道
       if (!rabbit?.next) {
         return false;
       }

       // 兔子追上烏龜了！表示有環
       if (rabbit === turtle) {
         return true;
       }

       // 繼續跑：烏龜跑 1 步，兔子跑 2 步
       return race({
         turtle: turtle.next!,
         rabbit: rabbit.next.next
       });
     };

     return race(runners);
   }
   ```

   ## 技術重點

   1. **龜兔賽跑策略**：
      - 讀了題目一陣子還是不知道在說什麼 XD
      - 查找網路上的解法，發現這個比喻很好
      - 兔子（快跑者）一次跑 2 步
      - 烏龜（慢跑者）一次跑 1 步
      - 環形跑道上，快的一定會追上慢的

   ## 複雜度分析

   - **時間複雜度**：O(n)
     - n 是節點數量
     - 最多遍歷一次鏈結串列

   - **空間複雜度**：O(1)
     - 只使用兩個指針
     - 不需要額外空間

   #footer
   :badge[Linked List]
   :badge[Two Pointers]
   ::
 ::
