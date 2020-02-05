/* eslint-disable no-param-reassign */
/* eslint-disable no-cond-assign */
/* eslint-disable no-bitwise */
export default class ObjectIdentifier {
  constructor(oid) {
    if (typeof (oid) === 'string') {
      this.oidString = oid;
      this.oidArray = ObjectIdentifier.ConvertToArray(this.oidString);
      this.encodedOid = ObjectIdentifier.Encode(this.oidArray);
    } else if (Array.isArray(oid)) {
      this.encodedOid = oid;
      this.oidArray = ObjectIdentifier.Decode(this.encodedOid);
      this.oidString = ObjectIdentifier.ConvertToString(this.oidArray);
    } else throw TypeError('Unexpected oid format!');
  }

  static ConvertToArray(oidString) {
    return oidString.split('.').map(Number);
  }

  static ConvertToString(oidArray) {
    return oidArray.join('.');
  }

  static Encode(oidArray) {
    let encodedOidArray = [];
    const first = (40 * oidArray[0]) + oidArray[1];
    encodedOidArray.push(first);

    for (let i = 2; i < oidArray.length; i += 1) {
      encodedOidArray = encodedOidArray.concat(ObjectIdentifier.ConvertToByte(oidArray[i]));
    }

    return encodedOidArray;
  }

  static ConvertToByte(node) {
    const result = [node & 0x7F];
    while ((node >>= 7) > 0) {
      result.push((node & 0x7F) | 0x80);
    }
    result.reverse();
    return result;
  }

  static Decode(encodedByteArray) {
    const result = [Math.round((encodedByteArray[0] / 40)), (encodedByteArray[0] % 40)];
    let buffer = 0;
    for (let i = 1; i < encodedByteArray.length; i += 1) {
      if ((encodedByteArray[i] & 0x80) === 0) {
        result.push(encodedByteArray[i] + (buffer << 7));
        buffer = 0;
      } else {
        buffer <<= 7;
        buffer += (encodedByteArray[i] & 0x7F);
      }
    }

    return result;
  }
}
