import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import { Carousel, TestimonialCard, type iTestimonial } from '../components/ui/retro-testimonial';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import useSmoothScroll from '../hooks/useSmoothScroll';

gsap.registerPlugin(ScrollTrigger);

// Team data for testimonial carousel
const TEAM_MEMBERS: iTestimonial[] = [
  {
    name: 'Adam Guarino',
    designation: 'Co-Founder and COO',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face',
    description: 'Adam orchestrates creative strategy and production for high-growth organizations and enterprise partners. He bridges the gap between ambitious visual concepts and operational reality, driving projects from direction to delivery.',
  },
  {
    name: 'Jake Young',
    designation: 'Co-Founder and CEO',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=face',
    description: 'Jake operates across major creative markets including San Diego and London, contributing to work built for global visibility and commercial impact. Trusted to deliver in high-stakes environments.',
  },
];

// Service cards data
const SERVICES = [
  {
    title: 'Web Development',
    description: 'Transform concepts into high-performance experiences. We engineer story-driven websites that turn your brand into a premium digital product. Every layout and interaction feels refined, fast, and distinct.',
    image: '/service-web.png',
  },
  {
    title: 'Branding',
    description: 'We build strategic identities designed to secure a premium market position. Visual systems that scale across platforms while staying bold and timeless.',
    image: '/service-branding.png',
  },
  {
    title: 'Software / AI',
    description: 'We replace manual processes with intelligent software tailored to your specific operations. Custom AI solutions that think faster, adapt smarter, and unlock new possibilities.',
    image: '/service-ai.png',
  },
  {
    title: '3D Animation',
    description: 'We build cinematic 3D assets designed to give your brand a premium feel. Motion graphics and visual effects that captivate and convert.',
    image: '/service-3d.png',
  },
];

const About = () => {
  useSmoothScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
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

        // Service cards stacking animation - only on desktop
        const isMobileView = window.innerWidth < 768;
        const cards = cardsRef.current?.querySelectorAll('.service-card');

        if (!isMobileView && cards && cards.length > 0) {
          cards.forEach((card, idx) => {
            gsap.set(card, { opacity: 1 });
            ScrollTrigger.create({
              trigger: card,
              start: 'top 20%',
              end: 'bottom 20%',
              pin: idx < cards.length - 1, // Don't pin the last card
              pinSpacing: false,
              onUpdate: (self) => {
                const progress = self.progress;
                gsap.to(card, {
                  scale: 1 - (progress * 0.05),
                  filter: `blur(${progress * 3}px)`,
                  opacity: 1 - (progress * 0.3),
                  duration: 0.1,
                });
              }
            });
          });
        } else if (cards && cards.length > 0) {
          // Mobile: simple fade-in animation
          cards.forEach((card) => {
            gsap.set(card, { opacity: 1 });
            gsap.fromTo(card,
              { y: 40, opacity: 0 },
              {
                y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 90%' }
              }
            );
          });
        }

        // Refresh ScrollTrigger after all animations are set up
        ScrollTrigger.refresh();
      });

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#080808' }}>
      <Navbar />

      {/* Hero Section */}
      <div
        ref={heroRef}
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: isMobile ? '120px 24px 60px' : '140px 80px 80px',
          position: 'relative',
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
        }}>
          Working with those<br />who set the standard
        </h1>
        <p style={{
          fontSize: isMobile ? '14px' : '16px',
          color: '#888',
          marginTop: '20px',
          maxWidth: '500px',
          lineHeight: 1.7,
        }}>
          Across media, technology, and high-visibility environments.
        </p>
        {/* CTAs */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '32px', flexWrap: 'wrap' }}>
          <button className="hero-cta-btn">Work With Us</button>
          <button className="group flex items-center gap-2 text-white">
            <span>Explore our services</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Team Section - Testimonial Carousel */}
      <div style={{ padding: isMobile ? '20px 16px' : '40px 80px' }}>
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
            The people behind RefractWeb
          </p>
        </div>
        <Carousel
          items={TEAM_MEMBERS.map((member, index) => (
            <TestimonialCard
              key={member.name}
              testimonial={member}
              index={index}
              layout
              onCardClose={() => {}}
            />
          ))}
        />
      </div>

      {/* Quote Section */}
      <div
        ref={quoteRef}
        style={{
          padding: isMobile ? '80px 24px' : '140px 80px',
          textAlign: 'center',
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

      {/* Core Capabilities Section */}
      <div
        ref={capabilitiesRef}
        style={{
          padding: isMobile ? '60px 24px' : '100px 80px',
          textAlign: 'center',
        }}
      >
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: isMobile ? '32px' : '52px',
          fontWeight: 700,
          color: 'white',
        }}>
          Core capabilities
        </h2>
        <p style={{
          fontSize: isMobile ? '14px' : '16px',
          color: '#888',
          marginTop: '16px',
          maxWidth: '500px',
          margin: '16px auto 0',
          lineHeight: 1.7,
        }}>
          Integrated execution. We blend strategy, design, and code to build platforms that perform.
        </p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="hero-cta-btn">Work With Us</button>
          <button className="group flex items-center gap-2 text-white">
            <span>Explore our services</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Service Cards with Stacking Animation */}
      <div
        ref={cardsRef}
        style={{
          padding: isMobile ? '40px 16px 60px' : '60px 80px 400px',
        }}
      >
        {SERVICES.map((service, index) => (
          <ServiceCard key={index} service={service} index={index} isMobile={isMobile} />
        ))}
      </div>

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service, isMobile }: { service: typeof SERVICES[0]; index: number; isMobile: boolean }) => {
  return (
    <div
      className="service-card"
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        background: 'linear-gradient(135deg, #0f1420 0%, #151a28 50%, #0f1420 100%)',
        borderRadius: '24px',
        overflow: 'hidden',
        marginBottom: '24px',
        border: '1px solid rgba(255,255,255,0.05)',
        maxWidth: '1000px',
        margin: '0 auto 24px',
      }}
    >
      {/* Image Side */}
      <div style={{
        flex: isMobile ? 'none' : '0 0 50%',
        height: isMobile ? '250px' : '400px',
        background: '#0a0e16',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          background: `url(${service.image}) center/cover no-repeat`,
          opacity: 0.9,
        }} />
        {/* Fallback gradient if no image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(194,98,42,0.1) 0%, transparent 50%)',
        }} />
      </div>

      {/* Content Side */}
      <div style={{
        flex: 1,
        padding: isMobile ? '32px 24px' : '48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div style={{ marginBottom: '16px' }}>
          <svg style={{ width: '24px', height: '24px', color: '#666' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
          </svg>
        </div>
        <h3 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: isMobile ? '28px' : '36px',
          fontWeight: 700,
          color: 'white',
          marginBottom: '16px',
        }}>
          {service.title}
        </h3>
        <p style={{
          fontSize: isMobile ? '14px' : '16px',
          color: '#888',
          lineHeight: 1.7,
          marginBottom: '24px',
        }}>
          {service.description}
        </p>
        <a href="#" className="group flex items-center gap-2 text-white hover:text-orange-400 transition-colors">
          <span>Get in Touch</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default About;

