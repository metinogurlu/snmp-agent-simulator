const dgram = require('dgram');
const GetRequestMessage = require('../messaging/get-request-message.js').GetRequestMessage
const GetResponseMessage = require('../messaging/get-response-message.js').GetResponseMessage
const ObjectIdentifier = require('../messaging/object-identifier.js').ObjectIdentifier
const Device = require('./device').Device
const Tag = require('./tag').Tag

class Agent {
    constructor(deviceName, port){
        this.deviceName = deviceName;
        this.port = port;
        this.server = dgram.createSocket('udp4')
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
        let getRequestMessage = new GetRequestMessage(rinfo.address, rinfo.port, binaryMessage);
        let tag = this.device.tags.find(t => t.oid === getRequestMessage.oid.oidString)
        console.log(getRequestMessage);
        
        let getResponseMessage = new GetResponseMessage(getRequestMessage, tag.GetNextValue());
        
        console.log(Buffer.from(getResponseMessage.request))

        return new Buffer.from(getResponseMessage.request)
    }
}

exports.Agent = Agent;