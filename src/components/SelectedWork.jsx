import React, { useState } from 'react';

const projects = [
  { id: 1, name: "PROJECT AETHER", category: "VISUAL ENGINEERING", desc: "Zero-latency WebGL rendering for immersive luxury commerce.", type: "aether" },
  { id: 2, name: "PROJECT SENTINEL", category: "SYSTEM ARCHITECTURE", desc: "Trustless biometric authentication protocols with fluid user experience.", type: "sentinel" },
  { id: 3, name: "PROJECT CORTEX", category: "INTELLIGENT INTERFACES", desc: "Adaptive dashboard logic designed to visualize complex AI outputs.", type: "cortex" },
  { id: 4, name: "PROJECT FLUX", category: "IDENTITY SYSTEMS", desc: "A molecular design system engineered for infinite digital scale.", type: "flux" },
];

const AetherPreview = () => (
  <div style={{ height: '100%', background: 'white', padding: '20px 24px 0 24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        {['Home', 'About', 'Services', 'Contact'].map(item => (
          <span key={item} style={{ fontSize: '10px', color: '#888' }}>{item}</span>
        ))}
      </div>
    </div>
    <div style={{ marginTop: '30px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#111', lineHeight: 1.2 }}>Design That</h2>
      <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#111', lineHeight: 1.2 }}>Inspires & Delights</h2>
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
        <span style={{ fontSize: '11px', color: '#333' }}>Contact Us ↗</span>
        <span style={{ fontSize: '11px', color: '#333' }}>Learn More →</span>
      </div>
    </div>
    <div style={{ marginTop: '30px', height: '120px', background: 'linear-gradient(135deg, #f472b6 0%, #fce7f3 60%, white 100%)', borderRadius: '8px 8px 0 0' }} />
  </div>
);

