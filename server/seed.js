import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import Team from './models/Team.js';
import Work from './models/Work.js';
import Testimonial from './models/Testimonial.js';

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Seed admin
  const existingAdmin = await Admin.findOne({ email: 'admin@refractlabs.com' });
  if (!existingAdmin) {
    await Admin.create({ email: 'admin@refractlabs.com', password: 'admin123' });
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Seed team
  if ((await Team.countDocuments()) === 0) {
    await Team.insertMany([
      { name: 'Adam Guarino', role: 'Co-Founder and COO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face', description: 'Adam orchestrates creative strategy and production for high-growth organizations.', social: { linkedin: '#', twitter: '#' } },
      { name: 'Jake Young', role: 'Co-Founder and CEO', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=face', description: 'Jake operates across major creative markets including San Diego and London.', social: { linkedin: '#', twitter: '#' } },
    ]);
    console.log('✅ Team members seeded');
  }

  // Seed works
  if ((await Work.countDocuments()) === 0) {
    await Work.insertMany([
      { title: 'Project Aether', type: 'Visual Engineering', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80', description: 'Zero-latency interfaces crafted for premium digital commerce.', link: '#', featuredOnHome: true },
      { title: 'Project Sentinel', type: 'System Architecture', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', description: 'Biometric identity systems built around trust and usability.', link: '#', featuredOnHome: true },
      { title: 'Project Cortex', type: 'Intelligent Interfaces', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80', description: 'Adaptive product experiences for AI-native workflows.', link: '#', featuredOnHome: true },
      { title: 'Project Flux', type: 'Identity Systems', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80', description: 'Design systems engineered for consistency at infinite scale.', link: '#', featuredOnHome: true },
      { title: 'Project Atlas', type: 'Branding', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80', description: 'Brand worlds with sharper storytelling and stronger recall.', link: '#', featuredOnHome: false },
      { title: 'Project Nova', type: 'Web Development', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80', description: 'Conversion-first web platforms designed for fast growth.', link: '#', featuredOnHome: false },
    ]);
    console.log('✅ Works seeded');
  }

  // Seed testimonials
  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany([
      { type: 'text', quote: '"Working with this team completely transformed how we present our brand online. The attention to detail is unmatched."', name: 'Arjun Mehta', role: 'Founder', company: 'NovaTech', stars: 5, avatarColor: '#c2622a', featuredOnHome: true },
      { type: 'text', quote: '"Delivered ahead of schedule with zero compromises on quality. Our conversion rate went up 40% within the first month."', name: 'Priya Singh', role: 'Marketing Director', company: 'Luminary Co', stars: 5, avatarColor: '#6644bb', featuredOnHome: true },
      { type: 'text', quote: '"I have worked with many agencies but none matched this level of craft and communication. Truly a premium experience."', name: 'Rohit Sharma', role: 'CEO', company: 'Apex Studio', stars: 5, avatarColor: '#226644', featuredOnHome: true },
      { type: 'text', quote: '"The team understood our vision on the first call itself. What they built exceeded every expectation we had."', name: 'Sarah Mitchell', role: 'Product Head', company: 'Orbit Labs', stars: 5, avatarColor: '#aa3344', featuredOnHome: true },
      { type: 'text', quote: '"Fast, professional, and genuinely talented. The final product speaks for itself."', name: 'Vikram Nair', role: 'Co-Founder', company: 'Stealth Ventures', stars: 5, avatarColor: '#884422', featuredOnHome: false },
      { type: 'video', quote: '"They brought clarity, speed, and a premium digital presence we finally feel proud to share."', name: 'Tanner Balisky', role: 'CEO', company: 'Bad Birdie', stars: 5, avatarColor: '#224488', duration: '1:24', featuredOnHome: false },
      { type: 'video', quote: '"Every milestone felt intentional. The team moved fast and never sacrificed quality."', name: 'James Ortega', role: 'Director', company: 'Nova Labs', stars: 5, avatarColor: '#448822', duration: '2:10', featuredOnHome: false },
    ]);
    console.log('✅ Testimonials seeded');
  }

  await mongoose.disconnect();
  console.log('🎉 Seed complete');
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});

