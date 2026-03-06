import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.fromTo(badgeRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      )
        .fromTo(
          headingRef.current?.querySelectorAll('.word') || [],
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power4.out' },
          '-=0.4'
        )
        .fromTo(
          descRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          buttonsRef.current?.children || [],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          imageRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' },
          '-=0.8'
        );

      // Floating animation for 3D visual
      gsap.to(imageRef.current, {
        y: -15,
        duration: 3,
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
      id="home"
      style={{
        width: '100%',
        minHeight: isMobile ? 'auto' : 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: '#080808',
      }}
    >
      {/* Copper radial glow - positioned at CENTER-LEFT (35% 52%) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isMobile
            ? 'radial-gradient(ellipse 400px 400px at 50% 30%, rgba(165,72,18,0.50) 0%, rgba(100,40,8,0.25) 30%, transparent 65%)'
            : 'radial-gradient(ellipse 1000px 800px at 35% 52%, rgba(165,72,18,0.60) 0%, rgba(100,40,8,0.30) 30%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content container */}
      <div
        style={{
          display: isMobile ? 'flex' : 'grid',
          flexDirection: 'column',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          alignItems: 'center',
          flex: 1,
          width: '100%',
          maxWidth: '1300px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: isMobile ? '100px 24px 40px 24px' : '80px 45px 45px 110px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Left Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingRight: isMobile ? '0' : '40px',
          textAlign: 'left',
          order: isMobile ? 2 : 1,
        }}>
            {/* Badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2.5"
              style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '50px',
                padding: '6px 14px',
                fontSize: isMobile ? '12px' : '13px',
                alignSelf: 'flex-start',
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#e07030' }} />
              <span className="text-gray-300 font-medium">2 more Q1 spots available</span>
            </div>

            {/* Heading */}
            <h1
              ref={headingRef}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: isMobile ? '36px' : '68px',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.1,
                marginTop: '16px',
              }}
            >
              <span className="word inline-block">Defining</span>
              <br />
              <span className="word inline-block">Digital Identity</span>
            </h1>

            {/* Subtext */}
            <p
              ref={descRef}
              style={{
                fontSize: isMobile ? '14px' : '16px',
                color: '#999',
                maxWidth: isMobile ? '100%' : '400px',
                marginTop: '20px',
                lineHeight: 1.7,
              }}
            >
              We merge the precision of code with the power of design,
              orchestrating a single identity that signals authority everywhere.
            </p>

            {/* CTAs */}
            <div
              ref={buttonsRef}
              className="flex items-center"
              style={{
                marginTop: isMobile ? '28px' : '36px',
                gap: isMobile ? '16px' : '20px',
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: isMobile ? '100%' : 'auto',
                justifyContent: isMobile ? 'flex-start' : 'flex-start',
              }}
            >
              <button
                className="hero-cta-btn"
                style={{
                  width: 'auto',
                  padding: isMobile ? '12px 24px' : '14px 32px',
                  fontSize: isMobile ? '14px' : '15px',
                }}
              >
                Work With Us
              </button>
              <button
                className="group flex items-center gap-2 text-white hover:text-white/80 transition-colors"
                style={{ fontSize: isMobile ? '14px' : '15px' }}
              >
                <span>Explore our services</span>
                <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

        {/* Right Column - 3D Visual */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingRight: isMobile ? '0' : '60px',
          order: isMobile ? 1 : 2,
          marginBottom: isMobile ? '24px' : '0',
        }}>
          <div
            ref={imageRef}
            style={{
              width: isMobile ? '280px' : '500px',
              height: 'auto',
              display: 'block',
            }}
          >
            {!imageError && (
              <img
                src="/hero-3d.png"
                alt="3D CPU Chip"
                style={{
                  width: '100%',
                  height: 'auto',
                  filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.6))',
                }}
                onError={() => setImageError(true)}
              />
            )}
            {imageError && (
              <div style={{ aspectRatio: '1/1', position: 'relative' }}>
                <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.6))' }}>
                  <defs>
                    <linearGradient id="cpuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3a3a3a" />
                      <stop offset="50%" stopColor="#2a2a2a" />
                      <stop offset="100%" stopColor="#1a1a1a" />
                    </linearGradient>
                    <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4a4a4a" />
                      <stop offset="50%" stopColor="#333" />
                      <stop offset="100%" stopColor="#222" />
                    </linearGradient>
                    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c2622a" />
                      <stop offset="100%" stopColor="#a15432" />
                    </linearGradient>
                  </defs>
                  <rect x="60" y="60" width="280" height="280" rx="12" fill="url(#cpuGrad)" stroke="#444" strokeWidth="2"/>
                  <rect x="100" y="100" width="200" height="200" rx="8" fill="url(#chipGrad)" stroke="#555" strokeWidth="1"/>
                  <rect x="140" y="140" width="120" height="120" rx="4" fill="url(#glowGrad)" opacity="0.8"/>
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

export default Hero;
