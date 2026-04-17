import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import auth from '../middleware/auth.js';

const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images are allowed'));
    cb(null, true);
  },
});

const streamUpload = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'refractlabs', resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });

// POST /api/upload — admin only
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({ message: 'Cloudinary is not configured on the server' });
    }
    const result = await streamUpload(req.file.buffer);
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Upload failed' });
  }
});

export default router;
