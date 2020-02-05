import express from 'express';

export default function routes(DeviceSchemaModel) {
  const deviceSchemaRouter = express.Router();

  deviceSchemaRouter.get('/', (req, res) => {
    DeviceSchemaModel.find({}, (err, agents) => {
      if (err) {
        return res.send(err);
      }
      return res.json(agents);
    });
  });

  deviceSchemaRouter.post('/', (req, res) => {
    const schema = new DeviceSchemaModel(req.body);
    schema.save();
    return res.status(201).json(schema);
  });

  return deviceSchemaRouter;
}
