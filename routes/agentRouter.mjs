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
    const agent = new AgentModel(req.body);
    const port = app.createNewAgent(agent.name);
    if (port !== undefined) agent.port = port;
    agent.save();
    return res.status(201).json(agent);
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
