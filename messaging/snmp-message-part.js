/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
export default class SnmpMessagePart {
  constructor(type, length, value) {
    this.type = type;
    this.length = length;
    this.value = value;
    this.calculateBuffer();
  }

  calculateBuffer() {
    // eslint-disable-next-line no-nested-ternary
    const lenArr = Array.isArray(this.length) ? this.length
      : (Buffer.isBuffer(this.length) ? [...this.length] : [this.length]);

    if (this.value === null || typeof this.value === 'undefined') this.buffer = Buffer.from([...[this.type], ...lenArr]);
    else this.buffer = Buffer.from([...[this.type], ...lenArr, ...this.value]);

    this.length = lenArr;
  }

  get getBuffer() {
    return this.buffer;
  }

  get getValue() {
    return this.value;
  }

  /**
     * @param {(typeValue: number) => void} typeValue
     */
  set setType(typeValue) {
    this.type = typeValue;
    this.calculateBuffer();
  }

  /**
     * @param {(lenValue: number) => void} lenValue
     */
  set setLength(lenValue) {
    const calculateLength = (length) => {
      if (length < 0) throw new Error('length cannot be negative');

      const lengthArr = [];

      if (length < 127) {
        lengthArr.push(length);
        return lengthArr;
      }

      const c = new Array(16);
      let j = 0;
      while (length > 0) {
        c[j += 1] = length & 0xff;
        length >>= 8;
      }

      lengthArr.push(0x80 | j);
      while (j > 0) lengthArr.push(c[j -= 1]);

      return lengthArr;
    };

    // eslint-disable-next-line no-nested-ternary
    this.length = Array.isArray(lenValue) ? lenValue
      : (Buffer.isBuffer(lenValue) ? [...lenValue] : calculateLength(lenValue));

    this.calculateBuffer();
  }

  get bufferLength() {
    return this.buffer.length;
  }

  get lengthValue() {
    return this.length;
  }
}
