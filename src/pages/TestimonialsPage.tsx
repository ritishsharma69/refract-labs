import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTASection from '../components/CTASection';
import useSmoothScroll from '../hooks/useSmoothScroll';
import { fetchTestimonialItems, subscribeToContentUpdates, type TestimonialItem } from '../lib/content-store';

// Liquid Glass / Mirror-water card styles
const liquidGlass: React.CSSProperties = {
  position: 'relative',
  borderRadius: '24px',
  background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.06) 100%)',
  border: '1.5px solid rgba(255,255,255,0.15)',
  boxShadow:
    '0 8px 40px rgba(0,0,0,0.45), ' +
    'inset 0 1px 0 rgba(255,255,255,0.2), ' +
    'inset 0 -1px 0 rgba(255,255,255,0.05), ' +
    '0 1px 0 rgba(255,255,255,0.1)',
  backdropFilter: 'blur(28px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
  overflow: 'hidden',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
};

const liquidGlassHover: React.CSSProperties = {
  border: '1.5px solid rgba(255,255,255,0.28)',
  boxShadow:
    '0 20px 60px rgba(0,0,0,0.5), ' +
    'inset 0 1px 0 rgba(255,255,255,0.3), ' +
    'inset 0 -1px 0 rgba(255,255,255,0.08), ' +
    '0 1px 0 rgba(255,255,255,0.15), ' +
    '0 0 80px rgba(140,200,255,0.06), ' +
    '0 0 40px rgba(255,180,120,0.04)',
};

// Caustic light colors that rotate per card
const causticColors = [
  ['rgba(120,200,255,0.5)', 'rgba(180,140,255,0.4)'],  // blue + purple
  ['rgba(100,255,200,0.45)', 'rgba(120,200,255,0.4)'],  // teal + blue
  ['rgba(255,180,120,0.4)', 'rgba(255,140,180,0.35)'],  // warm orange + pink
  ['rgba(180,140,255,0.45)', 'rgba(100,255,200,0.4)'],  // purple + teal
];



