import mongoose from 'mongoose';

const { Schema } = mongoose;

const oidSchema = new Schema({
  name: String,
  oid: String,
  valueMin: Number,
  valueMax: Number,
  multiplier: Number,
  changeFactor: mongoose.Types.Decimal128,
  alarmFactor: mongoose.Types.Decimal128,
});

const deviceSchema = new Schema({
  id: Schema.ObjectId,
  disconnectAfterEachRequest: Number,
  maxDisconnectedDurationInMinute: Number,
  name: String,
  oids: [oidSchema],
});

const oidModel = mongoose.model('oid', oidSchema);
const deviceSchemaModel = mongoose.model('deviceSchema', deviceSchema);
export { deviceSchemaModel, oidModel };
