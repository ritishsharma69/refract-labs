import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import RadialOrbitalTimeline from './ui/radial-orbital-timeline';
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

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate on scroll into view
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      tl.fromTo(headingRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
      )
      .fromTo(subtextRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(buttonRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(cardsRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out' },
        '-=0.8'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: isMobile ? 'auto' : '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080808',
        position: 'relative',
        overflow: 'hidden',
        padding: isMobile ? '60px 24px' : '80px 48px',
      }}
    >
      {/* Diagonal light beam - warm orange/white streak from top-right to center-left */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '140%',
          height: isMobile ? '150px' : '250px',
          background: 'linear-gradient(135deg, transparent 0%, rgba(255,200,150,0.03) 20%, rgba(255,180,120,0.08) 40%, rgba(255,140,80,0.12) 50%, rgba(200,100,40,0.06) 65%, transparent 80%)',
          transform: 'rotate(-25deg)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* Secondary beam for more depth */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '100%',
          height: isMobile ? '80px' : '120px',
          background: 'linear-gradient(135deg, transparent 10%, rgba(255,255,255,0.04) 40%, rgba(255,220,180,0.07) 55%, transparent 75%)',
          transform: 'rotate(-25deg)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: isMobile ? '50%' : '30%',
          transform: isMobile ? 'translateX(-50%)' : 'none',
          width: isMobile ? '300px' : '600px',
          height: isMobile ? '200px' : '400px',
          background: 'radial-gradient(ellipse, rgba(194,98,42,0.1) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content container */}
      <div
        style={{
          display: isMobile ? 'flex' : 'grid',
          flexDirection: 'column',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          alignItems: 'center',
          maxWidth: '1200px',
          width: '100%',
          gap: isMobile ? '32px' : '60px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left column - Text & CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start', textAlign: isMobile ? 'center' : 'left' }}>
          <h2
            ref={headingRef}
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Ready to define<br />
            <span style={{ color: '#e07030' }}>your identity?</span>
          </h2>

          <p
            ref={subtextRef}
            style={{
              fontSize: '17px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
              marginTop: '24px',
              maxWidth: '420px',
            }}
          >
            Let's build something that commands attention and converts. 
            Start a conversation with our team today.
          </p>

          <Link to="/contact">
            <button
              ref={buttonRef}
              className="hero-cta-btn"
              style={{ marginTop: '36px' }}
            >
              Start a Project
            </button>
          </Link>
        </div>

        {/* Right column - Radial Orbital Timeline */}
        <div
          ref={cardsRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: isMobile ? '400px' : '500px',
          }}
        >
          <RadialOrbitalTimeline timelineData={timelineData} />
        </div>
      </div>
    </section>
  );
};

export default CTASection;

