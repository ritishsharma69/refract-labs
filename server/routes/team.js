import { Router } from 'express';
import Team from '../models/Team.js';
import auth from '../middleware/auth.js';

const router = Router();

// GET /api/team — public
router.get('/', async (_req, res) => {
  try {
    const members = await Team.find().sort({ createdAt: 1 });
    const mapped = members.map(m => ({ id: m._id, name: m.name, role: m.role, image: m.image, description: m.description, social: m.social }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/team — admin only
router.post('/', auth, async (req, res) => {
  try {
    const member = await Team.create(req.body);
    res.status(201).json({ id: member._id, name: member.name, role: member.role, image: member.image, description: member.description, social: member.social });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/team/:id — admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ message: 'Not found' });
    res.json({ id: member._id, name: member.name, role: member.role, image: member.image, description: member.description, social: member.social });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/team/:id — admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

