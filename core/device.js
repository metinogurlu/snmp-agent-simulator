const fs = require('fs');
var path = require('path');
const Tag = require('./tag').Tag
class Device {
    constructor(deviceName)
    {
        this.deviceName = deviceName
        
        //TODO: boş tag ataması hatalı sonuçlanabilir, ihtiyaç kalmadığında değiştir.
        this.tags = [new Tag()]
        this.tags.pop()
        let config = this.GetDeviceConfig();
        for (let i = 0; i < config.oids.length; i++) {
            this.tags.push(new Tag(config.oids[i]));
        }
    }

    GetDeviceConfig() {
        let fileName = `/home/met/projects/snmp-agent-simulator/devices/${this.deviceName}.json`;
        return JSON.parse(fs.readFileSync(fileName))
    }
}
exports.Device = Device


// const fs = require('fs');
// fs.readFile("/home/met/projects/snmp-agent-simulator/devices/exagate-pdu.json", 'utf8', (err, data) => {
//     if(err)
//         throw err;
//     console.log(JSON.parse(data));
// });
        // let fileSystem = require('fs');
        // this.device;
        // this.deviceName = "exagate-pdu"
        // let fileName = `./../devices/${this.deviceName}.json`;
        // //let fileName = "/home/met/projects/snmp-agent-simulator/devices/exagate-pdu.json"
        // let fileName2 = __dirname + "/test.json"
        // console.log(fileName2)
        // this.device = fileSystem.readFileSync(fileName)
        // // fileSystem.readFile(fileName, 'utf8', (err, data) => {
        // //     if(err)
        // //         throw err;
        // //         this.device = JSON.parse(data);
        // // });
        // console.log(this.device)

// var path = require('path');
// console.log(path.resolve("../devices", "exagate-pdu.json"))
// console.log(path.dirname('../devices/exagate-pdu.json'));
// console.log(path.relative('../devices/exagate-pdu.json'));
// console.log(path.posix.basename('../devices/exagate-pdu.json'));