import mongoose from 'mongoose';

const workSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  link: { type: String, default: '' },
  featuredOnHome: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Work', workSchema);

