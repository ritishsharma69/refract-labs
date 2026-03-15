import { Router } from 'express';
import Testimonial from '../models/Testimonial.js';
import auth from '../middleware/auth.js';

const router = Router();

const toDTO = (t) => ({
  id: t._id, type: t.type, quote: t.quote, name: t.name, role: t.role,
  company: t.company, stars: t.stars, avatarUrl: t.avatarUrl, avatarColor: t.avatarColor,
  thumbnailUrl: t.thumbnailUrl, videoUrl: t.videoUrl, duration: t.duration, featuredOnHome: t.featuredOnHome,
});

// GET /api/testimonials — public
router.get('/', async (_req, res) => {
  try {
    const items = await Testimonial.find().sort({ createdAt: 1 });
    res.json(items.map(toDTO));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/testimonials — admin only
router.post('/', auth, async (req, res) => {
  try {
    const item = await Testimonial.create(req.body);
    res.status(201).json(toDTO(item));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/testimonials/:id — admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(toDTO(item));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/testimonials/:id — admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

