import express from 'express';

export default function routes(DeviceSchemaModel) {
  const deviceSchemaRouter = express.Router();

  deviceSchemaRouter.get('/', (req, res) => {
    DeviceSchemaModel.find({}, (err, schemas) => {
      if (err) {
        return res.send(err);
      }
      return res.json(schemas);
    });
  });

  deviceSchemaRouter.get('/names', (req, res) => {
    DeviceSchemaModel.find({}, '_id name', (err, schemas) => {
      if (err) {
        return res.send(err);
      }
      return res.json(schemas);
    });
  });

  deviceSchemaRouter.post('/', (req, res) => {
    const schema = new DeviceSchemaModel(req.body);
    schema.save();
    return res.status(201).json(schema);
  });

  return deviceSchemaRouter;
}
