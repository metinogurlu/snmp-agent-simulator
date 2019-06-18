const snmpDescriptive = require("./snmp-message-descriptive");
const rawMessageBuilder = require("./raw-message")

let rawMessage = new rawMessageBuilder.RawMessage();
let descriptive = new snmpDescriptive.SnmpMessageDescriptive();

const SnmpMessagePart = {
  MESSAGE: 0,
  VERSION: 1,
  COMMUNITYSTRING: 2,
  PDU: 3,
  REQUESTID: 4,
  ERROR: 5,
  ERRORINDEX: 6,
  VARBINDLIST: 7,
  VARBIND: 8,
  OID: 9,
  VALUE: 10
}

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

    let step = SnmpMessagePart.MESSAGE
    let firstByteIndexOfNextSection = 2
    let splittedMessage = [[]]
    let dontConsiderThisSections = [SnmpMessagePart.MESSAGE, SnmpMessagePart.PDU, SnmpMessagePart.VARBINDLIST, SnmpMessagePart.VARBIND]

    for (var i = 0; i < message.length; i++) {

      if (i >= firstByteIndexOfNextSection && step < SnmpMessagePart.VALUE) {

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
    
    rawMessage.message = message[SnmpMessagePart.MESSAGE];
    rawMessage.version = message[SnmpMessagePart.VERSION];
    rawMessage.communityString = message[SnmpMessagePart.COMMUNITYSTRING]
    rawMessage.snmpPdu = message[SnmpMessagePart.PDU]
    rawMessage.requestId = message[SnmpMessagePart.REQUESTID]
    rawMessage.error = message[SnmpMessagePart.ERROR];
    rawMessage.errorIndex = message[SnmpMessagePart.ERRORINDEX]
    rawMessage.varBindList = message[SnmpMessagePart.VARBINDLIST];
    rawMessage.varBind = message[SnmpMessagePart.VARBIND];
    rawMessage.objectIdentifier = message[SnmpMessagePart.OID];
    rawMessage.value = message[SnmpMessagePart.VALUE];

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
