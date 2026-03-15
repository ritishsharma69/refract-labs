import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'video'], default: 'text' },
  quote: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  stars: { type: Number, default: 5, min: 1, max: 5 },
  avatarUrl: { type: String, default: '' },
  avatarColor: { type: String, default: '#c2622a' },
  thumbnailUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  duration: { type: String, default: '' },
  featuredOnHome: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);

