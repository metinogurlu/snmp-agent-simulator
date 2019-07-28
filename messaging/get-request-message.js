const RawMessage = require("./raw-message").RawMessage
const SnmpMessage = require('./snmp-message').SnmpMessage
const ObjectIdentifier = require('./object-identifier').ObjectIdentifier
let constants = require('./constants')

let MessagePart = constants.MessagePart;

class GetRequestMessage extends SnmpMessage {

  constructor(ip, port, messageBuffer) {
    super(ip, port)
    
    this.messageBuffer = messageBuffer
    
    this.decomposeMessage()
    this.resolveMessage();
  }

  //TODO: daha anlaşılır hale getir.
  decomposeMessage() {
    
    let step = MessagePart.MESSAGE
    let firstByteIndexOfNextSection = 2
    let splittedMessage = [[]]
    let dontConsiderThisSections = [MessagePart.MESSAGE, MessagePart.PDU, MessagePart.VARBINDLIST, MessagePart.VARBIND]

    for (var i = 0; i < this.messageBuffer.length; i++) {

      if (i >= firstByteIndexOfNextSection && step < MessagePart.VALUE) {

        firstByteIndexOfNextSection = dontConsiderThisSections.includes(step + 1) ?
          (i + 2) :
          firstByteIndexOfNextSection = (i + 2) + this.messageBuffer[i + 1];

        splittedMessage[++step] = [];
      }
      
      splittedMessage[step].push(this.messageBuffer[i])
    }

    this.rawMessage = new RawMessage(splittedMessage);
    
    return splittedMessage;
  }

  resolveMessage() {

    this.version = this.rawMessage.version[this.rawMessage.version.length - 1] + 1;
    this.communityString = new Buffer.from(this.rawMessage.communityString).toString('utf8', 2);
    this.oid = new ObjectIdentifier(this.rawMessage.objectIdentifier.slice(2));
    this.snmpValue = this.rawMessage.value.slice(2).toString();
    this.requestId = this.rawMessage.requestId
  }

  toString() {
    return this;
  }
}

exports.GetRequestMessage = GetRequestMessage;
