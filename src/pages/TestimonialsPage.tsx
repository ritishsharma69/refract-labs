import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTASection from '../components/CTASection';
import useSmoothScroll from '../hooks/useSmoothScroll';
import { getTestimonialItems, subscribeToContentUpdates, type TestimonialItem } from '../lib/content-store';

const cardBase: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'linear-gradient(180deg, rgba(18,18,18,0.88), rgba(10,10,10,0.82))',
  boxShadow: '0 30px 80px rgba(0,0,0,0.32)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
};

const TestimonialsPage = () => {
  useSmoothScroll();
  const [items, setItems] = useState<TestimonialItem[]>(getTestimonialItems);
  const [activeVideo, setActiveVideo] = useState<TestimonialItem | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setItems(getTestimonialItems());
    const unsubscribe = subscribeToContentUpdates(sync);
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
            ].map((stat) => <div key={stat.label} style={{ ...cardBase, padding: '22px', borderRadius: '24px' }}><div style={{ fontSize: '30px', fontWeight: 700 }}>{stat.value}</div><div style={{ fontSize: '12px', color: '#a1a1aa', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '8px' }}>{stat.label}</div></div>)}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 100px' }}>
        <div ref={gridRef} style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
          {items.length > 0 ? items.map((item, index) => (
            <article key={item.id} style={{ ...cardBase, borderRadius: '28px', padding: '22px', transform: `rotateX(${index % 2 === 0 ? '2deg' : '-2deg'}) rotateY(${index % 3 === 0 ? '-2deg' : '2deg'})`, transformStyle: 'preserve-3d' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: item.type === 'video' ? '#ff9050' : '#d4d4d8' }}>{item.type === 'video' ? 'Video Testimonial' : 'Client Testimonial'}</span>
                <span style={{ color: '#ff9050', fontSize: '13px' }}>{'★'.repeat(Math.max(1, Math.min(5, item.stars || 5)))}</span>
              </div>
              {item.type === 'video' && <button onClick={() => setActiveVideo(item)} style={{ width: '100%', marginBottom: '18px', border: 'none', cursor: 'pointer', borderRadius: '20px', overflow: 'hidden', background: '#151515', position: 'relative' }}><div style={{ aspectRatio: '16 / 9', background: item.thumbnailUrl ? `url(${item.thumbnailUrl}) center/cover no-repeat` : 'linear-gradient(135deg, #1f1f1f, #3a1c0f)' }} /><div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', color: 'white' }}>▶</div></div></button>}
              <p style={{ color: 'white', lineHeight: 1.9, fontSize: '16px', minHeight: '120px' }}>{item.quote}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '20px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: item.avatarUrl ? `url(${item.avatarUrl}) center/cover no-repeat` : `linear-gradient(135deg, ${item.avatarColor || '#c2622a'}, #ff9050)` }} />
                <div><div style={{ fontWeight: 600 }}>{item.name}</div><div style={{ color: '#a1a1aa', fontSize: '13px' }}>{item.role} · {item.company}</div>{item.duration && <div style={{ color: '#ff9050', fontSize: '12px', marginTop: '4px' }}>{item.duration}</div>}</div>
              </div>
            </article>
          )) : (
            <div style={{ ...cardBase, gridColumn: '1 / -1', borderRadius: '28px', padding: '36px', textAlign: 'center' }}>
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
          <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(960px, 100%)', ...cardBase, borderRadius: '28px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}><div><div style={{ fontWeight: 700 }}>{activeVideo.name}</div><div style={{ color: '#a1a1aa', fontSize: '14px' }}>{activeVideo.company}</div></div><button onClick={() => setActiveVideo(null)} style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '10px 16px' }}>Close</button></div>
            {activeVideo.videoUrl ? <video src={activeVideo.videoUrl} controls autoPlay style={{ width: '100%', borderRadius: '20px', background: '#000' }} /> : <div style={{ aspectRatio: '16 / 9', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #171717, #2f190f)', color: '#d4d4d8' }}>Add a video URL in admin to play this testimonial.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsPage;

