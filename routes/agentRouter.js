import express from 'express';

export default function routes(AgentModel, app) {
  const agentRouter = express.Router();

  agentRouter.get('/', (req, res) => {
    AgentModel.find({}, (err, agents) => {
      if (err) {
        return res.send(err);
      }
      return res.json(agents);
    });
  });

  agentRouter.post('/', (req, res) => {
    const agentModel = new AgentModel(req.body);
    const agent = app.createNewAgent(agentModel.name);
    if (agent.port !== undefined) agentModel.port = agent.port;
    if (typeof agentModel.disconnectAfterEachRequest === 'undefined') {
      agentModel.disconnectAfterEachRequest = agent.device.disconnectAfterEachRequest;
    }
    if (typeof agentModel.maxDisconnectedDurationInMinute === 'undefined') {
      agentModel.maxDisconnectedDurationInMinute = agent.device.maxDisconnectedDurationInMinute;
    }
    agentModel.save();
    return res.status(201).json(agentModel);
  });

  agentRouter.delete('/', (req, res) => {
    AgentModel.deleteOne({ id: req.params.id }, (err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204);
    });
  });

  return agentRouter;
}
