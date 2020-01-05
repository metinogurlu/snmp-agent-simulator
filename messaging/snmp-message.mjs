import SnmpMessagePart from "./snmp-message-part.mjs";
import { MessagePart, MessagePartBytes } from "../messaging/constants.mjs";

class SnmpMessage extends SnmpMessagePart {
    constructor(messageBuffer) {
        if ((typeof (messageBuffer) === 'undefined') || (messageBuffer === null))
            throw new Error("messageBuffer is null or undefined");

        super(messageBuffer[MessagePartBytes.TYPE], messageBuffer[MessagePartBytes.LENGTH]);

        this.messageBuffer = messageBuffer;
        this.splittedBufferByMessagePart = this.getSplittedBuffer();

        this.SnmpVersion = new SnmpVersion(
            this.splittedBufferByMessagePart.get(MessagePart.VERSION));
        this.CommunityString = new CommunityString(
            this.splittedBufferByMessagePart.get(MessagePart.COMMUNITYSTRING));
        this.SnmpPdu = new SnmpPdu(
            this.splittedBufferByMessagePart.get(MessagePart.PDU));
        this.RequestId = new RequestId(
            this.splittedBufferByMessagePart.get(MessagePart.REQUESTID));
        this.Error = new Error(
            this.splittedBufferByMessagePart.get(MessagePart.ERROR));
        this.ErrorIndex = new ErrorIndex(
            this.splittedBufferByMessagePart.get(MessagePart.ERRORINDEX));
        this.VarbindList = new VarbindList(
            this.splittedBufferByMessagePart.get(MessagePart.VARBINDLIST));
        
        var variableCount = this.splittedBufferByMessagePart.get(MessagePart.VARBIND).length
        
        this.Varbind = []; this.ObjectIdentifier = []; this.SnmpValue = [];

        for (let i = 0; i < variableCount; i++) {
            this.Varbind.push(new Varbind(
                this.splittedBufferByMessagePart.get(MessagePart.VARBIND)[i]));
            this.ObjectIdentifier.push(new ObjectIdentifier(
                this.splittedBufferByMessagePart.get(MessagePart.OID)[i]));
            this.SnmpValue.push(new SnmpValue(
                this.splittedBufferByMessagePart.get(MessagePart.VALUE)[i]));
        }
    }

