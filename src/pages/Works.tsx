import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import useSmoothScroll from '../hooks/useSmoothScroll';

gsap.registerPlugin(ScrollTrigger);

interface WorkItem {
  id: string | number;
  title: string;
  type: string;
  image: string;
}

// Default work items
const DEFAULT_WORK_ITEMS: WorkItem[] = [
  { id: '1', title: 'Color Pallet', type: 'Branding', image: '/work-1.png' },
  { id: '2', title: 'Design That Inspires', type: 'Web Design', image: '/work-2.png' },
  { id: '3', title: 'Nublink', type: 'Identity', image: '/work-3.png' },
  { id: '4', title: 'AI Platform', type: 'Software', image: '/work-4.png' },
  { id: '5', title: 'Typography System', type: 'Branding', image: '/work-5.png' },
  { id: '6', title: 'E-commerce', type: 'Web Development', image: '/work-6.png' },
];

// Get works from localStorage or use defaults
const getWorkItems = (): WorkItem[] => {
  const stored = localStorage.getItem('workItems');
  if (stored) return JSON.parse(stored);
  return DEFAULT_WORK_ITEMS;
};

const Works = () => {
  useSmoothScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const marqueeRef1 = useRef<HTMLDivElement>(null);
  const marqueeRef2 = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    // Load work items from localStorage
    setWorkItems(getWorkItems());
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
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

      // Marquee animations
      const marquee1 = marqueeRef1.current;
      const marquee2 = marqueeRef2.current;

      // Wait for DOM to be ready with content
      setTimeout(() => {
        if (marquee1) {
          const width = marquee1.scrollWidth / 2;
          gsap.set(marquee1, { x: 0 });
          gsap.to(marquee1, {
            x: -width,
            duration: 25,
            ease: 'none',
            repeat: -1,
          });
        }

        if (marquee2) {
          const width = marquee2.scrollWidth / 2;
          gsap.set(marquee2, { x: -width });
          gsap.to(marquee2, {
            x: 0,
            duration: 25,
            ease: 'none',
            repeat: -1,
          });
        }
      }, 100);
    });

    return () => ctx.revert();
  }, [workItems]);

  const renderWorkCard = (item: WorkItem, index: number) => (
    <div
      key={`${item.id}-${index}`}
      style={{
        flex: '0 0 auto',
        width: isMobile ? '280px' : '380px',
        height: isMobile ? '320px' : '420px',
        background: 'linear-gradient(135deg, #0f1420 0%, #151a28 50%, #0f1420 100%)',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid rgba(255,255,255,0.05)',
        marginRight: '20px',
      }}
    >
      {/* Image */}
      <div style={{
        width: '100%',
        height: '70%',
        background: `url(${item.image}) center/cover no-repeat`,
        position: 'relative',
      }}>
        {/* Fallback gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, hsl(${(Number(item.id) * 60) % 360}, 70%, 20%) 0%, hsl(${(Number(item.id) * 60 + 30) % 360}, 60%, 15%) 100%)`,
        }}>
          {/* Mock UI elements */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            display: 'flex',
            gap: '8px',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28c840' }} />
          </div>
          {/* Content placeholder */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: isMobile ? '18px' : '24px',
              fontWeight: 700,
              color: 'white',
            }}>
              {item.title}
            </div>
          </div>
        </div>
      </div>
      {/* Info */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          {item.type}
        </span>
        <h3 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: isMobile ? '18px' : '22px',
          fontWeight: 600,
          color: 'white',
        }}>
          {item.title}
        </h3>
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#080808' }}>
      <Navbar />

      {/* Hero Section */}
      <div
        ref={heroRef}
        style={{
          minHeight: '40vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '120px 24px 40px' : '140px 80px 60px',
          textAlign: 'center',
        }}
      >
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: isMobile ? '36px' : '64px',
          fontWeight: 700,
          color: 'white',
          fontStyle: 'italic',
        }}>
          Recent Works
        </h1>
        <p style={{
          fontSize: isMobile ? '14px' : '16px',
          color: '#888',
          marginTop: '16px',
          maxWidth: '400px',
          lineHeight: 1.7,
        }}>
          Let's discuss scope, timing, and fit.
        </p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="hero-cta-btn">Work With Us</button>
          <button className="group flex items-center gap-2 text-white">
            <span>Explore our services</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Marquee Section - Row 1 (Left to Right animation, meaning it moves left) */}
      <div style={{
        overflow: 'hidden',
        padding: isMobile ? '20px 0' : '40px 0',
      }}>
        <div
          ref={marqueeRef1}
          style={{
            display: 'flex',
            width: 'fit-content',
          }}
        >
          {/* Duplicate items for seamless loop */}
          {[...workItems, ...workItems].map((item, index) => renderWorkCard(item, index))}
        </div>
      </div>

      {/* Marquee Section - Row 2 (Right to Left animation, meaning it moves right) */}
      <div style={{
        overflow: 'hidden',
        padding: isMobile ? '20px 0' : '40px 0',
      }}>
        <div
          ref={marqueeRef2}
          style={{
            display: 'flex',
            width: 'fit-content',
          }}
        >
          {/* Duplicate items for seamless loop */}
          {[...workItems.slice().reverse(), ...workItems.slice().reverse()].map((item, index) => renderWorkCard(item, index))}
        </div>
      </div>

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Works;

