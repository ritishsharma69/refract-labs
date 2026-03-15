import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
};

// 12 icons with their corner glow colors (warm copper/purple palette)
const allIcons = [
  { name: 'Vercel', color: '#fff', glow1: 'rgba(147, 51, 234, 0.6)', glow2: 'rgba(219, 39, 119, 0.6)' },
  { name: 'Figma', color: '#fff', glow1: 'rgba(6, 182, 212, 0.6)', glow2: 'rgba(29, 78, 216, 0.6)' },
  { name: 'Blender', color: '#e87d0d', glow1: 'rgba(67, 56, 202, 0.6)', glow2: 'rgba(126, 34, 206, 0.6)' },
  { name: 'AWS', color: '#ff9900', glow1: 'rgba(194, 65, 12, 0.6)', glow2: 'rgba(202, 138, 4, 0.6)' },
  { name: 'After Effects', color: '#9999ff', glow1: 'rgba(194, 65, 12, 0.6)', glow2: 'rgba(180, 83, 9, 0.6)' },
  { name: 'Next.js', color: '#fff', glow1: 'rgba(88, 28, 135, 0.6)', glow2: 'rgba(109, 40, 217, 0.6)' },
  { name: 'React', color: '#61dafb', glow1: 'rgba(19, 78, 74, 0.6)', glow2: 'rgba(8, 145, 178, 0.6)' },
  { name: 'GSAP', color: '#88ce02', glow1: 'rgba(88, 28, 135, 0.6)', glow2: 'rgba(190, 24, 93, 0.6)' },
  { name: 'TypeScript', color: '#3178c6', glow1: 'rgba(4, 47, 46, 0.6)', glow2: 'rgba(6, 95, 70, 0.6)' },
  { name: 'Hotjar', color: '#fd3a5c', glow1: 'rgba(15, 23, 42, 0.6)', glow2: 'rgba(17, 94, 89, 0.6)' },
  { name: 'AdobeCloud', color: '#ff5722', glow1: 'rgba(113, 63, 18, 0.6)', glow2: 'rgba(154, 52, 18, 0.6)' },
  { name: 'Notion', color: '#fff', glow1: 'rgba(67, 20, 7, 0.6)', glow2: 'rgba(127, 29, 29, 0.6)' },
];

// SVG Icons for each tech
const IconComponent = ({ name, color }) => {
  const iconStyle = { width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' };

  switch (name) {
    case 'Vercel':
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill={color}>
          <polygon points="12,2 22,20 2,20" />
        </svg>
      );
    case 'React':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="0.8">
          <circle cx="12" cy="12" r="2" fill={color} />
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </svg>
      );
    case 'GSAP':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <path d="M4 8C4 8 6 4 12 4C18 4 20 8 20 8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <path d="M4 12H20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <path d="M4 16C4 16 6 20 12 20C18 20 20 16 20 16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case 'Blender':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill={color}>
          <ellipse cx="14" cy="14" rx="7" ry="5"/>
          <circle cx="14" cy="14" r="2" fill="#1a1a1a"/>
          <path d="M2 12L10 12" strokeWidth="2" stroke={color}/>
          <path d="M4 8L10 12L4 16" fill={color}/>
        </svg>
      );
    case 'Next.js':
      return (
        <div style={iconStyle}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 8L16 16M8 8V16M16 8V12" stroke={color} strokeWidth="1.5"/>
          </svg>
        </div>
      );
    case 'AWS':
      return <span style={{ fontSize: '18px', fontWeight: 700, color, fontFamily: 'Arial' }}>aws</span>;
    case 'After Effects':
      return (
        <div style={{ width: 40, height: 40, background: '#9999ff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#1a0a2e' }}>Ae</span>
        </div>
      );
    case 'TypeScript':
      return (
        <div style={{ width: 40, height: 40, background: '#3178c6', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>TS</span>
        </div>
      );
    case 'Figma':
      return (
        <svg width="32" height="44" viewBox="0 0 38 57" fill="none">
          <circle cx="19" cy="9.5" r="9.5" fill="#F24E1E" />
          <circle cx="28.5" cy="28.5" r="9.5" fill="#FF7262" />
          <circle cx="9.5" cy="9.5" r="9.5" fill="#A259FF" />
          <circle cx="9.5" cy="28.5" r="9.5" fill="#1ABCFE" />
          <circle cx="9.5" cy="47.5" r="9.5" fill="#0ACF83" />
        </svg>
      );
    case 'Hotjar':
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill={color}>
          <path d="M12 2C10 2 8 4 8 7C8 10 10 12 10 15C10 18 8 20 8 20H16C16 20 14 18 14 15C14 12 16 10 16 7C16 4 14 2 12 2Z"/>
        </svg>
      );
    case 'Notion':
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
          <rect x="4" y="3" width="16" height="18" rx="2"/>
          <path d="M8 7H16M8 11H14M8 15H12"/>
        </svg>
      );
    case 'AdobeCloud':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill={color}>
          <path d="M6 18C3 18 2 15 4 13C2 11 3 8 6 8C7 5 10 4 12 6C14 4 17 5 18 8C21 8 22 11 20 13C22 15 21 18 18 18H6Z"/>
        </svg>
      );
    default:
      return <span style={{ color, fontSize: '24px', fontWeight: 600 }}>{name[0]}</span>;
  }
};

