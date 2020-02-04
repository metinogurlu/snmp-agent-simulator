import { createSocket } from 'dgram';
import { SnmpMessage } from '../messaging/snmp-message';
import SnmpMessageResolver from '../messaging/snmp-message-resolver';
import { GetResponseMessage } from '../messaging/get-response-message';
import { Device } from './device';

export default class Agent {
  constructor(deviceName, port) {
    this.deviceName = deviceName;
    this.port = port;
    this.server = createSocket('udp4');
    this.setServerEvents();
    this.device = new Device(deviceName);
    this.readCount = 0;
  }

  setServerEvents() {
    this.server.on('error', (err) => {
      console.log(`server error:\n${err.stack}`);
      this.server.close();
    });

    this.server.on('message', (msg, rinfo) => {
      if (this.device.isDisconnected) {
        return;
      }

      if (this.isDisconnectNeed()) {
        this.device.isDisconnected = true;
        setTimeout(() => {
          this.device.isDisconnected = false;
        }, this.getRandomValue(0, this.device.maxDisconnectedDurationInMinute) * 60000);
      }

      this.readCount += 1;

      const getResponseMessage = this.getResponseMessage(rinfo, msg);
      setTimeout(() => {
        this.server.send(getResponseMessage.responseBuffer, rinfo.port, rinfo.address, (err) => {
          if (err === undefined) {
            console.log(err);
          }
        });
      }, this.getRandomValue(0, 250));

      console.log(this.getResponseString(rinfo, getResponseMessage));
      console.log([...getResponseMessage.responseBuffer]
        .map((item) => item.toString(16)).join(' '));
    });

    this.server.on('listening', () => {
      const address = this.server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });

    this.server.bind(this.port, process.env.hostIp);
  }

  isDisconnectNeed() {
    return (this.readCount > 0 && this.device.disconnectAfterEachRequest > 0
      && this.readCount % this.device.disconnectAfterEachRequest === 0);
  }

  getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
  }

  getResponseMessage(rinfo, binaryMessage) {
    const getRequestMessage = new SnmpMessage(binaryMessage);
    const resolver = new SnmpMessageResolver(getRequestMessage);
    const oidValueMap = new Map();

    resolver.oids.forEach((oid) => {
      if (this.device.tags.some((t) => t.oid === oid.oidString)) {
        const valueOfOid = this.device.tags.find((t) => t.oid === oid.oidString).GetNextValue();
        oidValueMap.set(oid, valueOfOid);
      } else {
        oidValueMap.set(oid, null);
      }
    });

    return new GetResponseMessage(getRequestMessage, oidValueMap);
  }

  getResponseString(rinfo, responseMessage) {
    const oidValues = [...responseMessage.oidValueMap.entries()]
      .map((item) => ({ oid: item[0].oidString, value: item[1] }));
    const responseJson = {
      deviceName: this.deviceName,
      port: this.port,
      ip: rinfo.address,
      response: oidValues,
    };

    return responseJson;
  }
}