import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { readFileSync } from 'fs';
import Agent from './agent.mjs';

class SnmpSimulatorApp {
    constructor() {
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
}

new SnmpSimulatorApp()