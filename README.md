# eSaS
## Snmp Agent Simulator
[![metinogurlu](https://circleci.com/gh/metinogurlu/snmp-agent-simulator.svg?style=svg)](https://circleci.com/gh/metinogurlu/snmp-agent-simulator/tree/master)

eSas Snmp Agent Simulator acts as there are n number snmp devices on the network. Simulator responds to snmp requests according to predefined rules. In this way, you can work with SNMP devices without having the dozens of physical device. Each instance gives you thousends of SNMP devices. *It depends on number of available ports on host of instance.*

# Features
  - Work with **predifined snmp device schemas.**
  - Create your own **device schemas.**
  - Integrate in your workflow with **REST api**.
  - Create your SNMP based working environment.
  - **Change factor** gives you smoothly changing device values.
  - **DisconnectAfterEachRequest** and **MaxDisconnectedDurationInMinute** simulates device's disconnection conditions. 

### Installation

eSaS Simulator requires [Node.js](https://nodejs.org/) v13+ and [MongoDB](mongodb.com/) to run.
Install the dependencies and devDependencies and start the server.
```sh
$ npm install
$ npm start
```

### API Endpoints

You can control your SNMP environment (schemas, agents etc.) with REST api.

| Endpoint | Method | Description |
| ------ | ------ | ------ |
| http://localhost:34380/api/schema/ | GET | Get all schemas with all fields |
| http://localhost:34380/api/schema/names | GET | Get all schemas with only id an names to learn which device model are supported |
| http://localhost:34380/api/schema/ | POST | Add new schema to support new device model |
| http://localhost:34380/api/agents | GET | Get all agents on network |
| http://localhost:34380/api/agents | POST | Create new device on your network |
| http://localhost:34380/api/agents?id=1 | DELETE | Delete a device on the network with given id |

### Todos

 - Write MORE Tests
 - Fix alarmFactor bug to cause value alarms sometimes
 - Fix Snmp Community bug *-it sends response every community value right now-*
 - SNMP v3 support