    getSplittedBuffer() {

        let lastValueInMap = (map, lastState) => {
            var lastValue = map.get(lastState)

            return [lastState, Array.isArray(lastValue) ? 
                lastValue[lastValue.length -1] : lastValue]
        }

        let getNextIndex = (map, lastState) => {
            let nextStartIndex = 0;
            const ignoredMessageParts = [MessagePart.PDU, MessagePart.VARBINDLIST, MessagePart.VARBIND];
            const [lastMesagePart, lastStartIndex] = lastValueInMap(map, lastState);
            if(ignoredMessageParts.includes(lastMesagePart))
                nextStartIndex = lastStartIndex + 2;
            else {
                var lengtIndexhOfCurrentPart = lastStartIndex + 1;
                nextStartIndex = lastStartIndex + this.messageBuffer[lengtIndexhOfCurrentPart] + 2;
            }
            return nextStartIndex;
        }

        let getMaxIndex = (map) => {
            var mapValueIterator = map.values;
            var maxIndex = 0;
            while(true) {
                var currentIndexValue = mapValueIterator.next();
                if(Array.isArray(currentIndexValue.value))
                    currentIndexValue.value.forEach(indexValue => {
                        if(indexValue > maxIndex)
                            maxIndex = indexValue;
                    });
                else
                    if(currentIndexValue.value > maxIndex)
                        maxIndex = currentIndexValue;
                
                if(currentIndexValue.done)
                    break;
            }

            return maxIndex;
        }

        let anyMoreVarbind = (map) => {
            return !(getNextIndex(map, MessagePart.VALUE) == this.messageBuffer.length);
        }

        let getMessagePartIndexes = () => {
            let messagePartIndexMap = new Map()
            messagePartIndexMap.set(MessagePart.MESSAGE, 0);
            messagePartIndexMap.set(MessagePart.VERSION, 2);
            messagePartIndexMap.set(MessagePart.COMMUNITYSTRING, 5);
            messagePartIndexMap.set(MessagePart.PDU, 
                getNextIndex(messagePartIndexMap, MessagePart.COMMUNITYSTRING));
            messagePartIndexMap.set(MessagePart.REQUESTID, 
                getNextIndex(messagePartIndexMap, MessagePart.PDU));
            messagePartIndexMap.set(MessagePart.ERROR, 
                getNextIndex(messagePartIndexMap, MessagePart.REQUESTID));
            messagePartIndexMap.set(MessagePart.ERRORINDEX, 
                getNextIndex(messagePartIndexMap, MessagePart.ERROR));
            messagePartIndexMap.set(MessagePart.VARBINDLIST, 
                getNextIndex(messagePartIndexMap, MessagePart.ERRORINDEX));
            messagePartIndexMap.set(MessagePart.VARBIND, 
                [getNextIndex(messagePartIndexMap, MessagePart.VARBINDLIST)]);
            messagePartIndexMap.set(MessagePart.OID, 
                [getNextIndex(messagePartIndexMap, MessagePart.VARBIND)]);
            messagePartIndexMap.set(MessagePart.VALUE, 
                [getNextIndex(messagePartIndexMap, MessagePart.OID)]);

            while (anyMoreVarbind(messagePartIndexMap)) {
                messagePartIndexMap.get(MessagePart.VARBIND)
                    .push(getNextIndex(messagePartIndexMap, MessagePart.VALUE));
                messagePartIndexMap.get(MessagePart.OID)
                    .push(getNextIndex(messagePartIndexMap, MessagePart.VARBIND));
                messagePartIndexMap.get(MessagePart.VALUE)
                    .push(getNextIndex(messagePartIndexMap, MessagePart.OID));
            }

            return messagePartIndexMap;
        }

        let getBufferBetweenIndexes = (indexMap, firstKey, lastKey, indexForArrayValue) => {
            
            let firstAny = indexMap.get(firstKey);
            let firstVal = 0;
            let lastVal = 0;
            let leapIndex = 0;
            
            //is multiple variable to requested.
            if(firstKey == MessagePart.VALUE && lastKey == MessagePart.VARBIND)
                leapIndex = 1;
            
            if(Array.isArray(firstAny)) {
                firstVal = firstAny[indexForArrayValue];
                lastVal =  lastKey === 'undefined' || lastKey === null ? 
                    this.messageBuffer.length : indexMap.get(lastKey)[indexForArrayValue + leapIndex];
            }
            else {
                firstVal = indexMap.get(firstKey)
                lastVal =  lastKey === 'undefined' || lastKey === null ?
                    this.messageBuffer.length : 
                    Array.isArray(indexMap.get(lastKey)) ? indexMap.get(lastKey)[indexForArrayValue] :
                    indexMap.get(lastKey);
            }

            return this.messageBuffer.slice(firstVal, lastVal)
        }

        let getBuffer = () => {
            let messagePartBufferIndexMap = new Map()
            let messagePartIndexMap = getMessagePartIndexes();

            messagePartBufferIndexMap.set(MessagePart.MESSAGE,
                getBufferBetweenIndexes(messagePartIndexMap, MessagePart.MESSAGE, MessagePart.VERSION));
            messagePartBufferIndexMap.set(MessagePart.VERSION,
                getBufferBetweenIndexes(messagePartIndexMap, MessagePart.VERSION, MessagePart.COMMUNITYSTRING));
            messagePartBufferIndexMap.set(MessagePart.COMMUNITYSTRING,
                getBufferBetweenIndexes(messagePartIndexMap, MessagePart.COMMUNITYSTRING, MessagePart.PDU));
            messagePartBufferIndexMap.set(MessagePart.PDU,
                getBufferBetweenIndexes(messagePartIndexMap, MessagePart.PDU, MessagePart.REQUESTID));
            messagePartBufferIndexMap.set(MessagePart.REQUESTID,
                getBufferBetweenIndexes(messagePartIndexMap, MessagePart.REQUESTID, MessagePart.ERROR));
            messagePartBufferIndexMap.set(MessagePart.ERROR,
                getBufferBetweenIndexes(messagePartIndexMap, MessagePart.ERROR, MessagePart.ERRORINDEX));
            messagePartBufferIndexMap.set(MessagePart.ERRORINDEX,
                getBufferBetweenIndexes(messagePartIndexMap, MessagePart.ERRORINDEX, MessagePart.VARBINDLIST));
            messagePartBufferIndexMap.set(MessagePart.VARBINDLIST,
                getBufferBetweenIndexes(messagePartIndexMap, MessagePart.VARBINDLIST, MessagePart.VARBIND, 0));
            
            for (let i = 0; i < messagePartIndexMap.get(MessagePart.VARBIND).length; i++) {
                
                let nextPart = (i + 1) == messagePartIndexMap.get(MessagePart.VARBIND).length 
                    ? null : MessagePart.VARBIND;
                
                if(i===0) { 

                    messagePartBufferIndexMap.set(MessagePart.VARBIND,
                        [getBufferBetweenIndexes(messagePartIndexMap, MessagePart.VARBIND, MessagePart.OID, i)]);
                    messagePartBufferIndexMap.set(MessagePart.OID,
                        [getBufferBetweenIndexes(messagePartIndexMap, MessagePart.OID, MessagePart.VALUE, i)]);
                    messagePartBufferIndexMap.set(MessagePart.VALUE,
                        [getBufferBetweenIndexes(messagePartIndexMap, MessagePart.VALUE, nextPart, i)]);
                    }
                else {        
                
                    messagePartBufferIndexMap.get(MessagePart.VARBIND).push(
                        getBufferBetweenIndexes(messagePartIndexMap, MessagePart.VARBIND, MessagePart.OID, i));
                    messagePartBufferIndexMap.get(MessagePart.OID).push(
                        getBufferBetweenIndexes(messagePartIndexMap, MessagePart.OID, MessagePart.VALUE, i));
                    messagePartBufferIndexMap.get(MessagePart.VALUE).push(
                        getBufferBetweenIndexes(messagePartIndexMap, MessagePart.VALUE, nextPart, i));

                }
            }

            return messagePartBufferIndexMap;
        }

        return getBuffer();
    }
}

