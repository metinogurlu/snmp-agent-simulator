/* eslint-disable max-classes-per-file */
import SnmpMessagePart from './snmp-message-part';
import { MessagePart, MessagePartBytes } from './constants';
import MessageUtil from './message-util';

class SnmpVersion extends SnmpMessagePart {
  constructor(messageBuffer) {
    const seperatedBuffer = MessageUtil.seperateMessagePartBuffer(messageBuffer);
    super(seperatedBuffer.type, seperatedBuffer.length, seperatedBuffer.value);
  }
}

class CommunityString extends SnmpMessagePart {
  constructor(messageBuffer) {
    const seperatedBuffer = MessageUtil.seperateMessagePartBuffer(messageBuffer);
    super(seperatedBuffer.type, seperatedBuffer.length, seperatedBuffer.value);
  }
}

class SnmpPdu extends SnmpMessagePart {
  constructor(messageBuffer) {
    const seperatedBuffer = MessageUtil.seperateMessagePartBuffer(messageBuffer);
    super(seperatedBuffer.type, seperatedBuffer.length, seperatedBuffer.value);
  }
}

class RequestId extends SnmpMessagePart {
  constructor(messageBuffer) {
    const seperatedBuffer = MessageUtil.seperateMessagePartBuffer(messageBuffer);
    super(seperatedBuffer.type, seperatedBuffer.length, seperatedBuffer.value);
  }
}

class SnmpError extends SnmpMessagePart {
  constructor(messageBuffer) {
    const seperatedBuffer = MessageUtil.seperateMessagePartBuffer(messageBuffer);
    super(seperatedBuffer.type, seperatedBuffer.length, seperatedBuffer.value);
  }
}

class ErrorIndex extends SnmpMessagePart {
  constructor(messageBuffer) {
    const seperatedBuffer = MessageUtil.seperateMessagePartBuffer(messageBuffer);
    super(seperatedBuffer.type, seperatedBuffer.length, seperatedBuffer.value);
  }
}

class VarbindList extends SnmpMessagePart {
  constructor(messageBuffer) {
    const seperatedBuffer = MessageUtil.seperateMessagePartBuffer(messageBuffer);
    super(seperatedBuffer.type, seperatedBuffer.length, seperatedBuffer.value);
  }
}

class Varbind extends SnmpMessagePart {
  constructor(messageBuffer) {
    const seperatedBuffer = MessageUtil.seperateMessagePartBuffer(messageBuffer);
    super(seperatedBuffer.type, seperatedBuffer.length, seperatedBuffer.value);
  }
}

class ObjectIdentifier extends SnmpMessagePart {
  constructor(messageBuffer) {
    const seperatedBuffer = MessageUtil.seperateMessagePartBuffer(messageBuffer);
    super(seperatedBuffer.type, seperatedBuffer.length, seperatedBuffer.value);
  }
}

class SnmpValue extends SnmpMessagePart {
  constructor(messageBuffer) {
    const seperatedBuffer = MessageUtil.seperateMessagePartBuffer(messageBuffer);
    super(seperatedBuffer.type, seperatedBuffer.length, seperatedBuffer.value);
  }
}

