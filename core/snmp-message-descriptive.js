class MessagePart {
    constructor(first, last) {
        this.first = first;
        this.last = last;
    }
}
class SnmpMessageDescriptive {
    
    constructor() {
        this.snmpMessage = new MessagePart(0,1);
        this.version = new MessagePart(2,4);
        this.communityString = new MessagePart(5,13);
        this.snmpPdu = new MessagePart(14,15);
        this.requestId =new MessagePart(16,18);
        this.error = new MessagePart(19,21);
        this.errorIndex = new MessagePart(22,24);
        this.varBindList = new MessagePart(25,26);
        this.varBind = new MessagePart(27,28);
        this.objectIdentifier = new MessagePart(29,43);
        this.value = new MessagePart(44,45);
    }

    isSnmpMessage(messageIndex) {
        return messageIndex >= this.snmpMessage.first && messageIndex <= this.snmpMessage.last;
    }

    isVersion(messageIndex) {
        return messageIndex >= this.version.first && messageIndex <= this.version.last;
    }

    isCommunityString(messageIndex) {
        return messageIndex >= this.communityString.first && messageIndex <= this.communityString.last;
    }

    isSnmpPdu(messageIndex) {
        return messageIndex >= this.snmpPdu.first && messageIndex <= this.snmpPdu.last;
    }

    isRequestId(messageIndex) {
        return messageIndex >= this.requestId.first && messageIndex <= this.requestId.last;
    }

    isError(messageIndex) {
        return messageIndex >= this.error.first && messageIndex <= this.error.last;
    }

    isErrorIndex(messageIndex) {
        return messageIndex >= this.errorIndex.first && messageIndex <= this.errorIndex.last;
    }

    isVarBindList(messageIndex) {
        return messageIndex >= this.varBindList.first && messageIndex <= this.varBindList.last;
    }

    isVarBind(messageIndex) {
        return messageIndex >= this.varBind.first && messageIndex <= this.varBind.last;
    }

    isObjectIdentifier(messageIndex) {
        return messageIndex >= this.objectIdentifier.first && messageIndex <= this.objectIdentifier.last
    }

    isValue(messageIndex) {
        return messageIndex >= this.value.first && messageIndex <= this.value.last;
    }
}

exports.SnmpMessageDescriptive = SnmpMessageDescriptive;

