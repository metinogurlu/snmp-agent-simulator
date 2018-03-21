class SnmpMessage {

    constructor(message) {
        this.validateMessage(message);

        this._message = message;    
        this._snmpMessage = [];
        this._version = [];
        this._communityString = [];
        this._snmpPdu = [];
        this._requestId = [];
        this._error = [];
        this._errorIndex = [];
        this._varBindList = [];
        this._varBind = [];
        this._objectIdentifier = [];
        this._value = [];

        this.resolveMessage();
    }

    resolveMessage() {
        this._message.forEach((value, i) => {
            let snmpMessagePart = new SnmpMessagePart();
            if(snmpMessagePart.isSnmpMessage(i))
                this._snmpMessage.push(value);
            else if(snmpMessagePart.isVersion(i))
                this._version.push(value);
            else if(snmpMessagePart.isCommunityString(i))
                this._communityString.push(value);
            else if(snmpMessagePart.isSnmpPdu(i))
                this._snmpPdu.push(value);
            else if(snmpMessagePart.isRequestId(i))
                this._requestId.push(value);
            else if(snmpMessagePart.isError(i))
                this._error.push(value);
            else if(snmpMessagePart.isErrorIndex(i))
                this._errorIndex.push(value);
            else if(snmpMessagePart.isVarBindList(i))
                this._varBindList.push(value);
            else if(snmpMessagePart.isVarBind(i))
                this._varBind.push(value);
            else if(snmpMessagePart.isObjectIdentifier(i))
                this._objectIdentifier.push(value);
            else if(snmpMessagePart.isValue(i))
                this._value.push(value);
        });
    }

    validateMessage(msg) {

        if(msg == null)
            throw new Error("Snmp message should not be null");

        if(!Array.isArray(msg))
            throw new TypeError("Snmp message value should be array");
    }

    toString() {
        let fullMessage = '';
        fullMessage = fullMessage.concat(
            'Snmp Message : ' + this._snmpMessage + '\n\r',
            'Version : ' + this._version + '\n\r',
            'Community : ' + this._communityString + '\n\r',
            'Snmp PDU : ' + this._snmpPdu + '\n\r',
            'RequestId : ' + this._requestId + '\n\r',
            'Error : ' + this._error + '\n\r',
            'Error Index : ' + this._errorIndex + '\n\r',
            'Varbind List : ' + this._varBindList + '\n\r',
            'Varbind : ' + this._varBind + '\n\r',
            'OID : ' + this._objectIdentifier + '\n\r',
            'Value : ' + this._value);
        return fullMessage;
    }
}

class MessagePart {
    constructor(first, last) {
        this.first = first;
        this.last = last;
    }

    get First() {
        return this.first;
    }

    get Last() {
        return this.last;
    }
}

class SnmpMessagePart {
    
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
        if(messageIndex >= this.snmpMessage.First && messageIndex <= this.snmpMessage.Last)
            return true;
        else
            return false;
    }

    isVersion(messageIndex) {
        if(messageIndex >= this.version.First && messageIndex <= this.version.Last)
            return true;
        else
            return false;
    }

    isCommunityString(messageIndex) {
        if(messageIndex >= this.communityString.First && messageIndex <= this.communityString.Last)
            return true;
        else
            return false;
    }

    isSnmpPdu(messageIndex) {
        if(messageIndex >= this.snmpPdu.First && messageIndex <= this.snmpPdu.Last)
            return true;
        else
            return false;
    }

    isRequestId(messageIndex) {
        if(messageIndex >= this.requestId.First && messageIndex <= this.requestId.Last)
            return true;
        else
            return false;
    }

    isError(messageIndex) {
        if(messageIndex >= this.error.First && messageIndex <= this.error.Last)
            return true;
        else
            return false;
    }

    isErrorIndex(messageIndex) {
        if(messageIndex >= this.errorIndex.First && messageIndex <= this.errorIndex.Last)
            return true;
        else
            return false;
    }

    isVarBindList(messageIndex) {
        if(messageIndex >= this.varBindList.First && messageIndex <= this.varBindList.Last)
            return true;
        else
            return false;
    }

    isVarBind(messageIndex) {
        if(messageIndex >= this.varBind.First && messageIndex <= this.varBind.Last)
            return true;
        else
            return false;
    }

    isObjectIdentifier(messageIndex) {
        if(messageIndex >= this.objectIdentifier.First && messageIndex <= this.objectIdentifier.Last)
            return true;
        else
            return false;
    }

    isValue(messageIndex) {
        if(messageIndex >= this.value.First && messageIndex <= this.value.Last)
            return true;
        else
            return false;
    }
}

exports.SnmpMessage = SnmpMessage;