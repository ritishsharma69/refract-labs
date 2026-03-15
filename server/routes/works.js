import { Router } from 'express';
import Work from '../models/Work.js';
import auth from '../middleware/auth.js';

const router = Router();

// Helper to map mongoose doc to frontend shape
const toDTO = (w) => ({ id: w._id, title: w.title, type: w.type, image: w.image, description: w.description, link: w.link, featuredOnHome: w.featuredOnHome });

// GET /api/works — public
router.get('/', async (_req, res) => {
  try {
    const works = await Work.find().sort({ createdAt: 1 });
    res.json(works.map(toDTO));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/works — admin only
router.post('/', auth, async (req, res) => {
  try {
    const work = await Work.create(req.body);
    res.status(201).json(toDTO(work));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/works/:id — admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const work = await Work.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!work) return res.status(404).json({ message: 'Not found' });
    res.json(toDTO(work));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/works/:id — admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const work = await Work.findByIdAndDelete(req.params.id);
    if (!work) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