const BuildEnvironment = () => {
  const cardRef = useRef(null);
  const gridRef = useRef(null);
  const rafRef = useRef(null);
  const trailRef = useRef([]);
  const isMobile = useIsMobile();

  // Smooth cursor position (lerped for buttery feel)
  const cursorPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [trail, setTrail] = useState([]); // Trail orbs array
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device on mount
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // RAF-based smooth cursor animation loop
  useEffect(() => {
    if (isTouchDevice) return;

    const animate = () => {
      // Lerp cursor position for smooth follow (0.15 = responsiveness)
      cursorPos.current.x += (targetPos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (targetPos.current.y - cursorPos.current.y) * 0.15;

      setMousePos({
        x: cursorPos.current.x,
        y: cursorPos.current.y
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isTouchDevice]);

  // Spawn trail orbs
  const spawnTrailOrb = useCallback((x, y) => {
    const now = Date.now();
    const newOrb = {
      id: now,
      x,
      y,
      opacity: 0.6,
      scale: 1,
      birth: now
    };

    setTrail(prev => {
      const filtered = prev.filter(orb => now - orb.birth < 800); // Remove old orbs
      return [...filtered.slice(-4), newOrb]; // Keep max 5 orbs
    });
  }, []);

  // Handle mouse move on card
  const handleCardMouseMove = useCallback((e) => {
    if (!cardRef.current || isTouchDevice) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    targetPos.current = { x, y };
    setIsHovering(true);

    // Spawn trail orbs at intervals
    const lastOrb = trailRef.current[trailRef.current.length - 1];
    if (!lastOrb || Date.now() - lastOrb > 50) {
      spawnTrailOrb(x, y);
      trailRef.current.push(Date.now());
      if (trailRef.current.length > 10) trailRef.current.shift();
    }
  }, [isTouchDevice, spawnTrailOrb]);

  const handleCardMouseLeave = useCallback(() => {
    setIsHovering(false);
    setTrail([]);
  }, []);

  return (
    <section style={{ width: '100%', padding: isMobile ? '40px 20px' : '60px 120px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Main Card - Reduced height by ~25% */}
        <div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          style={{
            background: 'linear-gradient(135deg, #0a0e17 0%, #0f1521 40%, #0a0d14 100%)',
            borderRadius: isMobile ? '16px' : '24px',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: isMobile ? '32px 24px' : '48px 56px',
            display: isMobile ? 'flex' : 'grid',
            flexDirection: isMobile ? 'column' : undefined,
            gridTemplateColumns: isMobile ? undefined : '1fr 1.2fr',
            alignItems: 'center',
            gap: isMobile ? '32px' : '40px',
            minHeight: isMobile ? 'auto' : '380px',
            maxHeight: isMobile ? 'none' : '480px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            willChange: 'transform',
          }}
        >
          {/* Background Glows - Ambient lighting */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: isMobile
              ? 'radial-gradient(ellipse 250px 200px at 20% 30%, rgba(180,80,30,0.22) 0%, transparent 55%)'
              : 'radial-gradient(ellipse 450px 350px at 15% 65%, rgba(180,80,30,0.22) 0%, transparent 55%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: isMobile
              ? 'radial-gradient(ellipse 200px 180px at 80% 70%, rgba(100,50,140,0.18) 0%, transparent 55%)'
              : 'radial-gradient(ellipse 380px 300px at 85% 45%, rgba(100,50,140,0.18) 0%, transparent 55%)',
          }} />

          {/* Mouse Follow Glow Effect - Main circular glow */}
          {!isTouchDevice && (
            <>
              {/* Outer diffuse glow */}
              <div style={{
                position: 'absolute',
                left: mousePos.x,
                top: mousePos.y,
                transform: 'translate3d(-50%, -50%, 0)', // GPU accelerated
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,180,220,0.08) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)',
                pointerEvents: 'none',
                opacity: isHovering ? 1 : 0,
                transition: 'opacity 0.4s ease-out',
                zIndex: 30,
                mixBlendMode: 'screen',
              }} />

              {/* Inner core glow */}
              <div style={{
                position: 'absolute',
                left: mousePos.x,
                top: mousePos.y,
                transform: 'translate3d(-50%, -50%, 0)',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(165,243,252,0.08) 30%, transparent 65%)',
                pointerEvents: 'none',
                opacity: isHovering ? 1 : 0,
                transition: 'opacity 0.3s ease-out',
                zIndex: 31,
                mixBlendMode: 'screen',
              }} />

              {/* Glowing ring cursor */}
              <div style={{
                position: 'absolute',
                left: mousePos.x,
                top: mousePos.y,
                transform: 'translate3d(-50%, -50%, 0)',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '1.5px solid rgba(0,212,255,0.7)',
                boxShadow: '0 0 15px rgba(0,212,255,0.5), 0 0 30px rgba(0,212,255,0.2), inset 0 0 8px rgba(255,255,255,0.1)',
                pointerEvents: 'none',
                opacity: isHovering ? 1 : 0,
                transition: 'opacity 0.2s ease-out, transform 0.1s ease-out',
                zIndex: 32,
              }} />

              {/* Trail orbs */}
              {trail.map((orb, i) => {
                const age = Date.now() - orb.birth;
                const progress = Math.min(age / 800, 1); // 800ms lifetime
                const opacity = (1 - progress) * 0.5;
                const scale = 1 - progress * 0.7;

                return (
                  <div
                    key={orb.id}
                    style={{
                      position: 'absolute',
                      left: orb.x,
                      top: orb.y,
                      transform: `translate3d(-50%, -50%, 0) scale(${scale})`,
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, rgba(0,212,255,${opacity}) 0%, rgba(139,92,246,${opacity * 0.5}) 50%, transparent 100%)`,
                      pointerEvents: 'none',
                      zIndex: 29,
                    }}
                  />
                );
              })}
            </>
          )}

          {/* Left Side - Text Content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingRight: isMobile ? '0' : '40px',
            position: 'relative',
            zIndex: 5,
            textAlign: isMobile ? 'center' : 'left',
            alignItems: isMobile ? 'center' : 'flex-start',
          }}>
            <h2 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-1.2px',
              lineHeight: 1.15,
              margin: 0,
            }}>
              The build environment.
            </h2>
            <p style={{
              color: 'rgba(156,163,175,0.9)',
              fontSize: isMobile ? '13px' : '14px',
              lineHeight: 1.7,
              marginTop: isMobile ? '12px' : '16px',
              maxWidth: '320px',
            }}>
              A proven stack for speed and scale. We leverage these tools to ensure reliability and uncompromising polish.
            </p>
            <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
              <button style={{
                background: 'linear-gradient(135deg, #c2622a 0%, #d4713a 100%)',
                borderRadius: '50px',
                padding: isMobile ? '10px 20px' : '12px 24px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                width: 'fit-content',
                marginTop: isMobile ? '20px' : '28px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 4px 20px rgba(194,98,42,0.3)',
              }}>
                Start a project
              </button>
            </Link>
          </div>

          {/* Right Side - Icon Grid - Compact layout */}
          <div
            ref={gridRef}
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
              gridTemplateRows: isMobile ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
              gap: isMobile ? '6px' : '8px',
              zIndex: 5,
              width: '100%',
            }}
          >
            {/* Icon Cells - 12 icons with corner glows */}
            {allIcons.map((icon, index) => (
              <div
                key={icon.name}
                role="img"
                aria-label={icon.name}
                onMouseEnter={() => !isMobile && setHoveredCell(index)}
                onMouseLeave={() => !isMobile && setHoveredCell(null)}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: isMobile ? '60px' : '80px',
                  borderRadius: isMobile ? '8px' : '10px',
                  backgroundColor: 'rgb(14, 14, 18)',
                  backgroundImage: 'radial-gradient(rgba(30, 30, 35, 0.8) 1px, transparent 1px)',
                  backgroundSize: '8px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transform: !isMobile && hoveredCell === index ? 'scale(1.03)' : 'scale(1)',
                  transition: 'transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94)',
                  willChange: 'transform',
                }}
              >
                {/* Corner Glows - Diagonal placement */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1,
                  pointerEvents: 'none',
                  transform: index % 2 === 1 ? 'rotate(90deg)' : 'none',
                }}>
                  {/* Bottom-left glow */}
                  <div style={{
                    position: 'absolute',
                    width: '45%',
                    height: '45%',
                    borderRadius: '50%',
                    bottom: '-10%',
                    left: '-10%',
                    background: icon.glow1,
                    filter: 'blur(16px)',
                    opacity: hoveredCell === index ? 0.9 : 0.6,
                    transition: 'opacity 0.3s ease',
                  }} />
                  {/* Top-right glow */}
                  <div style={{
                    position: 'absolute',
                    width: '45%',
                    height: '45%',
                    borderRadius: '50%',
                    top: '-10%',
                    right: '-10%',
                    background: icon.glow2,
                    filter: 'blur(16px)',
                    opacity: hoveredCell === index ? 0.9 : 0.6,
                    transition: 'opacity 0.3s ease',
                  }} />
                </div>

                {/* Icon - Centered with subtle glow on hover */}
                <div style={{
                  position: 'relative',
                  zIndex: 10,
                  transform: hoveredCell === index ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                  filter: hoveredCell === index ? 'brightness(1.15)' : 'brightness(1)',
                }}>
                  <IconComponent name={icon.name} color={icon.color} />
                </div>

                {/* Subtle noise texture overlay */}
                <svg style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  zIndex: 15,
                  opacity: 0.3,
                  mixBlendMode: 'overlay',
                }}>
                  <filter id={`noise-${index}`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" stitchTiles="stitch" />
                  </filter>
                  <rect width="100%" height="100%" filter={`url(#noise-${index})`} />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuildEnvironment;

