/**
 * 使用 Set 來計算最長回文字串長度
 * 核心思想：
 * 1. 當遇到重複字母時，代表可以組成一對，放在回文字串的兩邊
 * 2. 最後如果還有剩餘字母，可以選一個當中心點
 *
 * 例如: "aabaa"
 * 1. 遇到第一個 'a' -> 加入 Set -> [a]
 * 2. 遇到第二個 'a' -> 找到一對! -> a[]a
 * 3. 遇到 'b' -> 加入 Set -> a[b]a
 * 4. 遇到第三個 'a' -> 加入 Set -> a[b]a[a]
 * 5. 遇到第四個 'a' -> 找到一對! -> aabaa
 */
export function longestPalindrome(s: string): number {
  // 用 Set 來追蹤未配對的字母
  const unpairedLetters = new Set<string>();
  // 記錄已配對的字母數量
  let pairedCount = 0;

  // 遍歷每個字母尋找配對
  for (const letter of s) {
    // 如果找到配對的字母
    if (unpairedLetters.has(letter)) {
      // 計數加 2 並移除已配對的字母
      pairedCount += 2;
      unpairedLetters.delete(letter);
    }
    // 如果是新字母，加入 Set 等待配對
    else {
      unpairedLetters.add(letter);
    }
  }

  // 如果有剩餘未配對的字母，可以選一個當中心點
  const centerLetter = unpairedLetters.size > 0 ? 1 : 0;

  return pairedCount + centerLetter;
}
