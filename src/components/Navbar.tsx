import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const centerNavRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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
      <div ref={centerNavRef} className="nav-glass">
        <a href="#home" className="nav-logo-btn">RefractWeb</a>
        {!isMobile && (
          <>
            <a href="#home" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#works" className="nav-link">Works</a>
          </>
        )}
      </div>

      {/* Desktop: Work With Us Button */}
      {!isMobile && (
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
      )}

      {/* Mobile: Hamburger Menu */}
      {isMobile && (
        <button
          ref={hamburgerRef}
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
    </nav>
  );
};

export default Navbar;
