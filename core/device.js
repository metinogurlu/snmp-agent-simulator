import { readFileSync } from 'fs';
import { join } from 'path';
import Tag from './tag';

export default class Device {
  constructor(deviceName) {
    this.deviceName = deviceName;
    const config = Device.GetSchema(deviceName);
    this.tags = [];
    this.disconnectAfterEachRequest = config.disconnectAfterEachRequest;
    this.maxDisconnectedDurationInMinute = config.maxDisconnectedDurationInMinute;
    this.isDisconnected = false;

    for (let i = 0; i < config.oids.length; i += 1) {
      this.tags.push(new Tag(config.oids[i]));
    }
  }

  static GetSchema(deviceName) {
    const fileName = join(process.cwd(), 'devices', `${deviceName}.json`);
    return JSON.parse(readFileSync(fileName));
  }
}
