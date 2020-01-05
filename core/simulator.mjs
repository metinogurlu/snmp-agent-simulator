import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { readFileSync } from 'fs';
import Agent from './agent.mjs';
import dockerHostIp from 'docker-host-ip';

class SnmpSimulatorApp {
    constructor() {
        this.getHostIp();
    }

    run() {

        this.agents = [];
        const __filename = fileURLToPath(import.meta.url);
        let configFile = join(dirname(__filename), "../", "config", 'config.json');
        var json = JSON.parse(readFileSync(configFile))
        json.devices.forEach(device => {
            if(typeof device.port === 'string' && device.port.includes("-")) {
                let [firstPort, lastPort] = device.port.split("-");
                for (var currentPort = firstPort; currentPort <= lastPort; currentPort++)
                try {
                    this.agents.push(new Agent(device.name, currentPort));                    
                } catch (error) {
                    console.log(error);
                }
            }
            else if(typeof device.port === 'number' && device.port > 1024 && device.port < 65535)
                this.agents.push(new Agent(device.name, device.port))
            else
                throw new Error("One of the port informations are incorrect in the config file");
        });
    }

    getHostIp() {

        dockerHostIp.default( (error, result) => {
    
            if (result) {
                console.log(process.env.hostIp)
                process.env.hostIp = '0.0.0.0';// 'snmp-agent-simulator'//result;
                console.log(process.env.hostIp)
                //console.log("Awesome, we're within a Docker container with Host IP:", result);
            } else if (error) {
                process.env.hostIp = '127.0.0.1';
                console.log(error);
                //console.log("Awww, we got an error. We're probably not in a Docker container...to be safe the error is:", error);
            }
        });
    }
}
const app = new SnmpSimulatorApp();
setTimeout(function(){ app.run(); }, 2000);