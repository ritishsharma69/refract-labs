import { Router } from 'express';
import nodemailer from 'nodemailer';
import Lead from '../models/Lead.js';
import auth from '../middleware/auth.js';

const router = Router();

const toDTO = (l) => ({
  id: l._id,
  name: l.name,
  email: l.email,
  mobile: l.mobile,
  message: l.message,
  read: l.read,
  createdAt: l.createdAt,
});

// Send email notification
const sendEmailNotification = async (lead) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL || 'hello.refractlabs@gmail.com',
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"RefractLabs Website" <${process.env.SMTP_EMAIL || 'hello.refractlabs@gmail.com'}>`,
      to: 'hello.refractlabs@gmail.com',
      subject: `New Lead: ${lead.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #c75b2a; padding-bottom: 10px;">🔔 New Lead from Website</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 10px; font-weight: bold; color: #555;">Name:</td><td style="padding: 10px;">${lead.name}</td></tr>
            <tr style="background: #f9f9f9;"><td style="padding: 10px; font-weight: bold; color: #555;">Email:</td><td style="padding: 10px;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
            <tr><td style="padding: 10px; font-weight: bold; color: #555;">Mobile:</td><td style="padding: 10px;"><a href="tel:${lead.mobile}">${lead.mobile}</a></td></tr>
            <tr style="background: #f9f9f9;"><td style="padding: 10px; font-weight: bold; color: #555;">Message:</td><td style="padding: 10px;">${lead.message || 'No message'}</td></tr>
          </table>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">This email was sent from the RefractLabs website contact form.</p>
        </div>
      `,
    });
    console.log('📧 Lead notification email sent');
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
  }
};

// POST /api/leads — public (submit form)
router.post('/', async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;
    if (!name || !email || !mobile) {
      return res.status(400).json({ message: 'Name, email, and mobile are required' });
    }
    const lead = await Lead.create({ name, email, mobile, message });

    // Send email in background (don't block response)
    sendEmailNotification(lead);

    res.status(201).json({ message: 'Thank you! We will get back to you soon.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/leads — admin only
router.get('/', auth, async (_req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads.map(toDTO));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/leads/:id/read — admin only (mark as read)
router.put('/:id/read', auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!lead) return res.status(404).json({ message: 'Not found' });
    res.json(toDTO(lead));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/leads/:id — admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
