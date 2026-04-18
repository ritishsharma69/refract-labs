import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const linksRowRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Giant brand text animation
      gsap.fromTo(
        brandRef.current,
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: brandRef.current, start: 'top 85%' },
        }
      );

      // Nav links stagger animation
      gsap.fromTo(
        '.footer-nav-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: linksRowRef.current, start: 'top 90%' },
        }
      );

      // Bottom bar animation
      gsap.fromTo(
        bottomRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          delay: 0.3,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: { trigger: bottomRef.current, start: 'top 95%' },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const websiteLinks = [
    { label: 'HOME', href: '/' },
    { label: 'SERVICES', href: '/#services' },
    { label: 'ABOUT', href: '/about' },
    { label: 'WORK WITH US', href: '/contact' },
  ];
  const legalLinks = [
    { label: 'TERMS OF SERVICE', href: '/terms-of-service' },
    { label: 'PRIVACY POLICY', href: '/privacy-policy' },
    { label: 'COOKIE POLICY', href: '/cookie-policy' },
  ];

  return (
    <footer
      ref={footerRef}
      style={{
        width: '100%',
        background: '#080808',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: isMobile ? '48px' : '80px',
      }}
    >
      {/* Giant R watermark behind everything */}
      <div
        style={{
          position: 'absolute',
          bottom: isMobile ? '120px' : '80px',
          left: isMobile ? '-40px' : '-20px',
          fontSize: isMobile ? 'clamp(280px, 80vw, 400px)' : 'clamp(400px, 45vw, 600px)',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.025)',
          lineHeight: 1,
          pointerEvents: 'none',
          zIndex: 0,
          userSelect: 'none',
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      >
        R
      </div>

      {/* Giant REFRACTWEB text */}
      <div
        ref={brandRef}
        className="footer-brand"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          textAlign: 'left',
          paddingLeft: isMobile ? '24px' : '100px',
          paddingRight: isMobile ? '24px' : '40px',
        }}
      >
        {/* Stroke layer (bottom) */}
        <div
          style={{
            fontSize: isMobile ? 'clamp(36px, 12vw, 56px)' : 'clamp(80px, 12vw, 160px)',
            fontWeight: 900,
            letterSpacing: '-2px',
            lineHeight: 1,
            textTransform: 'uppercase',
            fontFamily: 'Space Grotesk, sans-serif',
            WebkitTextStroke: isMobile ? '2px #8B3A0F' : '3px #8B3A0F',
            WebkitTextFillColor: 'transparent',
            position: 'absolute',
            top: 0,
            left: isMobile ? '24px' : '100px',
          }}
        >
          REFRACT LABS
        </div>
        {/* Gradient fill layer (top) */}
        <div
          style={{
            fontSize: isMobile ? 'clamp(36px, 12vw, 56px)' : 'clamp(80px, 12vw, 160px)',
            fontWeight: 900,
            letterSpacing: '-2px',
            lineHeight: 1,
            textTransform: 'uppercase',
            fontFamily: 'Space Grotesk, sans-serif',
            background: 'linear-gradient(135deg, #8B3A0F 0%, #C4622A 15%, #E8834A 25%, #F5A06A 35%, #E8834A 45%, #C4622A 55%, #8B3A0F 65%, #C4622A 75%, #E8834A 85%, #C4622A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            position: 'relative',
          }}
        >
          REFRACT LABS
        </div>
      </div>

      {/* Nav links row - 2 columns even on mobile */}
      <div
        ref={linksRowRef}
        className="footer-links-row"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: isMobile ? '40px 24px 48px 24px' : '48px 160px 56px 160px',
          marginTop: '8px',
        }}
      >
        {/* Left column - WEBSITE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'flex-start' }}>
          <span
            className="footer-nav-item"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            WEBSITE
          </span>
          {websiteLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="footer-nav-item footer-link"
              style={{
                fontSize: isMobile ? '13px' : '15px',
                fontWeight: 600,
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textDecoration: 'none',
                padding: isMobile ? '5px 0' : '6px 0',
                display: 'block',
                transition: 'color 0.2s ease',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right column - LEGAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'flex-end' }}>
          <span
            className="footer-nav-item"
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            LEGAL
          </span>
          {legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="footer-nav-item footer-link"
              style={{
                fontSize: isMobile ? '13px' : '15px',
                fontWeight: 600,
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textDecoration: 'none',
                padding: isMobile ? '5px 0' : '6px 0',
                display: 'block',
                transition: 'color 0.2s ease',
                cursor: 'pointer',
                textAlign: 'right',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Divider line */}
      <div
        style={{
          width: isMobile ? 'calc(100% - 48px)' : 'calc(100% - 320px)',
          margin: isMobile ? '0 24px' : '0 160px',
          height: '1px',
          background: 'rgba(255,255,255,0.08)',
        }}
      />

      {/* Bottom bar */}
      <div
        ref={bottomRef}
        className="footer-bottom"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? '24px' : '16px',
          padding: isMobile ? '32px 24px 40px 24px' : '24px 160px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Copyright - full text on mobile too, left aligned */}
        <span
          style={{
            fontSize: isMobile ? '9px' : '11px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            textAlign: 'left',
            lineHeight: 1.6,
            maxWidth: isMobile ? '280px' : 'none',
          }}
        >
          COPYRIGHT © 2026 PULSE PARTNERS AI LLC DBA REFRACT LABS. ALL RIGHTS RESERVED
        </span>

        {/* Contact link */}
        <div style={{ display: 'flex', alignItems: 'center', alignSelf: isMobile ? 'flex-start' : 'center' }}>
          <a
            href="tel:+917681909401"
            className="footer-social"
            style={{
              color: 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <span>Contact</span>
          </a>
        </div>
      </div>

      {/* CSS for hover effects */}
      <style>{`
        .footer-link:hover {
          color: rgba(194, 98, 42, 1) !important;
        }
        .footer-social:hover {
          color: white !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;

