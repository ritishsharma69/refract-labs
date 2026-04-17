import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ExploreServicesButton from './ExploreServicesButton';
import { fetchWorkItems, subscribeToContentUpdates } from '../lib/content-store';
import useIsMobile from '../hooks/useIsMobile';

const CARD_WIDTH = 500;
const MOBILE_CARD_WIDTH = 300;
const GAP = 24;
const MOBILE_GAP = 16;

// Image-based preview for admin-managed works
const ImagePreview = ({ image, title }) => (
  <div style={{ height: '100%', background: '#0a0a0a', position: 'relative' }}>
    {image ? (
      <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '48px', fontWeight: 800, color: 'rgba(255,255,255,0.08)' }}>{title?.charAt(0) || '?'}</span>
      </div>
    )}
  </div>
);

const mapWorks = (works) =>
  works.filter((w) => w.featuredOnHome).slice(0, 4).map((w) => ({
    id: w.id,
    name: w.title.toUpperCase(),
    category: w.type.toUpperCase(),
    desc: w.description || '',
    image: w.image,
    link: w.link || '',
  }));

const SelectedWork = () => {
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  const totalCards = projects.length;

  useEffect(() => {
    const load = () => fetchWorkItems().then((items) => {
      const next = mapWorks(items);
      setProjects(next);
      setCurrentIndex((prev) => Math.min(prev, Math.max(0, next.length - 1)));
    }).catch(() => {});
    load();
    const unsubscribe = subscribeToContentUpdates(load);
    return unsubscribe;
  }, []);

  const cardWidth = isMobile ? MOBILE_CARD_WIDTH : CARD_WIDTH;
  const gap = isMobile ? MOBILE_GAP : GAP;
  const STEP = cardWidth + gap;

  if (totalCards === 0) {
    return (
      <section style={{ width: '100%', padding: isMobile ? '36px 0 28px 0' : '64px 0 44px 0', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px', marginBottom: isMobile ? '24px' : '36px' }}>
          <h2 style={{ fontSize: isMobile ? '32px' : '52px', fontWeight: 700, color: 'white', letterSpacing: '-1.5px' }}>Selected work</h2>
          <p style={{ color: '#888', fontSize: isMobile ? '14px' : '16px', lineHeight: 1.75, marginTop: '16px' }}>
            Redefining the standard. We sharpen clarity, elevate design, and build digital identities that perform at the highest level.
          </p>
        </div>

        <div style={{ padding: isMobile ? '0 24px' : '0 80px' }}>
          <div style={{ maxWidth: '980px', margin: '0 auto', borderRadius: isMobile ? '18px' : '24px', overflow: 'hidden', background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ height: isMobile ? '220px' : '320px', background: 'linear-gradient(135deg, #111827 0%, #1f2937 45%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
              <span style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 800, color: 'rgba(255,255,255,0.08)', letterSpacing: '0.08em' }}>SELECTED WORK</span>
            </div>
            <div style={{ padding: isMobile ? '20px' : '28px 28px 32px 28px', textAlign: 'center' }}>
              <div style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 700, color: 'white' }}>No home featured work selected yet</div>
              <p style={{ fontSize: isMobile ? '13px' : '15px', color: '#777', lineHeight: 1.8, marginTop: '12px', maxWidth: '620px', marginInline: 'auto' }}>
                Choose up to 4 works from admin and they will show here automatically, or open the full works page meanwhile.
              </p>
              <div style={{ marginTop: '22px' }}>
                <Link to="/works" onClick={() => window.scrollTo(0, 0)}>
                  <button style={{ background: '#c2622a', borderRadius: '50px', padding: isMobile ? '12px 24px' : '13px 26px', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: isMobile ? '14px' : '16px' }}>View all work</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Calculate max index - stop when last 2 cards are visible (don't scroll to empty)
  const maxIndex = Math.max(0, isMobile ? totalCards - 1 : totalCards - 2);

  return (
    <section style={{ width: '100%', padding: isMobile ? '36px 0 28px 0' : '64px 0 44px 0', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px', marginBottom: isMobile ? '24px' : '36px' }}>
        <h2 style={{ fontSize: isMobile ? '32px' : '52px', fontWeight: 700, color: 'white', letterSpacing: '-1.5px' }}>Selected work</h2>
        <p style={{ color: '#888', fontSize: isMobile ? '14px' : '16px', lineHeight: 1.75, marginTop: '16px' }}>
          Redefining the standard. We sharpen clarity, elevate design, and build digital identities that perform at the highest level.
        </p>
        <div style={{ marginTop: isMobile ? '18px' : '24px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', alignItems: 'center', gap: isMobile ? '12px' : '16px' }}>
          <Link to="/contact" onClick={() => window.scrollTo(0, 0)}><button style={{ background: '#c2622a', borderRadius: '50px', padding: isMobile ? '12px 24px' : '13px 26px', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: isMobile ? '14px' : '16px' }}>Work With Us</button></Link>
          <ExploreServicesButton style={{ fontSize: isMobile ? '14px' : '16px' }} />
        </div>
      </div>

      {/* Slider viewport */}
      <div style={{ overflow: 'hidden', width: '100%', position: 'relative', contain: 'layout paint' }}>
        {/* Cards track - centered start position with calc */}
        <div style={{
          display: 'flex',
          gap: `${gap}px`,
          paddingLeft: isMobile ? '24px' : 'calc(50vw - 520px)',
          paddingRight: isMobile ? '24px' : 'calc(50vw - 260px)',
          transform: `translateX(-${currentIndex * STEP}px)`,
          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
        }}>
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                if (project.link) {
                  window.open(project.link, '_blank', 'noopener,noreferrer');
                }
              }}
              style={{
                width: `${cardWidth}px`,
                flexShrink: 0,
                flexGrow: 0,
                cursor: project.link ? 'pointer' : 'default',
                borderRadius: isMobile ? '16px' : '20px',
                overflow: 'hidden',
                background: '#111113',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ height: isMobile ? '220px' : '340px', overflow: 'hidden' }}>
                <ImagePreview image={project.image} title={project.name} />
              </div>
              <div style={{ padding: isMobile ? '20px' : '28px 28px 32px 28px', background: '#111113' }}>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '6px' : '0' }}>
                  <span style={{ fontSize: isMobile ? '14px' : '18px', fontWeight: 800, color: 'white', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{project.name}</span>
                  <span style={{ fontSize: isMobile ? '9px' : '11px', fontWeight: 600, color: '#666', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{project.category}</span>
                </div>
                <p style={{ fontSize: isMobile ? '12px' : '14px', color: '#777', lineHeight: 1.7, marginTop: isMobile ? '10px' : '14px' }}>{project.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Left side smoky gradient fade - lighter (hidden on mobile) */}
        {!isMobile && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '200px',
            background: 'linear-gradient(270deg, transparent 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0.75) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }} />
        )}
        {/* Right side smoky gradient fade - lighter (hidden on mobile) */}
        {!isMobile && (
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '200px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0.75) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }} />
        )}
      </div>

      {/* Bottom controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '18px 24px 0 24px' : '28px 80px 0 80px' }}>
        {/* Progress bar - full width spanning left to right */}
        <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginRight: isMobile ? '20px' : '40px' }}>
          <div style={{ height: '100%', width: `${((currentIndex + 1) / (maxIndex + 1)) * 100}%`, background: 'linear-gradient(90deg, #c2622a 0%, #e07a3a 100%)', borderRadius: '2px', transition: 'width 0.5s ease' }} />
        </div>
        {/* Arrows */}
        <div style={{ display: 'flex', gap: isMobile ? '8px' : '12px' }}>
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            style={{ width: isMobile ? '40px' : '48px', height: isMobile ? '40px' : '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: isMobile ? '16px' : '18px', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentIndex === 0 ? 0.3 : 1, transition: 'background 0.2s' }}
          >‹</button>
          <button
            onClick={() => setCurrentIndex(Math.min(maxIndex, currentIndex + 1))}
            disabled={currentIndex === maxIndex}
            style={{ width: isMobile ? '40px' : '48px', height: isMobile ? '40px' : '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: isMobile ? '16px' : '18px', cursor: currentIndex === maxIndex ? 'not-allowed' : 'pointer', opacity: currentIndex === maxIndex ? 0.3 : 1, transition: 'background 0.2s' }}
          >›</button>
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;

