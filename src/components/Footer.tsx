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
      gsap.from(brandRef.current, {
        opacity: 0,
        scale: 0.97,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: brandRef.current,
          start: 'top 85%',
        },
      });

      // Nav links stagger animation
      gsap.from('.footer-nav-item', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: linksRowRef.current,
          start: 'top 85%',
        },
      });

      // Bottom bar animation
      gsap.from(bottomRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: bottomRef.current,
          start: 'top 95%',
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const websiteLinks = ['HOME', 'SERVICES', 'ABOUT', 'WORK WITH US'];
  const legalLinks = ['TERMS OF SERVICE', 'PRIVACY POLICY', 'COOKIE POLICY'];

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
      {/* Giant R watermark behind everything - hidden on mobile */}
      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '-20px',
            fontSize: 'clamp(400px, 45vw, 600px)',
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
      )}

      {/* Giant REFRACTWEB text */}
      <div
        ref={brandRef}
        className="footer-brand"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          textAlign: isMobile ? 'center' : 'left',
          paddingLeft: isMobile ? '24px' : '100px',
          paddingRight: isMobile ? '24px' : '40px',
        }}
      >
        {/* Stroke layer (bottom) - simplified for mobile */}
        <div
          style={{
            fontSize: isMobile ? 'clamp(32px, 10vw, 48px)' : 'clamp(80px, 12vw, 160px)',
            fontWeight: 900,
            letterSpacing: '-2px',
            lineHeight: 1,
            textTransform: 'uppercase',
            fontFamily: 'Space Grotesk, sans-serif',
            WebkitTextStroke: isMobile ? '2px #8B3A0F' : '3px #8B3A0F',
            WebkitTextFillColor: 'transparent',
            position: 'absolute',
            top: 0,
            left: isMobile ? '50%' : '100px',
            transform: isMobile ? 'translateX(-50%)' : 'none',
          }}
        >
          REFRACTWEB
        </div>
        {/* Gradient fill layer (top) */}
        <div
          style={{
            fontSize: isMobile ? 'clamp(32px, 10vw, 48px)' : 'clamp(80px, 12vw, 160px)',
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
          REFRACTWEB
        </div>
      </div>

      {/* Nav links row */}
      <div
        ref={linksRowRef}
        className="footer-links-row"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: isMobile ? 'center' : 'space-between',
          alignItems: isMobile ? 'center' : 'flex-start',
          gap: isMobile ? '32px' : '0',
          padding: isMobile ? '32px 24px 40px 24px' : '48px 160px 56px 160px',
          marginTop: '8px',
        }}
      >
        {/* Left column - WEBSITE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: isMobile ? 'center' : 'flex-start' }}>
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
              key={link}
              href="#"
              className="footer-nav-item footer-link"
              style={{
                fontSize: isMobile ? '14px' : '15px',
                fontWeight: 600,
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textDecoration: 'none',
                padding: '6px 0',
                display: 'block',
                transition: 'color 0.2s ease',
                cursor: 'pointer',
                textAlign: isMobile ? 'center' : 'left',
              }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right column - LEGAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: isMobile ? 'center' : 'flex-end' }}>
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
              key={link}
              href="#"
              className="footer-nav-item footer-link"
              style={{
                fontSize: isMobile ? '14px' : '15px',
                fontWeight: 600,
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textDecoration: 'none',
                padding: '6px 0',
                display: 'block',
                transition: 'color 0.2s ease',
                cursor: 'pointer',
                textAlign: isMobile ? 'center' : 'right',
              }}
            >
              {link}
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
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: isMobile ? 'center' : 'space-between',
          alignItems: 'center',
          gap: isMobile ? '16px' : '0',
          padding: isMobile ? '24px' : '24px 160px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Copyright */}
        <span
          style={{
            fontSize: isMobile ? '9px' : '11px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            textAlign: isMobile ? 'center' : 'left',
            order: isMobile ? 1 : 0,
          }}
        >
          {isMobile ? '© 2026 REFRACTWEB. ALL RIGHTS RESERVED' : 'COPYRIGHT © 2026 PULSE PARTNERS AI LLC DBA REFRACTWEB. ALL RIGHTS RESERVED'}
        </span>

        {/* Social icons */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {/* Twitter/X */}
          <a
            href="#"
            className="footer-social"
            style={{
              color: 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.739l7.732-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="#"
            className="footer-social"
            style={{
              color: 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="#"
            className="footer-social"
            style={{
              color: 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
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

