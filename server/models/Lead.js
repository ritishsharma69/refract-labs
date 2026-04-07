import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  message: { type: String, default: '' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
