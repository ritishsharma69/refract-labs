import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';

const Navbar = () => {
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const centerNavRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(centerNavRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
      if (!isMobile) {
        gsap.fromTo(buttonRef.current,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.4 }
        );
      } else {
        gsap.fromTo(hamburgerRef.current,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.4 }
        );
      }
    }, navRef);
    return () => ctx.revert();
  }, [isMobile]);

  // Animate mobile menu open/close
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (menuOpen) {
        gsap.to(mobileMenuRef.current, {
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.fromTo('.mobile-menu-link',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 0.1 }
        );
        gsap.fromTo('.mobile-menu-cta',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.4 }
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          pointerEvents: 'none',
          duration: 0.2,
          ease: 'power2.in',
        });
      }
    }
  }, [menuOpen]);

  const mobileLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Works', href: '/works' },
  ];

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'space-between' : 'center',
        padding: isMobile ? '16px 20px' : '20px 40px',
      }}
    >
      {/* Logo/Nav Glass Pill */}
      <div
        ref={centerNavRef}
        className={isMobile ? '' : 'nav-glass'}
        style={isMobile ? {
          background: 'rgba(30, 30, 30, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '9999px',
          padding: '12px 20px',
          border: '1px solid rgba(255,255,255,0.08)',
        } : undefined}
      >
        <Link
          to="/"
          className={isMobile ? '' : 'nav-logo-btn'}
          style={isMobile ? {
            color: 'white',
            fontSize: '15px',
            fontWeight: 600,
            fontFamily: 'Space Grotesk, sans-serif',
            letterSpacing: '-0.3px',
            textDecoration: 'none',
          } : undefined}
        >
          RefractWeb
        </Link>
        {!isMobile && (
          <>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
            <Link to="/works" className={`nav-link ${location.pathname === '/works' ? 'active' : ''}`}>Works</Link>
          </>
        )}
      </div>

      {/* Desktop: Work With Us Button */}
      {!isMobile && (
        <Link to="/contact">
          <button
            ref={buttonRef}
            className="cta-btn"
            style={{
              position: 'absolute',
              right: '40px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            Work With Us
          </button>
        </Link>
      )}

      {/* Mobile: Hamburger Menu */}
      {isMobile && (
        <button
          ref={hamburgerRef}
          onClick={() => setMenuOpen(true)}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
            <path d="M1 1H19M1 7H19M1 13H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <div
          ref={mobileMenuRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            background: '#0a0a0a',
            zIndex: 200,
            opacity: 0,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top bar with logo and close button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
            }}
          >
            {/* Logo pill */}
            <div
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                borderRadius: '40px',
                padding: '12px 20px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span
                style={{
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'Space Grotesk, sans-serif',
                  letterSpacing: '-0.3px',
                }}
              >
                RefractWeb
              </span>
            </div>

            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2L14 14M14 2L2 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Menu links */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 32px',
              gap: '0',
            }}
          >
            {mobileLinks.map((link, index) => (
              <Link
                key={link.label}
                to={link.href}
                className="mobile-menu-link"
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: 'clamp(40px, 10vw, 56px)',
                  fontWeight: 500,
                  fontFamily: 'Space Grotesk, sans-serif',
                  color: location.pathname === link.href ? 'white' : 'rgba(255,255,255,0.5)',
                  textDecoration: 'none',
                  padding: '16px 0',
                  borderBottom: index < mobileLinks.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  display: 'block',
                  letterSpacing: '-1px',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Bottom CTA button */}
          <div
            style={{
              padding: '24px 32px 48px 32px',
            }}
          >
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              <button
                className="mobile-menu-cta"
                style={{
                  width: '100%',
                  padding: '18px 32px',
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #B8622E 0%, #D4956A 50%, #B8622E 100%)',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: 'Space Grotesk, sans-serif',
                  cursor: 'pointer',
                  letterSpacing: '0.5px',
                }}
              >
                Work With Us
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
