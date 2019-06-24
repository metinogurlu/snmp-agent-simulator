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
  
  const MessageType = {
    SEQUENCE: 0x30,
    GETREQUEST: 0xA0,
    GETRESPONSE: 0xA2,
    SETREQUEST: 0xA3
  }

  exports.MessagePart = MessagePart;
  exports. MessageType = MessageType;