import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import teamRoutes from './routes/team.js';
import worksRoutes from './routes/works.js';
import testimonialsRoutes from './routes/testimonials.js';
import leadsRoutes from './routes/leads.js';
import uploadRoutes from './routes/upload.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/works', worksRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/upload', uploadRoutes);

// Root & health check
app.get('/', (_req, res) => res.json({ status: 'ok', service: 'refract-labs-api' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