class SnmpMessage extends SnmpMessagePart {
  constructor(messageBuffer) {
    if ((typeof (messageBuffer) === 'undefined') || (messageBuffer === null)) {
      throw new Error('messageBuffer is null or undefined');
    }

    super(null, null);

    this.messageBuffer = messageBuffer;
    this.splittedBufferByMessagePart = this.getSplittedBuffer();

    // eslint-disable-next-line prefer-destructuring
    this.setType = this.splittedBufferByMessagePart.get(MessagePart.MESSAGE)[0];
    this.setLength = this.splittedBufferByMessagePart.get(MessagePart.MESSAGE)
      .slice([MessagePartBytes.LENGTH]);

    this.SnmpVersion = new SnmpVersion(
      this.splittedBufferByMessagePart.get(MessagePart.VERSION),
    );
    this.CommunityString = new CommunityString(
      this.splittedBufferByMessagePart.get(MessagePart.COMMUNITYSTRING),
    );
    this.SnmpPdu = new SnmpPdu(
      this.splittedBufferByMessagePart.get(MessagePart.PDU),
    );
    this.RequestId = new RequestId(
      this.splittedBufferByMessagePart.get(MessagePart.REQUESTID),
    );
    this.Error = new SnmpError(
      this.splittedBufferByMessagePart.get(MessagePart.ERROR),
    );
    this.ErrorIndex = new ErrorIndex(
      this.splittedBufferByMessagePart.get(MessagePart.ERRORINDEX),
    );
    this.VarbindList = new VarbindList(
      this.splittedBufferByMessagePart.get(MessagePart.VARBINDLIST),
    );

    const variableCount = this.splittedBufferByMessagePart.get(MessagePart.VARBIND).length;

    this.Varbind = []; this.ObjectIdentifier = []; this.SnmpValue = [];

    for (let i = 0; i < variableCount; i += 1) {
      this.Varbind.push(new Varbind(
        this.splittedBufferByMessagePart.get(MessagePart.VARBIND)[i],
      ));
      this.ObjectIdentifier.push(new ObjectIdentifier(
        this.splittedBufferByMessagePart.get(MessagePart.OID)[i],
      ));
      this.SnmpValue.push(new SnmpValue(
        this.splittedBufferByMessagePart.get(MessagePart.VALUE)[i],
      ));
    }
  }


