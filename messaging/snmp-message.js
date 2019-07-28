class SnmpMessage {
    constructor(ip, port, version, communityString, oid, value, requestId) {
        this.ip = ip
        this.port = port
        this.version = version
        this.communityString = communityString
        this.oid = oid
        this.value = value
        this.requestId = requestId
    }
}

exports.SnmpMessage = SnmpMessage