class SnmpVersion extends SnmpMessagePart {
    constructor(messageBuffer) {
        super(messageBuffer[MessagePartBytes.TYPE], messageBuffer[MessagePartBytes.LENGTH], messageBuffer.slice(MessagePartBytes.VALUE));
    }
}

class CommunityString extends SnmpMessagePart {
    constructor(messageBuffer) {
        super(messageBuffer[MessagePartBytes.TYPE], messageBuffer[MessagePartBytes.LENGTH], messageBuffer.slice(MessagePartBytes.VALUE));
    }
}

class SnmpPdu extends SnmpMessagePart {
    constructor(messageBuffer) {
        super(messageBuffer[MessagePartBytes.TYPE], messageBuffer[MessagePartBytes.LENGTH], messageBuffer.slice(MessagePartBytes.VALUE));
    }
}

class RequestId extends SnmpMessagePart {
    constructor(messageBuffer) {
        super(messageBuffer[MessagePartBytes.TYPE], messageBuffer[MessagePartBytes.LENGTH], messageBuffer.slice(MessagePartBytes.VALUE));
    }
}

class Error extends SnmpMessagePart {
    constructor(messageBuffer) {
        super(messageBuffer[MessagePartBytes.TYPE], messageBuffer[MessagePartBytes.LENGTH], messageBuffer.slice(MessagePartBytes.VALUE));
    }
}

class ErrorIndex extends SnmpMessagePart {
    constructor(messageBuffer) {
        super(messageBuffer[MessagePartBytes.TYPE], messageBuffer[MessagePartBytes.LENGTH], messageBuffer.slice(MessagePartBytes.VALUE));
    }
}

class VarbindList extends SnmpMessagePart {
    constructor(messageBuffer) {
        super(messageBuffer[MessagePartBytes.TYPE], messageBuffer[MessagePartBytes.LENGTH], messageBuffer.slice(MessagePartBytes.VALUE));
    }
}

class Varbind extends SnmpMessagePart {
    constructor(messageBuffer) {
        super(messageBuffer[MessagePartBytes.TYPE], messageBuffer[MessagePartBytes.LENGTH], messageBuffer.slice(MessagePartBytes.VALUE));
    }
}

class ObjectIdentifier extends SnmpMessagePart {
    constructor(messageBuffer) {
        super(messageBuffer[MessagePartBytes.TYPE], messageBuffer[MessagePartBytes.LENGTH], messageBuffer.slice(MessagePartBytes.VALUE));
    }
}

class SnmpValue extends SnmpMessagePart {
    constructor(messageBuffer) {
        super(messageBuffer[MessagePartBytes.TYPE], messageBuffer[MessagePartBytes.LENGTH], messageBuffer.slice(MessagePartBytes.VALUE));
    }
}
const _SnmpValue = SnmpValue
export { SnmpMessage, _SnmpValue as SnmpValue }