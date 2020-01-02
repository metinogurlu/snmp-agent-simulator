const SnmpMessage = require('./snmp-message').SnmpMessage
const Constants = require('./constants')

const PrimitiveDataType = Constants.PrimitiveDataType
const ComplexDataType = Constants.ComplexDataType

class GetResponseMessage extends SnmpMessage {
    constructor(requestMessage, value, dataType) {
        super(requestMessage.ip, requestMessage.port, requestMessage.version, requestMessage.communityString,
             requestMessage.oid, null, requestMessage.requestId)
        this.dataType = dataType
        this.value = value;
    }

    get snmpValue() {
        var valueStr = this.value.toString(16)
        
        if(this.value > 127 && this.value < 256)
            valueStr = "00" + valueStr
        
        if(valueStr.length % 2)
            valueStr = "0" + valueStr
        var valueArr = []
        
        for (let index = 0; index <= valueStr.length - 2; index += 2) {
            valueArr.push(parseInt(valueStr.slice(index, index + 2), 16))
        }

        let returnValue = valueArr
        let returnType = PrimitiveDataType.INTEGER
        let length = returnValue.length
        return [].concat(returnType, length, returnValue)
    }

    get objectIdentifier() {
        let returnValue = this.oid.encodedOid
        let returnType = PrimitiveDataType.OBJECTIDENTIFIER
        let length = returnValue.length
        return [].concat(returnType, length, returnValue)
    }

    get varbindList() {
        let objectIdentifier = this.objectIdentifier
        let snmpValue = this.snmpValue
        let varbind = [].concat(ComplexDataType.SEQUENCE,
            objectIdentifier.length + snmpValue.length + 2,
            objectIdentifier, snmpValue)
        let varbindList = [].concat(ComplexDataType.SEQUENCE,
            varbind.length + 2, varbind)

        return varbindList
    }

    get errorIndex() {
        return [PrimitiveDataType.INTEGER, 1, 0]
    }

    get error() {
        return [PrimitiveDataType.INTEGER, 1, 0]
    }

    get getRequestId() {
        return [].concat(PrimitiveDataType.INTEGER, 
            this.requestId.length, this.requestId)
    }

    get request() {
        let version = this.snmpVersion
        let oid = this.objectIdentifier
        let snmpPdu = this.snmpPdu
        let requestLength = version.length + oid.length + snmpPdu.length
        return [].concat(ComplexDataType.SEQUENCE, requestLength,
            version, oid, snmpPdu) 
    }

    get snmpPdu() {
        let varbindList = this.varbindList
        let errorIndex = this.errorIndex
        let error = this.error
        let requestId = this.requestId
        let snmpPduLength = varbindList.length + errorIndex.length + error.length + 
            requestId.length + 2
        return [].concat(ComplexDataType.GETRESPONSE, snmpPduLength,
            requestId, error, errorIndex, varbindList)
    }

    get snmpVersion() {
        return [this.version, 1, 0]
    }
    
    GetOid() {
        return this.oid.encodedOid
    }
    toString() {
        return this;
    }
}


exports.GetResponseMessage = GetResponseMessage