import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { SplineScene } from './ui/splite';
import { Spotlight } from './ui/spotlight';

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
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
        minHeight: isMobile ? 'auto' : 'calc(100vh - 140px)',
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
          order: 1,
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
              <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
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
              </Link>
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

        {/* Right Column - 3D Robot Spline Scene */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          order: isMobile ? 2 : 2,
          flex: 1,
          width: isMobile ? '100%' : 'auto',
          marginTop: isMobile ? '32px' : '0',
          position: 'relative',
        }}>
          {/* Spotlight effect */}
          <Spotlight
            className="-top-40 left-0 md:left-10 md:-top-20"
            fill="#e07030"
          />
          <div
            ref={imageRef}
            style={{
              width: '100%',
              maxWidth: isMobile ? '400px' : '800px',
              minHeight: isMobile ? '400px' : '550px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `scale(${isMobile ? 1.26 : 1.2})`,
                transformOrigin: 'center center',
                willChange: 'transform',
              }}
            >
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
