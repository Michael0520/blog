export function addBinary(a: string, b: string): string {
  // 方法一：模擬二進制加法
  // 將兩個二進制字串從右到左相加
  let carry = 0;
  let result = '';
  let i = a.length - 1;
  let j = b.length - 1;

  // 從右到左遍歷兩個字串，直到都處理完且沒有進位
  while (i >= 0 || j >= 0 || carry > 0) {
    // 取得當前位的值，如果已經遍歷完則補 0
    const digitA = i >= 0 ? Number.parseInt(a[i]) : 0;
    const digitB = j >= 0 ? Number.parseInt(b[j]) : 0;

    // 計算當前位的和與進位
    const sum = digitA + digitB + carry;
    result = (sum % 2) + result; // 當前位的值
    carry = Math.floor(sum / 2); // 進位值

    // 移動指針
    i--;
    j--;
  }

  return result;
}

// 方法二：使用 BigInt 和二進制轉換
export function addBinaryBigInt(a: string, b: string): string {
  // 0b 前綴表示二進制數字
  const aBin = `0b${a}`;
  const bBin = `0b${b}`;

  // 使用 BigInt 處理大數相加
  const sum = BigInt(aBin) + BigInt(bBin);

  // toString(2) 將數字轉換為二進制字串
  return sum.toString(2);
}
