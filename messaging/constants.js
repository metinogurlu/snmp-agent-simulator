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
    GETNEXTREQUEST: 0xA1,
    GETRESPONSE: 0xA2,
    SETREQUEST: 0xA3,
    TRAP: 0xA4,
    GETBULKREQUEST: 0xA5,
    INFORMREQUEST: 0xA6,
    SNMPV2TRAP: 0xA7
  }

  const PrimitiveDataType = {
    INTEGER: 0x02,
    OCTETSTRING: 0x04,
    NULL: 0x05,
    OBJECTIDENTIFIER: 0x06,
    IPADDRESS: 0x40,
    COUNTER32: 0x41,
    GAUGE32: 0x42,
    TIMETICKS: 0x43,
    OPAQUE: 0x44,
    COUNTER64: 0x46,
    NOSUCHOBJECT: 0x80,
    NOSUCHINSTANCE: 0x81,
    ENDOFMIBVIEW: 0x82
  }

  exports.MessagePart = MessagePart
  exports.ComplexDataType = ComplexDataType
  exports.PrimitiveDataType = PrimitiveDataType