import { SnmpMessage } from '../messagingv2/snmp-message.mjs';
import { createSocket } from 'dgram';
import { GetRequestMessage } from '../messaging/get-request-message.mjs';
import { GetResponseMessage } from '../messaging/get-response-message.mjs';
import { ObjectIdentifier } from '../messaging/object-identifier.mjs';
import { Device } from './device.mjs';
import { Tag } from './tag.mjs';

class Agent {
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
            var message = new SnmpMessage(msg);
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
        let getRequestMessage = new GetRequestMessage(rinfo.address, rinfo.port, binaryMessage);
        let tag = this.device.tags.find(t => t.oid === getRequestMessage.oid.oidString)
        
        let getResponseMessage = new GetResponseMessage(getRequestMessage, tag.GetNextValue());

        return new Buffer.from(getResponseMessage.request)
    }
}

export { Agent };