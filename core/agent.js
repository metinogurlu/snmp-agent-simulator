let dgram = require('dgram');
let fs = require('fs');
let snmpMessage = require('./snmp-message')

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
        });

        this.server.on('listening', () => {
            const address = this.server.address();
            console.log(`server listening ${address.address}:${address.port}`);
        });

        this.server.bind(this.port);
    }

    processMessage(rinfo, binaryMessage) {
        let message = new snmpMessage.SnmpMessage(rinfo.address, rinfo.port, binaryMessage);
        console.log(message.toString());
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