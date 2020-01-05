import ObjectIdentifier from './object-identifier.mjs'
export default class SnmpMessageResolver {
    constructor(snmpMessage) {
        this.snmpMessage = snmpMessage;
        this.calculateOid();
    }

    calculateOid() {
        this.oids = this.snmpMessage.ObjectIdentifier.map(oid => new ObjectIdentifier([...oid.getValue]));
    }
}