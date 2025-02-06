import { describe, expect, it } from 'vitest';
import { addBinary, addBinaryBigInt } from './solution';

describe('67. Add Binary', () => {
  const testCases = [
    {
      a: '11',
      b: '1',
      expected: '100',
      description: '基本案例：11 + 1 = 100',
    },
    {
      a: '1010',
      b: '1011',
      expected: '10101',
      description: '較長數字：1010 + 1011 = 10101',
    },
    {
      a: '0',
      b: '0',
      expected: '0',
      description: '邊界案例：0 + 0 = 0',
    },
    {
      a: '1111',
      b: '1111',
      expected: '11110',
      description: '有多個進位：1111 + 1111 = 11110',
    },
    {
      a: '10100000100100110110010000010101111011011001101110111111111101000000101111001110001111100001101',
      b: '110101001011101110001111100110001010100001101011101010000011011011001011101111001100000011011110011',
      expected: '110111101100010011000101110110100000011101000101011001000011011000001100011110011010010011000000000',
      description: '超大數字測試',
    },
  ];

  testCases.forEach(({ a, b, expected, description }) => {
    it(description, () => {
      expect(addBinary(a, b)).toBe(expected);
    });
  });

  describe('bigInt Solution', () => {
    testCases.forEach(({ a, b, expected, description }) => {
      it(description, () => {
        expect(addBinaryBigInt(a, b)).toBe(expected);
      });
    });
  });
});
