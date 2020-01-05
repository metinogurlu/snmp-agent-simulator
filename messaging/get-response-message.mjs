import { SnmpValue } from './snmp-message.mjs'
import { PrimitiveDataType } from './constants.mjs'
import { ComplexDataType } from './constants.mjs';
import SnmpMessageResolver from './snmp-message-resolver.mjs'
class GetResponseMessage {
    constructor(requestMessage, oidValueMap) {
        this.message = requestMessage
        this.oidValueMap = oidValueMap;
        this.changeResponseType();
        this.prepareSnmpValue();
    }

    changeResponseType() {
        this.message.SnmpPdu.setType = ComplexDataType.GETRESPONSE;
    }
    prepareSnmpValue() {
        let entrieIterator = this.oidValueMap.entries();

        while(true) {
            let oidValueItem = entrieIterator.next();

            if(oidValueItem.done)
                break;

            let oid = oidValueItem.value[0];
            let value = oidValueItem.value[1];
            
            let valueStr = value.toString(16)
        
            if(this.value > 127 && this.value < 256)
                valueStr = "00" + valueStr
            
            if(valueStr.length % 2)
                valueStr = "0" + valueStr
            let valueArr = []
            
            for (let index = 0; index <= valueStr.length - 2; index += 2) {
                valueArr.push(parseInt(valueStr.slice(index, index + 2), 16))
            }

            let returnValue = valueArr
            let returnType = PrimitiveDataType.COUNTER64
            let length = returnValue.length

            let resolver = new SnmpMessageResolver(this.message);
            
            let oidIndex = resolver.oids.map(o => o.oidString).indexOf(oid.oidString)
            this.message.SnmpValue[oidIndex] = new SnmpValue(Buffer.from([returnType, length].concat(returnValue)));
        }
        

        this.reCalculateResponse();
    }

    reCalculateResponse() {
        let bufferArray = [];
        let totalLength = 0;
        bufferArray.push(this.message.asBuffer);
        bufferArray.push(this.message.SnmpVersion.asBuffer);
        bufferArray.push(this.message.CommunityString.asBuffer);
        bufferArray.push(this.message.SnmpPdu.asBuffer);
        bufferArray.push(this.message.RequestId.asBuffer);
        bufferArray.push(this.message.Error.asBuffer);
        bufferArray.push(this.message.ErrorIndex.asBuffer);
        bufferArray.push(this.message.VarbindList.asBuffer);
        
        var variableCount = this.message.Varbind.length;
        
        for (let i = 0; i < variableCount; i++) {
            bufferArray.push(this.message.Varbind[i].asBuffer);
            bufferArray.push(this.message.ObjectIdentifier[i].asBuffer);
            bufferArray.push(this.message.SnmpValue[i].asBuffer);
        }
        bufferArray.map(buff => totalLength += buff.length)
        this.responseBuffer = Buffer.concat(bufferArray, totalLength)
    }
    get responseMessageBuffer() {
        return this.responseBuffer;
    }
}

export { GetResponseMessage }