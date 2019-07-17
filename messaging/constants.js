const MessagePart = {
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
  
  const ComplexDataType = {
    SEQUENCE: 0x30,
    GETREQUEST: 0xA0,
    GETRESPONSE: 0xA2,
    SETREQUEST: 0xA3
  }

  const PrimitiveDataType = {
    INTEGER: 0x02,
    OCTETSTRING: 0x04,
    NULL: 0x05,
    OBJECTIDENTIFIER: 0x06
  }

  exports.MessagePart = MessagePart
  exports.ComplexDataType = ComplexDataType
  exports.PrimitiveDataType = PrimitiveDataType