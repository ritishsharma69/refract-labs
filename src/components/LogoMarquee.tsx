import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Logo Set Component - renders all logos once
const LogoSet = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '60px',
    paddingRight: '60px',
  }}>
    {/* React */}
    <div className="logo-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5, filter: 'brightness(0) invert(1)', transition: 'opacity 0.3s ease', whiteSpace: 'nowrap', cursor: 'default' }}>
      <svg viewBox="0 0 24 24" height="22">
        <circle cx="12" cy="12" r="2.5" fill="#61dafb"/>
        <ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="#61dafb" strokeWidth="1"/>
        <ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="#61dafb" strokeWidth="1" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="3.5" fill="none" stroke="#61dafb" strokeWidth="1" transform="rotate(120 12 12)"/>
      </svg>
      <span style={{ fontSize: '15px', fontWeight: 600, color: 'white' }}>React</span>
    </div>

    {/* Hotjar */}
    <div className="logo-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5, filter: 'brightness(0) invert(1)', transition: 'opacity 0.3s ease', whiteSpace: 'nowrap', cursor: 'default' }}>
      <svg viewBox="0 0 24 24" height="22" fill="#fd3a5c">
        <path d="M12 2C10 2 8 4 8 7C8 10 10 12 10 15C10 18 8 20 8 20H16C16 20 14 18 14 15C14 12 16 10 16 7C16 4 14 2 12 2Z"/>
      </svg>
      <span style={{ fontSize: '15px', fontWeight: 600, color: 'white' }}>hotjar</span>
    </div>

    {/* Blender */}
    <div className="logo-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5, filter: 'brightness(0) invert(1)', transition: 'opacity 0.3s ease', whiteSpace: 'nowrap', cursor: 'default' }}>
      <svg viewBox="0 0 24 24" height="22" fill="#e87d0d">
        <ellipse cx="14" cy="14" rx="7" ry="4.5"/>
        <circle cx="14" cy="14" r="1.5" fill="#1a1a1a"/>
        <path d="M2 12L9 12M4 9L9 12L4 15" fill="#e87d0d"/>
      </svg>
      <span style={{ fontSize: '15px', fontWeight: 600, color: 'white' }}>blender</span>
    </div>

    {/* Figma */}
    <div className="logo-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5, filter: 'brightness(0) invert(1)', transition: 'opacity 0.3s ease', whiteSpace: 'nowrap', cursor: 'default' }}>
      <svg viewBox="0 0 38 57" height="22" fill="white">
        <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
        <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0z"/>
        <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19H19z"/>
        <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
        <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
      </svg>
      <span style={{ fontSize: '15px', fontWeight: 600, color: 'white' }}>Figma</span>
    </div>

    {/* HOSTINGER */}
    <div className="logo-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5, filter: 'brightness(0) invert(1)', transition: 'opacity 0.3s ease', whiteSpace: 'nowrap', cursor: 'default' }}>
      <svg viewBox="0 0 24 24" height="20" fill="white">
        <path d="M4 4v16h4v-6h8v6h4V4h-4v6H8V4H4z"/>
      </svg>
      <span style={{ fontSize: '14px', fontWeight: 700, color: 'white', letterSpacing: '1px' }}>HOSTINGER</span>
    </div>

    {/* GSAP */}
    <div className="logo-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5, filter: 'brightness(0) invert(1)', transition: 'opacity 0.3s ease', whiteSpace: 'nowrap', cursor: 'default' }}>
      <span style={{ fontSize: '18px', fontWeight: 900, color: 'white', fontStyle: 'italic' }}>GSAP</span>
    </div>

    {/* Notion */}
    <div className="logo-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5, filter: 'brightness(0) invert(1)', transition: 'opacity 0.3s ease', whiteSpace: 'nowrap', cursor: 'default' }}>
      <svg viewBox="0 0 24 24" height="22" fill="white">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933z"/>
      </svg>
      <span style={{ fontSize: '15px', fontWeight: 600, color: 'white' }}>Notion</span>
    </div>

    {/* Vercel */}
    <div className="logo-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5, filter: 'brightness(0) invert(1)', transition: 'opacity 0.3s ease', whiteSpace: 'nowrap', cursor: 'default' }}>
      <svg viewBox="0 0 24 24" height="20" fill="white">
        <path d="M12 2L24 22H0L12 2Z"/>
      </svg>
      <span style={{ fontSize: '15px', fontWeight: 600, color: 'white' }}>Vercel</span>
    </div>

    {/* AWS */}
    <div className="logo-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5, filter: 'brightness(0) invert(1)', transition: 'opacity 0.3s ease', whiteSpace: 'nowrap', cursor: 'default' }}>
      <span style={{ fontSize: '20px', fontWeight: 700, color: 'white', fontFamily: 'Arial, sans-serif' }}>aws</span>
    </div>
  </div>
);

const LogoMarquee = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in on load
      gsap.fromTo(wrapperRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 1.2, ease: 'power3.out' }
      );

      // GSAP infinite scroll - translate from 0 to -50% for seamless loop
      animationRef.current = gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 35,
        ease: 'none',
        repeat: -1,
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  // Handle hover pause/resume
  const handleMouseEnter = () => {
    if (animationRef.current) {
      animationRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    if (animationRef.current) {
      animationRef.current.resume();
    }
  };

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 0',
        position: 'relative',
      }}
    >
      {/* Left fade overlay */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '160px',
        background: 'linear-gradient(to right, #080808 0%, transparent 100%)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {/* Right fade overlay */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '160px',
        background: 'linear-gradient(to left, #080808 0%, transparent 100%)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {/* Scrolling track - contains logos TWICE for seamless loop */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          width: 'max-content',
          alignItems: 'center',
        }}
      >
        <LogoSet />
        <LogoSet />
      </div>

      {/* CSS for hover effect on logo items */}
      <style>{`
        .logo-item:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default LogoMarquee;

