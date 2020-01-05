import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { Tag } from './tag.mjs';
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
        const __filename = fileURLToPath(import.meta.url);
        let fileName = join(dirname(__filename), "../", "devices", `${this.deviceName}.json`);
        return JSON.parse(readFileSync(fileName))
    }
}

export { Device };