import { SnmpValue } from './snmp-message';
import { PrimitiveDataType, ComplexDataType } from './constants';
import SnmpMessageResolver from './snmp-message-resolver';

class GetResponseMessage {
  constructor(requestMessage, oidValueMap) {
    this.requestMessage = requestMessage;
    this.responseMessage = requestMessage;
    this.oidValueMap = oidValueMap;
    this.changeResponseType();
    this.prepareSnmpValue();
  }

  changeResponseType() {
    this.responseMessage.SnmpPdu.setType = ComplexDataType.GETRESPONSE;
  }

  prepareSnmpValue() {
    const entrieIterator = this.oidValueMap.entries();

    while (true) {
      const oidValueItem = entrieIterator.next();

      if (oidValueItem.done) {
        break;
      }

      const oid = oidValueItem.value[0];

      const value = oidValueItem.value[1] === null ? 0 : oidValueItem.value[1];

      let valueStr = value.toString(16);

      if (this.value > 127 && this.value < 256) {
        valueStr = `00${valueStr}`;
      }

      if (valueStr.length % 2) {
        valueStr = `0${valueStr}`;
      }
      const valueArr = [];

      if(oidValueItem.value[1] !== null) {
        for (let index = 0; index <= valueStr.length - 2; index += 2) {
          valueArr.push(parseInt(valueStr.slice(index, index + 2), 16));
        }
      }

      const returnValue = valueArr;
      const returnType = oidValueItem.value[1] === null
        ? PrimitiveDataType.NOSUCHOBJECT : PrimitiveDataType.COUNTER64;
      const { length } = oidValueItem.value[1] === null ? 0 : returnValue;

      const resolver = new SnmpMessageResolver(this.responseMessage);

      const oidIndex = resolver.oids.map((o) => o.oidString).indexOf(oid.oidString);
      this.responseMessage.SnmpValue[oidIndex] = new SnmpValue(
        Buffer.from([returnType, length].concat(returnValue)),
      );
    }


    this.reCalculateResponse();
  }

  reCalculateResponse() {
    const bufferArray = [];
    let totalLength = 0;

    const { variableCount } = this.responseMessage;
    let varbindListLength = 0; let varbindLength = 0; let oidLength = 0; let valueLength = 0;
    let snmpPduLength = 0; const messageLength = 0;
    // varbind
    for (let i = 0; i < variableCount; i++) {
      oidLength = this.responseMessage.ObjectIdentifier[i].bufferLength;
      valueLength = this.responseMessage.SnmpValue[i].bufferLength;
      varbindLength = oidLength + valueLength;

      this.responseMessage.Varbind[i].setLength = varbindLength;
      varbindListLength += varbindLength + this.responseMessage.Varbind[i].bufferLength;
    }

    this.responseMessage.VarbindList.setLength = varbindListLength;
    varbindLength += this.responseMessage.VarbindList.bufferLength;

    snmpPduLength = varbindListLength
            + this.responseMessage.ErrorIndex.bufferLength
            + this.responseMessage.Error.bufferLength
            + this.responseMessage.RequestId.bufferLength
            + this.responseMessage.SnmpPdu.bufferLength;

    this.responseMessage.SnmpPdu.setLength = snmpPduLength;
    snmpPduLength += this.responseMessage.SnmpPdu.bufferLength;

    this.responseMessage.setLength = this.responseMessage.SnmpVersion.bufferLength
            + this.responseMessage.CommunityString.bufferLength
            + snmpPduLength;

    bufferArray.push(this.responseMessage.getBuffer);
    bufferArray.push(this.responseMessage.SnmpVersion.getBuffer);
    bufferArray.push(this.responseMessage.CommunityString.getBuffer);
    bufferArray.push(this.responseMessage.SnmpPdu.getBuffer);
    bufferArray.push(this.responseMessage.RequestId.getBuffer);
    bufferArray.push(this.responseMessage.Error.getBuffer);
    bufferArray.push(this.responseMessage.ErrorIndex.getBuffer);
    bufferArray.push(this.responseMessage.VarbindList.getBuffer);

    for (let i = 0; i < variableCount; i++) {
      bufferArray.push(this.responseMessage.Varbind[i].getBuffer);
      bufferArray.push(this.responseMessage.ObjectIdentifier[i].getBuffer);
      bufferArray.push(this.responseMessage.SnmpValue[i].getBuffer);
    }
    bufferArray.map((buff) => totalLength += buff.length);
    this.responseBuffer = Buffer.concat(bufferArray, totalLength);
  }

  get responseMessageBuffer() {
    this.reCalculateResponse();
    return this.responseBuffer;
  }
}

export { GetResponseMessage };
