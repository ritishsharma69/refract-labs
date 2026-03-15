import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  social: {
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    behance: { type: String, default: '' },
  },
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);

