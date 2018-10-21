class RawMessage {
    constructor() {
        this.message = "";    
        this.snmpMessage = [];
        this.version = [];
        this.communityString = [];
        this.snmpPdu = [];
        this.requestId = [];
        this.error = [];
        this.errorIndex = [];
        this.varBindList = [];
        this.varBind = [];
        this.objectIdentifier = [];
        this.value = [];
    }
}

exports.RawMessage = RawMessage;