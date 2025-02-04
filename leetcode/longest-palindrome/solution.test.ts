import { describe, expect, it } from 'vitest';
import { longestPalindrome } from './solution';

describe('longest palindrome', () => {
  it('應該處理基本案例', () => {
    // 基本案例：有配對和中心點
    expect(longestPalindrome('abccccdd')).toBe(7); // dccaccd
    expect(longestPalindrome('aabaa')).toBe(5); // aabaa
  });

  it('應該處理只有一個字母的案例', () => {
    expect(longestPalindrome('a')).toBe(1); // a
    expect(longestPalindrome('A')).toBe(1); // A
  });

  it('應該處理大小寫混合的案例', () => {
    expect(longestPalindrome('Aa')).toBe(1); // A 或 a
    expect(longestPalindrome('AaAaAa')).toBe(5); // AaaaA 或 aAAAa
  });

  it('應該處理所有字母都可以配對的案例', () => {
    expect(longestPalindrome('aaaa')).toBe(4); // aaaa
    expect(longestPalindrome('cccc')).toBe(4); // cccc
  });

  it('應該處理空字串', () => {
    expect(longestPalindrome('')).toBe(0);
  });

  it('應該處理複雜案例', () => {
    // 多個不同的字母組合
    expect(longestPalindrome('abccccddeeffggg')).toBe(13);
    // 所有字母都不同
    expect(longestPalindrome('abcdef')).toBe(1);
  });
});
