import { SnmpValue } from './snmp-message.mjs'
import { PrimitiveDataType } from './constants.mjs'
import { ComplexDataType } from './constants.mjs';
import SnmpMessageResolver from './snmp-message-resolver.mjs'
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

            let resolver = new SnmpMessageResolver(this.responseMessage);
            
            let oidIndex = resolver.oids.map(o => o.oidString).indexOf(oid.oidString)
            this.responseMessage.SnmpValue[oidIndex] = new SnmpValue(Buffer.from([returnType, length].concat(returnValue)));
        }
        

        this.reCalculateResponse();
    }

    reCalculateResponse() {
        let bufferArray = [];
        let totalLength = 0; 
        
        var variableCount = this.responseMessage.variableCount;
        let varbindListLength = 0; let varbindLength = 0; let oidLength = 0; let valueLength = 0;
        let snmpPduLength = 0; let messageLength = 0;
        //varbind
        for (let i = 0; i < variableCount; i++) {
            oidLength = this.responseMessage.ObjectIdentifier[i].bufferLength;
            valueLength = this.responseMessage.SnmpValue[i].bufferLength;            
            varbindLength = oidLength + valueLength

            this.responseMessage.Varbind[i].setLength = varbindLength;
            varbindListLength += varbindLength + this.responseMessage.Varbind[i].bufferLength;
        } 

        this.responseMessage.VarbindList.setLength = varbindListLength;
        varbindLength += this.responseMessage.VarbindList.bufferLength;

        snmpPduLength = varbindListLength +
            this.responseMessage.ErrorIndex.bufferLength + 
            this.responseMessage.Error.bufferLength + 
            this.responseMessage.RequestId.bufferLength + 
            this.responseMessage.SnmpPdu.bufferLength;

        this.responseMessage.SnmpPdu.setLength = snmpPduLength;
        snmpPduLength += this.responseMessage.SnmpPdu.bufferLength;

        this.responseMessage.setLength = this.responseMessage.SnmpVersion.bufferLength + 
            this.responseMessage.CommunityString.bufferLength +
            snmpPduLength;
        
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
        bufferArray.map(buff => totalLength += buff.length)
        this.responseBuffer = Buffer.concat(bufferArray, totalLength)
    }
    get responseMessageBuffer() {
        this.reCalculateResponse();
        return this.responseBuffer;
    }
}

export { GetResponseMessage }