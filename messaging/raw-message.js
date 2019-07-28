let constants = require('./constants')
let MessagePart = constants.MessagePart;
class RawMessage {
    constructor(message) {
        this.createRawMessage(message);
    }

    createRawMessage(message) {
        this.message = message[MessagePart.MESSAGE]
        this.version = message[MessagePart.VERSION]
        this.communityString = message[MessagePart.COMMUNITYSTRING]
        this.snmpPdu = message[MessagePart.PDU]
        this.requestId = message[MessagePart.REQUESTID]
        this.error = message[MessagePart.ERROR]
        this.errorIndex = message[MessagePart.ERRORINDEX]
        this.varBindList = message[MessagePart.VARBINDLIST]
        this.varBind = message[MessagePart.VARBIND]
        this.objectIdentifier = message[MessagePart.OID]
        this.value = message[MessagePart.VALUE]
    }
}

exports.RawMessage = RawMessage;