  getSplittedBuffer() {
    const lastValueInMap = (map, lastState) => {
      const lastValue = map.get(lastState);

      return [lastState, Array.isArray(lastValue)
        ? lastValue[lastValue.length - 1] : lastValue];
    };

    const getNextIndex = (map, lastState) => {
      let nextStartIndex = 0;
      let length = 0;
      const ignoredMessageParts = [MessagePart.MESSAGE, MessagePart.PDU,
        MessagePart.VARBINDLIST, MessagePart.VARBIND];
      const [lastMesagePart, lastStartIndex] = lastValueInMap(map, lastState);
      const lengtIndexhOfCurrentPart = lastStartIndex + 1;

      if (ignoredMessageParts.includes(lastMesagePart)) {
        length = (this.messageBuffer[lengtIndexhOfCurrentPart] > 0x80
          ? this.messageBuffer[lengtIndexhOfCurrentPart] % 0x80 : 0) + 1;
      } else {
        length = (this.messageBuffer[lengtIndexhOfCurrentPart] > 0x80
          ? lengtIndexhOfCurrentPart + (this.messageBuffer[lengtIndexhOfCurrentPart] % 0x80)
          : this.messageBuffer[lengtIndexhOfCurrentPart]) + 1;
      }
      nextStartIndex = lengtIndexhOfCurrentPart + length;
      return nextStartIndex;
    };

    const anyMoreVarbind = (map) => getNextIndex(map, MessagePart.VALUE)
        < this.messageBuffer.length;

    const getMessagePartIndexes = () => {
      const messagePartIndexMap = new Map();
      messagePartIndexMap.set(MessagePart.MESSAGE, 0);
      messagePartIndexMap.set(MessagePart.VERSION,
        getNextIndex(messagePartIndexMap, MessagePart.MESSAGE));
      messagePartIndexMap.set(MessagePart.COMMUNITYSTRING,
        getNextIndex(messagePartIndexMap, MessagePart.VERSION));
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
    };

    const getBufferBetweenIndexes = (indexMap, firstKey, lastKey, indexForArrayValue) => {
      const firstAny = indexMap.get(firstKey);
      let firstVal = 0;
      let lastVal = 0;
      let leapIndex = 0;

      // is multiple variable to requested.
      if (firstKey === MessagePart.VALUE && lastKey === MessagePart.VARBIND) {
        leapIndex = 1;
      }

      if (Array.isArray(firstAny)) {
        firstVal = firstAny[indexForArrayValue];
        lastVal = lastKey === 'undefined' || lastKey === null
          ? this.messageBuffer.length : indexMap.get(lastKey)[indexForArrayValue + leapIndex];
      } else {
        firstVal = indexMap.get(firstKey);
        // eslint-disable-next-line no-nested-ternary
        lastVal = lastKey === 'undefined' || lastKey === null
          ? this.messageBuffer.length
          : (Array.isArray(indexMap.get(lastKey)) ? indexMap.get(lastKey)[indexForArrayValue]
            : indexMap.get(lastKey));
      }

      return this.messageBuffer.slice(firstVal, lastVal);
    };

    const getBuffer = () => {
      const messagePartBufferIndexMap = new Map();
      const messagePartIndexMap = getMessagePartIndexes();

      messagePartBufferIndexMap.set(MessagePart.MESSAGE,
        getBufferBetweenIndexes(messagePartIndexMap, MessagePart.MESSAGE, MessagePart.VERSION));
      messagePartBufferIndexMap.set(MessagePart.VERSION,
        getBufferBetweenIndexes(messagePartIndexMap, MessagePart.VERSION,
          MessagePart.COMMUNITYSTRING));
      messagePartBufferIndexMap.set(MessagePart.COMMUNITYSTRING,
        getBufferBetweenIndexes(messagePartIndexMap, MessagePart.COMMUNITYSTRING, MessagePart.PDU));
      messagePartBufferIndexMap.set(MessagePart.PDU,
        getBufferBetweenIndexes(messagePartIndexMap, MessagePart.PDU, MessagePart.REQUESTID));
      messagePartBufferIndexMap.set(MessagePart.REQUESTID,
        getBufferBetweenIndexes(messagePartIndexMap, MessagePart.REQUESTID, MessagePart.ERROR));
      messagePartBufferIndexMap.set(MessagePart.ERROR,
        getBufferBetweenIndexes(messagePartIndexMap, MessagePart.ERROR, MessagePart.ERRORINDEX));
      messagePartBufferIndexMap.set(MessagePart.ERRORINDEX,
        getBufferBetweenIndexes(messagePartIndexMap, MessagePart.ERRORINDEX,
          MessagePart.VARBINDLIST));
      messagePartBufferIndexMap.set(MessagePart.VARBINDLIST,
        getBufferBetweenIndexes(messagePartIndexMap, MessagePart.VARBINDLIST,
          MessagePart.VARBIND, 0));

      for (let i = 0; i < messagePartIndexMap.get(MessagePart.VARBIND).length; i += 1) {
        const nextPart = (i + 1) === messagePartIndexMap.get(MessagePart.VARBIND).length
          ? null : MessagePart.VARBIND;

        if (i === 0) {
          messagePartBufferIndexMap.set(MessagePart.VARBIND,
            [getBufferBetweenIndexes(messagePartIndexMap,
              MessagePart.VARBIND, MessagePart.OID, i)]);
          messagePartBufferIndexMap.set(MessagePart.OID,
            [getBufferBetweenIndexes(messagePartIndexMap, MessagePart.OID, MessagePart.VALUE, i)]);
          messagePartBufferIndexMap.set(MessagePart.VALUE,
            [getBufferBetweenIndexes(messagePartIndexMap, MessagePart.VALUE, nextPart, i)]);
        } else {
          messagePartBufferIndexMap.get(MessagePart.VARBIND).push(
            getBufferBetweenIndexes(messagePartIndexMap, MessagePart.VARBIND, MessagePart.OID, i),
          );
          messagePartBufferIndexMap.get(MessagePart.OID).push(
            getBufferBetweenIndexes(messagePartIndexMap, MessagePart.OID, MessagePart.VALUE, i),
          );
          messagePartBufferIndexMap.get(MessagePart.VALUE).push(
            getBufferBetweenIndexes(messagePartIndexMap, MessagePart.VALUE, nextPart, i),
          );
        }
      }

      return messagePartBufferIndexMap;
    };

    return getBuffer();
  }

  get variableCount() {
    return this.ObjectIdentifier.length;
  }
}

export { SnmpMessage, SnmpValue };
