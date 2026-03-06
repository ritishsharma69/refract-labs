import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

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
      .fromTo(chipRef.current,
        { scale: 0.85, opacity: 0, rotate: -8 },
        { scale: 1, opacity: 1, rotate: 0, duration: 1.1, ease: 'power3.out' },
        '-=0.8'
      );

      // Floating animation for chip
      gsap.to(chipRef.current, {
        y: -12,
        duration: 3.5,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080808',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 48px',
      }}
    >
      {/* Diagonal light beam - warm orange/white streak from top-right to center-left */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '140%',
          height: '250px',
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
          height: '120px',
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
          left: '30%',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(194,98,42,0.1) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          maxWidth: '1200px',
          width: '100%',
          gap: '60px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left column - Text & CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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

          <button
            ref={buttonRef}
            className="hero-cta-btn"
            style={{ marginTop: '36px' }}
          >
            Start a Project
          </button>
        </div>

        {/* Right column - 3D chip visual */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            ref={chipRef}
            style={{
              width: '100%',
              maxWidth: '420px',
            }}
          >
            {!imageError && (
              <img
                src="/hero-3d.png"
                alt="3D CPU Chip Visual"
                style={{
                  width: '100%',
                  height: 'auto',
                  filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5)) drop-shadow(0 10px 30px rgba(194,98,42,0.2))',
                }}
                onError={() => setImageError(true)}
              />
            )}
            {imageError && (
              <div style={{ aspectRatio: '1/1', position: 'relative' }}>
                <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))' }}>
                  <defs>
                    <linearGradient id="ctaCpuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3a3a3a" />
                      <stop offset="50%" stopColor="#2a2a2a" />
                      <stop offset="100%" stopColor="#1a1a1a" />
                    </linearGradient>
                    <linearGradient id="ctaChipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4a4a4a" />
                      <stop offset="50%" stopColor="#333" />
                      <stop offset="100%" stopColor="#222" />
                    </linearGradient>
                    <linearGradient id="ctaGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c2622a" />
                      <stop offset="100%" stopColor="#a15432" />
                    </linearGradient>
                  </defs>
                  <rect x="60" y="60" width="280" height="280" rx="12" fill="url(#ctaCpuGrad)" stroke="#444" strokeWidth="2"/>
                  <rect x="100" y="100" width="200" height="200" rx="8" fill="url(#ctaChipGrad)" stroke="#555" strokeWidth="1"/>
                  <rect x="140" y="140" width="120" height="120" rx="4" fill="url(#ctaGlowGrad)" opacity="0.8"/>
                  <text x="200" y="210" textAnchor="middle" fill="white" fontSize="40" fontWeight="bold" fontFamily="Space Grotesk, sans-serif">R</text>
                  {[160, 180, 200, 220, 240].map((pos, i) => (
                    <g key={i}>
                      <line x1={pos} y1="145" x2={pos} y2="255" stroke="#222" strokeWidth="1" opacity="0.5"/>
                      <line x1="145" y1={pos} x2="255" y2={pos} stroke="#222" strokeWidth="1" opacity="0.5"/>
                    </g>
                  ))}
                  {[80, 110, 140, 170, 200, 230, 260, 290, 320].map((pos, i) => (
                    <g key={`p-${i}`}>
                      <rect x={pos - 4} y="40" width="8" height="20" rx="1" fill="#996644"/>
                      <rect x={pos - 4} y="340" width="8" height="20" rx="1" fill="#996644"/>
                      <rect x="40" y={pos - 4} width="20" height="8" rx="1" fill="#996644"/>
                      <rect x="340" y={pos - 4} width="20" height="8" rx="1" fill="#996644"/>
                    </g>
                  ))}
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

