const dgram = require('dgram');
const fs = require('fs');
const GetRequestMessage = require('../messaging/get-request-message.js').GetRequestMessage
const GetResponseMessage = require('../messaging/get-response-message.js').GetResponseMessage

class Agent {
    constructor(deviceName, port){
        this.deviceName = deviceName;
        this.port = port;
        this.server = dgram.createSocket('udp4')
        this.setServerEvents();
        this.device = new Device(deviceName);
    }

    setServerEvents() {

        this.server.on('error', (err) => {
            console.log(`server error:\n${err.stack}`);
            server.close();
        });

        this.server.on('message', (msg, rinfo) => {
            let getResponseMessage = this.processMessage(rinfo, msg);
            this.server.send(getResponseMessage, rinfo.port, rinfo.address, (err, errbytes) => console.log(err));
        });

        this.server.on('listening', () => {
            const address = this.server.address();
            console.log(`server listening ${address.address}:${address.port}`);
        });

        this.server.bind(this.port);
    }

    processMessage(rinfo, binaryMessage) {
        let getRequestMessage = new GetRequestMessage(rinfo.address, rinfo.port, binaryMessage);
        let getResponseMessage = new GetResponseMessage(getRequestMessage);

        return new Buffer.from(getResponseMessage.request)
    }
}

class Device {
    constructor(deviceName)
    {
        this.deviceName = deviceName
        this.GetDeviceConfig();
    }

    // GetDeviceConfig() {
    //     let device;
    //     let fileName = `../devices/${this.deviceName}.json`;
    //     fs.readFile(fileName, 'utf8', (err, data) => {
    //         if(err)
    //             throw err;
    //         device = JSON.parse(data);
    //     });
    // }
}

exports.Agent = Agent;
exports.Device = Device;