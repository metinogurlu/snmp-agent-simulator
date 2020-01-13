import { SnmpMessage } from '../messaging/snmp-message.mjs';
import SnmpMessageResolver from '../messaging/snmp-message-resolver.mjs'
import { GetResponseMessage } from '../messaging/get-response-message.mjs'
import { createSocket } from 'dgram';
import { Device } from './device.mjs';

export default class Agent {
    constructor(deviceName, port){
        this.deviceName = deviceName;
        this.port = port;
        this.server = createSocket('udp4')
        this.setServerEvents();
        this.device = new Device(deviceName)
    }

    setServerEvents() {

        this.server.on('error', (err) => {
            console.log(`server error:\n${err.stack}`);
            server.close();
        });

        this.server.on('message', (msg, rinfo) => {
            let getResponseMessage = this.getResponseMessage(rinfo, msg);
            this.server.send(getResponseMessage.responseBuffer, rinfo.port, rinfo.address, (err, errbytes) => { if(err === undefined) console.log(err) });
            console.log(this.getResponseString(rinfo, getResponseMessage))
            // console.log([...getResponseMessage.responseBuffer].map(item => item.toString(16)).join(' '));
        });

        this.server.on('listening', () => {
            const address = this.server.address();
            console.log(`server listening ${address.address}:${address.port}`);
        });

        this.server.bind(this.port, process.env.hostIp);
    }
    

    getResponseMessage(rinfo, binaryMessage) {        
        let getRequestMessage = new SnmpMessage(binaryMessage);
        let resolver = new SnmpMessageResolver(getRequestMessage)
        let oidValueMap = new Map();
        
        resolver.oids.forEach(oid => {
            let valueOfOid = this.device.tags.find(t => t.oid === oid.oidString).GetNextValue();
            oidValueMap.set(oid, valueOfOid)
        });

        return new GetResponseMessage(getRequestMessage, oidValueMap);
    }

    getResponseString(rinfo, responseMessage) {
        let oidValues = [...responseMessage.oidValueMap.entries()]
            .map(item => ({ oid: item[0].oidString, value: item[1]}));
        let responseJson = {
            deviceName: this.deviceName,
            port: this.port,
            ip: rinfo.address,
            response: oidValues
        }

        return responseJson;
    }
}