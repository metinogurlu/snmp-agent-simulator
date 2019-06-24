const snmpDescriptive = require("./snmp-message-descriptive");
const rawMessageBuilder = require("./raw-message")
let constants = require('./constants')

let rawMessage = new rawMessageBuilder.RawMessage();
let descriptive = new snmpDescriptive.SnmpMessageDescriptive();
let MessagePart = constants.MessagePart;
let MessageType = constants.MessageType;

class SnmpMessage {

  constructor(ip, port, message) {
    this.ip = ip;
    this.port = port;
    this.validateMessage(message);
    this.resolveMessage(this.decomposeMessage(message));
  }

  validateMessage(msg) {

    if (msg == null)
      throw new Error("Snmp message should not be null");

    if (!Buffer.isBuffer(msg))
      throw new TypeError("Snmp message value should be a Buffer");
  }

  decomposeMessage(message) {

    let step = MessagePart.MESSAGE
    let firstByteIndexOfNextSection = 2
    let splittedMessage = [[]]
    let dontConsiderThisSections = [MessagePart.MESSAGE, MessagePart.PDU, MessagePart.VARBINDLIST, MessagePart.VARBIND]

    for (var i = 0; i < message.length; i++) {

      if (i >= firstByteIndexOfNextSection && step < MessagePart.VALUE) {

        firstByteIndexOfNextSection = dontConsiderThisSections.includes(step + 1) ?
          (i + 2) :
          firstByteIndexOfNextSection = (i + 2) + message[i + 1];

        splittedMessage[++step] = [];
      }

      splittedMessage[step].push(message[i])
    }

    return splittedMessage;
  }

  resolveMessage(message) {
    
    rawMessage.message = message[MessagePart.MESSAGE];
    rawMessage.version = message[MessagePart.VERSION];
    rawMessage.communityString = message[MessagePart.COMMUNITYSTRING]
    rawMessage.snmpPdu = message[MessagePart.PDU]
    rawMessage.requestId = message[MessagePart.REQUESTID]
    rawMessage.error = message[MessagePart.ERROR];
    rawMessage.errorIndex = message[MessagePart.ERRORINDEX]
    rawMessage.varBindList = message[MessagePart.VARBINDLIST];
    rawMessage.varBind = message[MessagePart.VARBIND];
    rawMessage.objectIdentifier = message[MessagePart.OID];
    rawMessage.value = message[MessagePart.VALUE];

    this.version = rawMessage.version[rawMessage.version.length - 1] + 1;
    this.communityString = new Buffer.from(rawMessage.communityString).toString('utf8', 2);
    this.oid = ".1.3." + rawMessage.objectIdentifier.slice(3).join('.');
    this.snmpValue = rawMessage.value.slice(2).toString();
  }

  toString() {
    return this;
  }
}

exports.RawMessage = rawMessage;
exports.SnmpMessage = SnmpMessage;
