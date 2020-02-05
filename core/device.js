import { readFileSync } from 'fs';
import { join } from 'path';
import Tag from './tag';

export default class Device {
  constructor(deviceName) {
    this.deviceName = deviceName;
    this.tags = [];
    const config = this.GetDeviceConfig();
    this.disconnectAfterEachRequest = config.disconnectAfterEachRequest;
    this.maxDisconnectedDurationInMinute = config.maxDisconnectedDurationInMinute;
    this.isDisconnected = false;

    for (let i = 0; i < config.oids.length; i += 1) {
      this.tags.push(new Tag(config.oids[i]));
    }
  }

  GetDeviceConfig() {
    const fileName = join(process.cwd(), 'devices', `${this.deviceName}.json`);
    return JSON.parse(readFileSync(fileName));
  }
}
