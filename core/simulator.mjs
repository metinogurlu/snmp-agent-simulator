import dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { readFileSync } from 'fs';
import dockerHostIp from 'docker-host-ip';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Agent from './agent.mjs';
import ObjectIdentifier from '../messaging/object-identifier';
import deviceSchemaRouter from '../routes/deviceSchemaRouter';
import agentRouter from '../routes/agentRouter';
import agentModel from '../models/agent-model';
import deviceSchemaModel from '../models/device-schema-model.mjs';

class SnmpSimulatorApp {
  constructor() {
    this.getHostIp();
    this.agents = [];
    this.init();
    this.run();
  }

  init() {
    dotenv.config();
    [this.firstPort, this.lastPort] = process.env.PORTS.split('-').map((p) => parseInt(p, 10));

    const db = mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const api = express();
    const port = process.env.API_PORT || 34380;

    api.use(bodyParser.json()); // support json encoded bodies
    api.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

    api.use('/api/agents', agentRouter(agentModel, this));
    api.use('/api/schema', deviceSchemaRouter(deviceSchemaModel, this));

    api.listen(port, () => {
      console.log(`Runnint on port" ${port}`);
    });

    this.db = db;
    this.api = api;
  }

  createNewAgent(deviceName) {
    const getNextPort = () => {
      for (let i = this.firstPort; i <= this.lastPort; i += 1) {
        if (!this.agents.map((a) => a.port).includes(i)) {
          return i;
        }
      }
      throw new Error('All ports already allocated!, There is no space for new device.');
    };
    const port = getNextPort();
    this.agents.push(new Agent(deviceName, port));
    return port;
  }

  run() {
    agentModel.find({})
      .exec((err, agentModels) => agentModels.map(
        (model) => this.agents.push(new Agent(model.name, model.port)),
      ));
  }

  getHostIp() {
    dockerHostIp.default((error, result) => {
      if (result) {
        console.log(process.env.hostIp);
        process.env.hostIp = '0.0.0.0';// 'snmp-agent-simulator'//result;
        console.log(process.env.hostIp);
        // console.log("Awesome, we're within a Docker container with Host IP:", result);
      } else if (error) {
        process.env.hostIp = '127.0.0.1';
        console.log(error);
        // console.log("Awww, we got an error. We're probably not in a Docker container...to be safe the error is:", error);
      }
    });
  }
}

const simulator = new SnmpSimulatorApp();
