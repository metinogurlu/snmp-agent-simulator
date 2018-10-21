const snmpDescriptive = require("./snmp-message-descriptive");
const rawMessageBuilder = require("./raw-message")

let rawMessage = new rawMessageBuilder.RawMessage();
let descriptive = new snmpDescriptive.SnmpMessageDescriptive();

const SnmpMessagePart = {
    MESSAGE : 0,
    VERSION : 1,
    COMMUNITYSTRING : 2,
    PDU : 3,
    REQUESTID : 4,
    ERROR : 5, 
    ERRORINDEX : 6,
    VARBINDLIST : 7,
    VARBIND : 8,
    OID : 9,
    VALUE : 10
}

class SnmpMessage {

    constructor(message) {
        this.validateMessage(message);
        this.decomposeMessage(message);
        this.resolveMessage(message);
    }

    validateMessage(msg) {

        if(msg == null)
            throw new Error("Snmp message should not be null");

        if(!Buffer.isBuffer(msg))
            throw new TypeError("Snmp message value should be a Buffer");
    }

    decomposeMessage(message) {
                
        let step = SnmpMessagePart.MESSAGE
        let firstByteIndexOfNextSection = 2
        let splittedMessage = [[]]
        let dontConsiderThisSections = [SnmpMessagePart.MESSAGE, SnmpMessagePart.PDU, SnmpMessagePart.VARBINDLIST, SnmpMessagePart.VARBIND]

        for(var i = 0; i < message.length; i++) {
            
            if(i >= firstByteIndexOfNextSection && step < SnmpMessagePart.VALUE) {
                
                firstByteIndexOfNextSection = dontConsiderThisSections.includes(step + 1)
                    ? (i + 2)
                    : firstByteIndexOfNextSection = (i + 2) + message[i + 1];                

                splittedMessage[++step] = [];
            }

            splittedMessage[step].push(message[i])
        }

        console.log(splittedMessage);
    }

    resolveMessage(message) {
        this.version = rawMessage.version[rawMessage.version.length - 1]
        this.communityString = new Buffer.from(rawMessage.communityString).toString('utf8', 2)
        this.pduType = new Buffer.from(rawMessage.snmpPdu).toString('hex', 0, 1)
        this.oid = new Buffer.from(rawMessage.objectIdentifier).toString('utf8', 3, rawMessage.objectIdentifier.length)
    } 

    toString() {

    }
}

exports.SnmpMessage = SnmpMessage;