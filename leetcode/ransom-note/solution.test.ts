import { describe, expect, it } from 'vitest';
import { canConstruct } from './solution';

describe('ransom Note', () => {
  it('should return true when ransomNote can be constructed', () => {
    expect(canConstruct('aa', 'aab')).toBe(true);
  });

  it('should return false when ransomNote cannot be constructed', () => {
    expect(canConstruct('a', 'b')).toBe(false);
    expect(canConstruct('aa', 'ab')).toBe(false);
  });

  it('should handle empty strings', () => {
    expect(canConstruct('', '')).toBe(true);
    expect(canConstruct('', 'abc')).toBe(true);
  });
});
