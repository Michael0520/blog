export function canConstruct(ransomNote: string, magazine: string): boolean {
  const charCount = new Map<string, number>();

  for (const char of magazine) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  for (const char of ransomNote) {
    const count = charCount.get(char) || 0;
    if (count === 0)
      return false;
    charCount.set(char, count - 1);
  }

  return true;
}