const TestimonialsPage = () => {
  useSmoothScroll();
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<TestimonialItem | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () => fetchTestimonialItems().then(setItems).catch(() => {});
    load();
    const unsubscribe = subscribeToContentUpdates(load);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const heroElement = heroRef.current;
    const gridElement = gridRef.current;

    if (!heroElement || !gridElement) return;

    const ctx = gsap.context(() => {
      const heroChildren = Array.from(heroElement.children);
      const gridChildren = Array.from(gridElement.children);

      gsap.fromTo(heroChildren, { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out' });
      gsap.fromTo(gridChildren, { opacity: 0, y: 60, rotateX: -10 }, { opacity: 1, y: 0, rotateX: 0, stagger: 0.08, duration: 0.85, ease: 'power3.out', delay: 0.2 });
    });
    return () => ctx.revert();
  }, [items]);

  const particles = useMemo(
    () =>
      Array.from({ length: 78 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 1.5 + ((i * 11) % 4),
        opacity: 0.24 + (((i * 7) % 32) / 100),
        duration: 10 + ((i * 13) % 15),
        delay: -((i * 17) % 12) / 1.5,
      })),
    []
  );

  const stats = useMemo(() => ({
    total: items.length,
    videos: items.filter((item) => item.type === 'video').length,
    average: items.length ? (items.reduce((sum, item) => sum + (item.stars || 0), 0) / items.length).toFixed(1) : '0.0',
  }), [items]);

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: 'white', position: 'relative', overflow: 'hidden' }}>
      {/* Particle Layer */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0, opacity: 0.58 }}>
        {particles.map((p) => (
          <span
            key={p.id}
            style={{
              position: 'absolute',
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.92)',
              boxShadow: '0 0 12px rgba(255,255,255,0.26)',
              opacity: p.opacity,
              animation: `testimonialDrift ${p.duration}s ease-in-out ${p.delay}s infinite alternate, testimonialPulse ${Math.max(3.6, p.duration * 0.4)}s ease-in-out ${p.delay / 1.5}s infinite alternate`,
            }}
          />
        ))}
      </div>
      <Navbar />
      <section style={{ position: 'relative', overflow: 'hidden', padding: '140px 24px 80px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 20%, rgba(194,98,42,0.16), transparent 32%), radial-gradient(circle at 18% 70%, rgba(255,255,255,0.06), transparent 24%), linear-gradient(180deg, rgba(8,8,8,0.12), rgba(8,8,8,0.7))' }} />
        <div ref={heroRef} style={{ position: 'relative', zIndex: 1, maxWidth: '1120px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(40px, 8vw, 84px)', lineHeight: 0.96, fontWeight: 700 }}>What our
            <span style={{ display: 'block', color: '#ff9050' }}>clients say</span>
          </h1>
          <p style={{ maxWidth: '760px', margin: '20px auto 0', color: '#a1a1aa', lineHeight: 1.8, fontSize: '16px' }}>A clean testimonial space with our dark brand feel and subtle white particles in the background — focused on the stories, not the noise.</p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '28px' }}>
            <Link to="/contact" onClick={() => window.scrollTo(0, 0)}><button className="hero-cta-btn">Start a project</button></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '42px' }}>
            {[
              { label: 'Total Testimonials', value: stats.total },
              { label: 'Video Stories', value: stats.videos },
              { label: 'Average Rating', value: `${stats.average}/5` },
            ].map((stat) => <div key={stat.label} style={{ ...liquidGlass, padding: '22px' }}><div style={{ fontSize: '30px', fontWeight: 700 }}>{stat.value}</div><div style={{ fontSize: '12px', color: '#a1a1aa', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '8px' }}>{stat.label}</div></div>)}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 100px' }}>
        <div ref={gridRef} style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '20px',
        }}>
          {items.length > 0 ? items.map((item, index) => {
            const isHovered = hoveredCard === index;
            const colors = causticColors[index % causticColors.length];

            return (
              <article
                key={item.id}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  ...liquidGlass,
                  ...(isHovered ? liquidGlassHover : {}),
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'default',
                  transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  minHeight: '280px',
                }}
              >
                {/* === LIQUID GLASS LAYERS === */}

                {/* Layer 1: Top mirror reflection sweep */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-50%',
                  width: '200%',
                  height: '45%',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, transparent 100%)',
                  borderRadius: '24px 24px 50% 50%',
                  pointerEvents: 'none',
                  opacity: isHovered ? 1 : 0.7,
                  transition: 'opacity 0.5s ease',
                }} />

                {/* Layer 2: Moving shimmer reflection */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '60%',
                  background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 55%, transparent 70%)',
                  backgroundSize: '200% 100%',
                  animation: 'liquidShimmer 6s ease-in-out infinite',
                  animationDelay: `${index * 0.8}s`,
                  pointerEvents: 'none',
                  borderRadius: '24px',
                }} />

                {/* Layer 3: Caustic light spot 1 */}
                <div style={{
                  position: 'absolute',
                  top: '15%',
                  right: '10%',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${colors[0]} 0%, transparent 70%)`,
                  filter: 'blur(20px)',
                  pointerEvents: 'none',
                  animation: 'causticFloat 8s ease-in-out infinite',
                  animationDelay: `${index * 1.2}s`,
                  opacity: isHovered ? 1 : 0.6,
                  transition: 'opacity 0.4s ease',
                }} />

                {/* Layer 4: Caustic light spot 2 */}
                <div style={{
                  position: 'absolute',
                  bottom: '20%',
                  left: '8%',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${colors[1]} 0%, transparent 70%)`,
                  filter: 'blur(18px)',
                  pointerEvents: 'none',
                  animation: 'causticFloat2 10s ease-in-out infinite',
                  animationDelay: `${index * 0.6}s`,
                  opacity: isHovered ? 0.9 : 0.4,
                  transition: 'opacity 0.4s ease',
                }} />

                {/* Layer 5: Small bright caustic dot */}
                <div style={{
                  position: 'absolute',
                  top: '35%',
                  left: '55%',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)',
                  filter: 'blur(8px)',
                  pointerEvents: 'none',
                  animation: 'causticFloat 12s ease-in-out infinite reverse',
                  animationDelay: `${index * 1.5}s`,
                }} />

                {/* Layer 6: Glass thickness - bottom edge glow */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '10%',
                  right: '10%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), rgba(255,255,255,0.25), rgba(255,255,255,0.15), transparent)',
                  borderRadius: '0 0 24px 24px',
                  pointerEvents: 'none',
                }} />

                {/* Layer 7: Glass edge refraction - left/right */}
                <div style={{
                  position: 'absolute',
                  top: '15%',
                  bottom: '15%',
                  left: 0,
                  width: '1.5px',
                  background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.12), rgba(255,255,255,0.06), transparent)',
                  pointerEvents: 'none',
                  borderRadius: '24px 0 0 24px',
                }} />
                <div style={{
                  position: 'absolute',
                  top: '15%',
                  bottom: '15%',
                  right: 0,
                  width: '1.5px',
                  background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.08), rgba(255,255,255,0.04), transparent)',
                  pointerEvents: 'none',
                  borderRadius: '0 24px 24px 0',
                }} />

                {/* === CONTENT === */}
                <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                    <span style={{
                      fontSize: '10px',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: item.type === 'video' ? '#ff9050' : 'rgba(255,255,255,0.55)',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      background: item.type === 'video' ? 'rgba(224,112,48,0.1)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${item.type === 'video' ? 'rgba(224,112,48,0.18)' : 'rgba(255,255,255,0.1)'}`,
                      backdropFilter: 'blur(8px)',
                    }}>
                      {item.type === 'video' ? '▶ Video' : 'Testimonial'}
                    </span>
                    <span style={{ color: '#ff9050', fontSize: '13px', letterSpacing: '2px' }}>
                      {'★'.repeat(Math.max(1, Math.min(5, item.stars || 5)))}
                    </span>
                  </div>

                  {/* Video thumbnail */}
                  {item.type === 'video' && (
                    <button
                      onClick={() => setActiveVideo(item)}
                      style={{
                        width: '100%',
                        marginBottom: '18px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,0.03)',
                        position: 'relative',
                      }}
                    >
                      <div style={{
                        aspectRatio: '16 / 9',
                        background: item.thumbnailUrl
                          ? `url(${item.thumbnailUrl}) center/cover no-repeat`
                          : 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(120,200,255,0.06))',
                      }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(16px)',
                          border: '1.5px solid rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          color: 'white',
                          transition: 'all 0.3s ease',
                          transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        }}>▶</div>
                      </div>
                    </button>
                  )}

                  {/* Quote */}
                  <p style={{
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.8,
                    fontSize: '15px',
                    flex: 1,
                    fontStyle: 'italic',
                    margin: 0,
                  }}>
                    "{item.quote}"
                  </p>

                  {/* Person */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    marginTop: '22px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: item.avatarUrl
                        ? `url(${item.avatarUrl}) center/cover no-repeat`
                        : `linear-gradient(135deg, ${item.avatarColor || '#c2622a'}, #ff9050)`,
                      border: '2px solid rgba(255,255,255,0.15)',
                      flexShrink: 0,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                    }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginTop: '2px' }}>
                        {item.role} · {item.company}
                      </div>
                      {item.duration && (
                        <div style={{ color: '#ff9050', fontSize: '11px', marginTop: '4px' }}>{item.duration}</div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          }) : (
            <div style={{ ...liquidGlass, gridColumn: '1 / -1', padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '30px', fontWeight: 700, color: 'white' }}>No testimonials added yet</div>
              <p style={{ maxWidth: '640px', margin: '14px auto 0', color: '#a1a1aa', lineHeight: 1.8 }}>
                Add text or video testimonials from admin and they will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </section>
      <CTASection />
      <Footer />

      {activeVideo && (
        <div onClick={() => setActiveVideo(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 60 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(960px, 100%)', ...liquidGlass, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}><div><div style={{ fontWeight: 700 }}>{activeVideo.name}</div><div style={{ color: '#a1a1aa', fontSize: '14px' }}>{activeVideo.company}</div></div><button onClick={() => setActiveVideo(null)} style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '10px 16px' }}>Close</button></div>
            {activeVideo.videoUrl ? <video src={activeVideo.videoUrl} controls autoPlay style={{ width: '100%', borderRadius: '20px', background: '#000' }} /> : <div style={{ aspectRatio: '16 / 9', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #171717, #2f190f)', color: '#d4d4d8' }}>Add a video URL in admin to play this testimonial.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsPage;

