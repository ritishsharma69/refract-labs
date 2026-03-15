import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Particle Canvas Component ---
function CardParticles({ color, count = 28 }: { color: string; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<{ x: number; y: number; r: number; vx: number; vy: number; alpha: number; pulse: number }[]>([]);
  const animRef = useRef<number>(0);

  const init = useCallback((w: number, h: number) => {
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.15,
      pulse: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(2, 2);
      init(rect.width, rect.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width / 2;
      const h = canvas.height / 2;
      ctx.clearRect(0, 0, w, h);
      const now = Date.now() * 0.001;
      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        if (p.y < -5) p.y = h + 5;
        if (p.y > h + 5) p.y = -5;
        const a = p.alpha * (0.6 + 0.4 * Math.sin(now * 1.2 + p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(')', `,${a})`).replace('rgb(', 'rgba(');
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [color, init]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: '20px' }}
    />
  );
}

const SERVICES = [
  {
    id: '01',
    title: 'Web Development',
    description:
      'Transform concepts into high-performance experiences. We engineer story-driven websites that turn your brand into a premium digital product.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, rgba(194,98,42,0.15) 0%, rgba(194,98,42,0.03) 100%)',
    glowColor: 'rgba(194,98,42,0.12)',
    particleColor: 'rgb(194,98,42)',
    ambientGlow: 'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(194,98,42,0.08) 0%, transparent 70%)',
  },
  {
    id: '02',
    title: 'Branding',
    description:
      'We build strategic identities designed to secure a premium market position. Visual systems that scale across platforms.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, rgba(120,80,200,0.15) 0%, rgba(120,80,200,0.03) 100%)',
    glowColor: 'rgba(120,80,200,0.12)',
    particleColor: 'rgb(120,80,200)',
    ambientGlow: 'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(120,80,200,0.08) 0%, transparent 70%)',
  },
  {
    id: '03',
    title: 'Software / AI',
    description:
      'We replace manual processes with intelligent software tailored to your specific operations. Custom AI solutions that adapt smarter.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 9l-3 3 3 3m8-6l3 3-3 3m-5-9l-2 12" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, rgba(50,180,160,0.15) 0%, rgba(50,180,160,0.03) 100%)',
    glowColor: 'rgba(50,180,160,0.12)',
    particleColor: 'rgb(50,180,160)',
    ambientGlow: 'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(50,180,160,0.08) 0%, transparent 70%)',
  },
  {
    id: '04',
    title: '3D Animation',
    description:
      'We build cinematic 3D assets designed to give your brand a premium feel. Motion graphics that captivate and convert.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, rgba(220,120,60,0.15) 0%, rgba(220,120,60,0.03) 100%)',
    glowColor: 'rgba(220,120,60,0.12)',
    particleColor: 'rgb(220,120,60)',
    ambientGlow: 'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(220,120,60,0.08) 0%, transparent 70%)',
  },
];

export function VerticalTabs() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );
      gsap.fromTo(
        cardsRef.current?.children || [],
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#080808',
        padding: isMobile ? '60px 20px' : '100px 80px',
      }}
    >
      {/* Subtle copper glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: isMobile
            ? 'radial-gradient(ellipse 400px 350px at 50% 30%, rgba(130,55,15,0.12) 0%, transparent 65%)'
            : 'radial-gradient(ellipse 800px 500px at 50% 50%, rgba(130,55,15,0.14) 0%, transparent 65%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: isMobile ? '36px' : '64px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#c2622a',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '14px',
            }}
          >
            Services
          </span>
          <h2
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: isMobile ? '28px' : '46px',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.15,
            }}
          >
            Core capabilities
          </h2>
          <p
            style={{
              fontSize: isMobile ? '14px' : '16px',
              color: '#777',
              maxWidth: '520px',
              margin: '16px auto 0',
              lineHeight: 1.7,
            }}
          >
            From brand identity to custom software — we build the entire ecosystem your business runs on.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          ref={cardsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: isMobile ? '16px' : '20px',
          }}
        >
          {SERVICES.map((service) => (
            <div
              key={service.id}
              style={{
                position: 'relative',
                background: '#111113',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: isMobile ? '28px 24px' : '36px 36px 32px',
                cursor: 'default',
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.border = '1px solid rgba(194,98,42,0.2)';
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 0 40px ' + service.glowColor;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.border = '1px solid rgba(255,255,255,0.06)';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Particle effect */}
              <CardParticles color={service.particleColor} count={24} />

              {/* Ambient color glow - always visible */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: service.ambientGlow,
                  pointerEvents: 'none',
                  borderRadius: '20px',
                }}
              />

              {/* Background gradient on hover area */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: service.gradient,
                  opacity: 0,
                  transition: 'opacity 0.4s ease',
                  borderRadius: '20px',
                  pointerEvents: 'none',
                }}
                className="card-gradient-bg"
              />

              {/* Number + Icon row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', position: 'relative' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.15)',
                    fontFamily: 'Space Grotesk, sans-serif',
                    letterSpacing: '0.1em',
                  }}
                >
                  /{service.id}
                </span>
                <div style={{ color: '#666', transition: 'color 0.3s ease' }}>
                  {service.icon}
                </div>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: isMobile ? '22px' : '26px',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '14px',
                  position: 'relative',
                }}
              >
                {service.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: '14px',
                  color: '#888',
                  lineHeight: 1.75,
                  position: 'relative',
                }}
              >
                {service.description}
              </p>

              {/* Bottom accent line */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '36px',
                  right: '36px',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(194,98,42,0.3), transparent)',
                  opacity: 0.5,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default VerticalTabs;
