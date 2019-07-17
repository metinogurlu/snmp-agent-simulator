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
            this.processMessage(rinfo, msg);
            //var responseMessage = new Buffer.from([0xbc, 0x30, 0x5b, 0xd6, 0xf9, 0x6c, 0x78, 0xca, 0x83, 0xaf, 0xff, 0xaa, 0x08, 0x00, 0x45, 0x00, 0x00, 0x65, 0x30, 0xfd, 0x40, 0x00, 0x40, 0x11, 0x85, 0xe3, 0xc0, 0xa8, 0x01, 0x3e, 0xc0, 0xa8, 0x01, 0x19, 0x00, 0xa1, 0xe0, 0x5b, 0x00, 0x51, 0x3c, 0xed, 0x30, 0x47, 0x02, 0x01, 0x00, 0x04, 0x0d, 0x73, 0x6d, 0x61, 0x72, 0x74, 0x70, 0x61, 0x63, 0x6b, 0x72, 0x65, 0x61, 0x64, 0xa2, 0x33, 0x02, 0x04, 0x0d, 0x01, 0xf1, 0x23, 0x02, 0x01, 0x00, 0x02, 0x01, 0x00, 0x30, 0x25, 0x30, 0x23, 0x06, 0x08, 0x2b, 0x06, 0x01, 0x02, 0x01, 0x01, 0x01, 0x00, 0x04, 0x17, 0x45, 0x58, 0x41, 0x47, 0x41, 0x54, 0x45, 0x20, 0x7c, 0x20, 0x53, 0x59, 0x53, 0x47, 0x55, 0x41, 0x52, 0x44, 0x20, 0x33, 0x30, 0x30, 0x31]);
            //this.server.send(responseMessage, rinfo.port, rinfo.address, (err, errbytes) => console.log(err));
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
        console.log(getResponseMessage.request)
    }
}

class Device {
    constructor(deviceName)
    {
        this.deviceName = deviceName
        this.GetDeviceConfig();
    }

    GetDeviceConfig() {
        let device;
        let fileName = `../devices/${this.deviceName}.json`;
        fs.readFile(fileName, 'utf8', (err, data) => {
            if(err)
                throw err;
            device = JSON.parse(data);
        });

        //console.log(device);
    }
}

exports.Agent = Agent;
exports.Device = Device;