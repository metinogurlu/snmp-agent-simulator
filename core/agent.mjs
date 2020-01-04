import { SnmpMessage } from '../messagingv2/snmp-message.mjs';
import SnmpMessageResolver from '../messagingv2/snmp-message-resolver.mjs'
import { GetResponseMessagev2 } from '../messagingv2/get-response-message.mjs'
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
            let getResponseMessage = this.processMessage(rinfo, msg);
            this.server.send(getResponseMessage, rinfo.port, rinfo.address, (err, errbytes) => { if(err === undefined) console.log(err) });
        });

        this.server.on('listening', () => {
            const address = this.server.address();
            console.log(`server listening ${address.address}:${address.port}`);
        });

        this.server.bind(this.port);
    }

    processMessage(rinfo, binaryMessage) {        
        let getRequestMessage = new SnmpMessage(binaryMessage);
        let resolver = new SnmpMessageResolver(getRequestMessage)
        let tag = this.device.tags.find(t => t.oid === resolver.oid.oidString)
        
        let responseMessage = new GetResponseMessagev2(getRequestMessage, tag.GetNextValue());

        return responseMessage.responseBuffer;
    }

    processMessage_old(rinfo, binaryMessage) {        
        let getRequestMessage = new GetRequestMessage(rinfo.address, rinfo.port, binaryMessage);
        let tag = this.device.tags.find(t => t.oid === getRequestMessage.oid.oidString)
        
        let getResponseMessage = new GetResponseMessage(getRequestMessage, tag.GetNextValue());

        return new Buffer.from(getResponseMessage.request)
    }
}