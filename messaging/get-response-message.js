const SnmpMessage = require('./snmp-message').SnmpMessage
const PrimitiveDataType = require('./constants').PrimitiveDataType
const asn1js = require('asn1js')

class GetResponseMessage extends SnmpMessage {
    constructor(responseMessage, value, dataType) {
        super(responseMessage.ip, responseMessage.port, responseMessage.version, responseMessage.communityString,
             responseMessage.oid, null, responseMessage.requestId)
        this.dataType = dataType
        this.request;
    }

    get request() {
        var v =  [PrimitiveDataType.OCTETSTRING] 
            .concat(Array.from('ahmet', x => x.charCodeAt(0).toString(16)))
            .concat()

        var asnpoid =  new asn1js.LocalObjectIdentifierValueBlock();
        
        console.log(asnpoid);
    }

    get valueArray() {
        Array.from('ahmet', x => x.charCodeAt(0).toString(16))
    }

    // get oidArray() {
    //     Array.from(this.oid.split))
    // }
}


exports.GetResponseMessage = GetResponseMessage