const SentinelPreview = () => (
  <div style={{ height: '100%', background: '#0d0d0d', padding: '24px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'white', fontSize: '14px' }}>✕</span>
        <span style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>Nublink</span>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[1,2,3].map(i => <span key={i} style={{ color: 'white', opacity: 0.7, fontSize: '12px' }}>✕</span>)}
      </div>
    </div>
    <div style={{ position: 'absolute', right: '40px', top: '80px' }}>
      <div style={{ position: 'relative', width: '140px', height: '140px' }}>
        <div style={{ position: 'absolute', width: '100px', height: '100px', border: '2px solid rgba(255,255,255,0.12)', transform: 'rotate(45deg)', top: '20px', left: '20px' }} />
        <div style={{ position: 'absolute', width: '80px', height: '80px', border: '2px solid rgba(255,255,255,0.08)', transform: 'rotate(45deg)', top: '30px', left: '30px' }} />
      </div>
    </div>
    <div style={{ position: 'absolute', bottom: '24px', left: '24px' }}>
      <div style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Biometric Identity.</div>
      <div style={{ color: '#666', fontSize: '12px', lineHeight: 1.8 }}>
        PrivacySecurity.<br/>Authentication.<br/>IdentityVerification.<br/>Personalized Experience.
      </div>
    </div>
  </div>
);

const CortexPreview = () => (
  <div style={{ height: '100%', background: '#0a0a0a', padding: '24px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '20px' }}>
      {['Home', 'About', 'Mission', 'Services', 'Contact'].map(item => (
        <span key={item} style={{ fontSize: '9px', color: '#444' }}>{item}</span>
      ))}
    </div>
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <div style={{ fontSize: '26px', fontWeight: 800, color: 'white' }}>Intelligence,</div>
      <div style={{ fontSize: '26px', fontWeight: 800, color: 'white' }}>Reimagined With AI</div>
    </div>
    <div style={{ position: 'relative', width: '200px', height: '200px', margin: '30px auto 0' }}>
      {[200, 160, 120, 80].map((size, i) => (
        <div key={i} style={{
          position: 'absolute', width: `${size}px`, height: `${size}px`,
          border: `3px solid ${['#ff6b00', '#ff9500', '#ffb700', '#ffd000'][i]}`,
          borderRadius: '50%', left: `${(200-size)/2}px`, top: `${(200-size)/2}px`,
          transform: `rotate(${i * 30}deg)`, filter: i < 2 ? 'blur(1px)' : 'none',
          boxShadow: i === 0 ? '0 0 60px rgba(255,120,0,0.5)' : 'none',
          animation: 'spin 8s linear infinite', animationDelay: `${i * 0.5}s`
        }} />
      ))}
    </div>
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </div>
);

const FluxPreview = () => (
  <div style={{ height: '100%', background: 'white', padding: '24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#111' }}>Color</div>
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#111' }}>Pallet</div>
      </div>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
        {['#ffffff', '#333', '#666', '#4B6BFF', '#9B59FF', '#FF59C8', '#FF5959'].map((color, i) => (
          <div key={i} style={{ width: '32px', height: `${50 + (i % 3) * 10}px`, background: color, borderRadius: '4px', border: color === '#ffffff' ? '1px solid #ddd' : 'none' }} />
        ))}
      </div>
    </div>
    <div style={{ marginTop: '40px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      <div style={{ fontSize: '64px', fontWeight: 300, color: '#111', fontFamily: 'serif' }}>Aa</div>
      <div>
        <div style={{ fontSize: '13px', color: '#333', lineHeight: 1.8 }}>
          Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj<br/>Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt<br/>Uu Vv Ww Xx Yy Zz
        </div>
        <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>SF Pro Display</div>
      </div>
    </div>
  </div>
);

const PreviewRenderer = ({ type }) => {
  switch(type) {
    case 'aether': return <AetherPreview />;
    case 'sentinel': return <SentinelPreview />;
    case 'cortex': return <CortexPreview />;
    case 'flux': return <FluxPreview />;
    default: return null;
  }
};

const CARD_WIDTH = 500;
const GAP = 24;
const STEP = CARD_WIDTH + GAP; // 524px

const SelectedWork = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCards = projects.length;

  // Calculate max index - stop when last 2 cards are visible (don't scroll to empty)
  const maxIndex = totalCards - 2; // Show 2 cards at the end position

  return (
    <section style={{ width: '100%', padding: '120px 0 80px 0', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto', padding: '0 80px', marginBottom: '64px' }}>
        <h2 style={{ fontSize: '52px', fontWeight: 700, color: 'white', letterSpacing: '-1.5px' }}>Selected work</h2>
        <p style={{ color: '#888', fontSize: '16px', lineHeight: 1.75, marginTop: '16px' }}>
          Redefining the standard. We sharpen clarity, elevate design, and build digital identities that perform at the highest level.
        </p>
        <div style={{ marginTop: '36px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button style={{ background: '#c2622a', borderRadius: '50px', padding: '13px 26px', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Work With Us</button>
          <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>Explore our services →</button>
        </div>
      </div>

      {/* Slider viewport */}
      <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
        {/* Cards track - centered start position with calc */}
        <div style={{
          display: 'flex',
          gap: `${GAP}px`,
          paddingLeft: 'calc(50vw - 520px)', // Center first card more to the right
          paddingRight: 'calc(50vw - 260px)',
          transform: `translateX(-${currentIndex * STEP}px)`,
          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
        }}>
          {projects.map((project) => (
            <div
              key={project.id}
              style={{
                width: `${CARD_WIDTH}px`,
                flexShrink: 0,
                flexGrow: 0,
                cursor: 'pointer',
                borderRadius: '20px',
                overflow: 'hidden',
                background: '#111113',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ height: '340px', overflow: 'hidden' }}>
                <PreviewRenderer type={project.type} />
              </div>
              <div style={{ padding: '28px 28px 32px 28px', background: '#111113' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'white', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{project.name}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#666', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{project.category}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#777', lineHeight: 1.7, marginTop: '14px' }}>{project.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Left side smoky gradient fade - lighter */}
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
        {/* Right side smoky gradient fade - lighter */}
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
      </div>

      {/* Bottom controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '48px 80px 0 80px' }}>
        {/* Progress bar - full width spanning left to right */}
        <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginRight: '40px' }}>
          <div style={{ height: '100%', width: `${((currentIndex + 1) / (maxIndex + 1)) * 100}%`, background: 'linear-gradient(90deg, #c2622a 0%, #e07a3a 100%)', borderRadius: '2px', transition: 'width 0.5s ease' }} />
        </div>
        {/* Arrows */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '18px', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentIndex === 0 ? 0.3 : 1, transition: 'background 0.2s' }}
          >‹</button>
          <button
            onClick={() => setCurrentIndex(Math.min(maxIndex, currentIndex + 1))}
            disabled={currentIndex === maxIndex}
            style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '18px', cursor: currentIndex === maxIndex ? 'not-allowed' : 'pointer', opacity: currentIndex === maxIndex ? 0.3 : 1, transition: 'background 0.2s' }}
          >›</button>
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;

