import mongoose from 'mongoose';

const { Schema } = mongoose;

const agentSchema = new Schema({
  id: Schema.ObjectId,
  name: String,
  port: Number,
  isActive: { type: Boolean, default: true },
});

const AgentModel = mongoose.model('agent', agentSchema);
export default AgentModel;
