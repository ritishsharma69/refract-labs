import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import { TestimonialCarousel } from '../components/ui/profile-card-testimonial-carousel';
import VerticalTabs from '../components/ui/vertical-tabs';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import useSmoothScroll from '../hooks/useSmoothScroll';

gsap.registerPlugin(ScrollTrigger);





const About = () => {
  useSmoothScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Small delay to ensure DOM is fully ready
    const timeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Hero animation
        const heroH1 = heroRef.current?.querySelector('h1');
        const heroP = heroRef.current?.querySelector('p');

        if (heroH1) {
          gsap.set(heroH1, { opacity: 1 });
          gsap.fromTo(heroH1,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.1 }
          );
        }
        if (heroP) {
          gsap.set(heroP, { opacity: 1 });
          gsap.fromTo(heroP,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
          );
        }

        // Quote animation - ensure visibility
        if (quoteRef.current) {
          gsap.set(quoteRef.current, { opacity: 1 });
          gsap.fromTo(quoteRef.current,
            { y: 60, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 1, ease: 'power3.out',
              scrollTrigger: { trigger: quoteRef.current, start: 'top 85%' }
            }
          );
        }

        // Capabilities animation - ensure visibility
        if (capabilitiesRef.current) {
          gsap.set(capabilitiesRef.current, { opacity: 1 });
          gsap.fromTo(capabilitiesRef.current,
            { y: 40, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: capabilitiesRef.current, start: 'top 85%' }
            }
          );
        }

        // Refresh ScrollTrigger after all animations are set up
        ScrollTrigger.refresh();
      });

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 78 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 1.5 + ((i * 11) % 4),
        opacity: 0.24 + (((i * 7) % 32) / 100),
        duration: 10 + ((i * 13) % 15),
        delay: -((i * 17) % 12) / 1.5,
      })),
    []
  );

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#080808', position: 'relative', overflow: 'hidden' }}>
      {/* Particle Layer */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0, opacity: 0.58 }}>
        {particles.map((p) => (
          <span
            key={p.id}
            style={{
              position: 'absolute',
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.92)',
              boxShadow: '0 0 12px rgba(255,255,255,0.26)',
              opacity: p.opacity,
              animation: `testimonialDrift ${p.duration}s ease-in-out ${p.delay}s infinite alternate, testimonialPulse ${Math.max(3.6, p.duration * 0.4)}s ease-in-out ${p.delay / 1.5}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <Navbar />

      {/* Hero Section */}
      <div
        ref={heroRef}
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isMobile ? '120px 24px 60px' : '140px 80px 80px',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: isMobile ? '32px' : '56px',
          fontWeight: 700,
          color: 'white',
          fontStyle: 'italic',
          lineHeight: 1.2,
          maxWidth: '600px',
          margin: 0,
        }}>
          Working with those<br />who set the standard
        </h1>
        <p style={{
          fontSize: isMobile ? '14px' : '16px',
          color: '#888',
          marginTop: '20px',
          maxWidth: '500px',
          lineHeight: 1.7,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Across media, technology, and high-visibility environments.
        </p>
        {/* CTAs */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/contact" onClick={() => window.scrollTo(0, 0)}><button className="hero-cta-btn">Work With Us</button></Link>
          <button className="group flex items-center gap-2 text-white">
            <span>Explore our services</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Team Section - Testimonial Carousel */}
      <div style={{ padding: isMobile ? '20px 16px' : '40px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: isMobile ? '28px' : '42px',
            fontWeight: 700,
            color: 'white',
            marginBottom: '16px',
          }}>
            Meet The Team
          </h2>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: '#888',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            The people behind Refract Labs
          </p>
        </div>
        <TestimonialCarousel />
      </div>

      {/* Quote Section */}
      <div
        ref={quoteRef}
        style={{
          padding: isMobile ? '80px 24px' : '140px 80px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: isMobile ? '24px' : '48px',
          fontWeight: 600,
          color: 'white',
          fontStyle: 'italic',
          lineHeight: 1.3,
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          The Gap Between Reality And Perception... We Exist To Ensure No Great Company Is Held Back By A Quiet Digital Presence
        </h2>
      </div>

      {/* Core Capabilities - Vertical Tabs */}
      <div ref={capabilitiesRef} style={{ position: 'relative', zIndex: 1 }}>
        <VerticalTabs />
      </div>

      {/* CTA Section */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <CTASection />
      </div>

      {/* Footer */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Footer />
      </div>
    </div>
  );
};

export default About;

