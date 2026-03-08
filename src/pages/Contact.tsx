import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import RadialOrbitalTimeline from '../components/ui/radial-orbital-timeline';
import LogoMarquee from '../components/LogoMarquee';
import Footer from '../components/Footer';
import useSmoothScroll from '../hooks/useSmoothScroll';
import { Calendar, Code, FileText, User, Clock } from 'lucide-react';

const timelineData = [
  {
    id: 1,
    title: "Discovery",
    date: "Week 1",
    content: "Deep dive into your brand, audience, and business goals.",
    category: "Planning",
    icon: Calendar,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Strategy",
    date: "Week 2",
    content: "Craft a comprehensive roadmap and technical architecture.",
    category: "Design",
    icon: FileText,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Build",
    date: "Week 3-6",
    content: "Transform vision into reality with precision development.",
    category: "Development",
    icon: Code,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 4,
    title: "Refine",
    date: "Week 7",
    content: "Polish every detail and ensure flawless performance.",
    category: "Testing",
    icon: User,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 5,
    title: "Launch",
    date: "Week 8",
    content: "Go live and watch your digital identity take flight.",
    category: "Release",
    icon: Clock,
    relatedIds: [4],
    status: "pending" as const,
    energy: 10,
  },
];

const Contact = () => {
  useSmoothScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroH1 = heroRef.current?.querySelector('h1');
      const heroP = heroRef.current?.querySelector('p');
      
      if (heroH1) {
        gsap.fromTo(heroH1,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
        );
      }
      if (heroP) {
        gsap.fromTo(heroP,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#080808' }}>
      <Navbar />

      {/* Hero Section */}
      <div
        ref={heroRef}
        style={{
          minHeight: isMobile ? 'auto' : '80vh',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '120px 24px 40px' : '140px 80px 60px',
          gap: isMobile ? '40px' : '60px',
        }}
      >
        {/* Left Content */}
        <div style={{ flex: 1, maxWidth: isMobile ? '100%' : '500px' }}>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: isMobile ? '36px' : '56px',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}>
            Work With Us
          </h1>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: '#888',
            lineHeight: 1.7,
            marginBottom: '40px',
          }}>
            Have a vision in mind? Let's explore how we can bring it to life.
          </p>

          {/* Contact Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ContactCard
              label="PHONE"
              value="+91 98765 43210"
              href="tel:+919876543210"
            />
            <ContactCard
              label="EMAIL"
              value="project@refractweb.com"
              href="mailto:project@refractweb.com"
            />
            <ContactCard
              label="ADDRESS"
              value="4545 La Jolla Village Dr, San Diego, CA 92122"
            />
          </div>
        </div>

        {/* Right - Radial Orbital Timeline */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: isMobile ? '400px' : '500px',
          overflow: 'visible',
        }}>
          <RadialOrbitalTimeline timelineData={timelineData} />
        </div>
      </div>

      {/* Logo Marquee */}
      <LogoMarquee />

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Contact Card Component
const ContactCard = ({ label, value, href }: { label: string; value: string; href?: string }) => {
  const content = (
    <div style={{
      padding: '20px 24px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.08)',
      transition: 'all 0.3s ease',
    }}
    className="hover:bg-white/5 hover:border-white/15 cursor-pointer"
    >
      <p style={{
        fontSize: '11px',
        fontWeight: 600,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '6px',
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '16px',
        fontWeight: 500,
        color: 'white',
        fontFamily: 'Space Grotesk, sans-serif',
      }}>
        {value}
      </p>
    </div>
  );

  if (href) {
    return <a href={href} style={{ textDecoration: 'none' }}>{content}</a>;
  }
  return content;
};

export default Contact;

