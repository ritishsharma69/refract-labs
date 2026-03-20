import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ExploreServicesButton from './ExploreServicesButton';

// Bar heights for the animated chart
const barHeights = [60, 90, 70, 110, 85, 130, 95, 145, 120, 160, 140, 175];

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

const ImpactAtScale = () => {
  const [card2Hovered, setCard2Hovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ballPos, setBallPos] = useState({ x: 540, y: 200 });
  const isMobile = useIsMobile();

  // Refs for smooth ball animation ALONG the path
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const animFrameRef = useRef<number>(0);

  // Track position as LENGTH along the path (not x,y coordinates)
  const currentLengthRef = useRef<number>(0);
  const targetLengthRef = useRef<number>(0);
  const totalLengthRef = useRef<number>(1);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize ball position on path
  useEffect(() => {
    if (pathRef.current && !isInitializedRef.current) {
      const path = pathRef.current;
      const totalLen = path.getTotalLength();
      totalLengthRef.current = totalLen;

      // Start ball at ~60% of the path (middle-ish area)
      const startLength = totalLen * 0.6;
      currentLengthRef.current = startLength;
      targetLengthRef.current = startLength;

      const pt = path.getPointAtLength(startLength);
      setBallPos({ x: pt.x, y: pt.y });
      isInitializedRef.current = true;
    }
  }, [mounted]);

  // Smooth animation loop - ball travels ALONG the path
  useEffect(() => {
    const loop = () => {
      if (!pathRef.current) {
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      const path = pathRef.current;
      const diff = targetLengthRef.current - currentLengthRef.current;

      // Smooth easing - move 4% of remaining distance each frame
      if (Math.abs(diff) > 0.5) {
        currentLengthRef.current += diff * 0.04;

        // Get actual point ON the path at this length
        const pt = path.getPointAtLength(currentLengthRef.current);
        setBallPos({ x: pt.x, y: pt.y });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Find path length for a given X coordinate
  const findLengthForX = (path: SVGPathElement, targetX: number): number => {
    const totalLength = path.getTotalLength();
    let lo = 0;
    let hi = totalLength;

    // Binary search for the length where path.x matches targetX
    for (let i = 0; i < 50; i++) {
      const mid = (lo + hi) / 2;
      const p = path.getPointAtLength(mid);
      if (p.x < targetX) lo = mid;
      else hi = mid;
    }

    return (lo + hi) / 2;
  };

  // Mouse handler - finds target LENGTH on path
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!pathRef.current || !svgRef.current) return;

    const svg = svgRef.current;
    const path = pathRef.current;

    // Convert mouse position to SVG coordinate space
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const svgP = pt.matrixTransform(ctm.inverse());
    const mouseX = svgP.x;

    // Clamp to valid path x range (0 to 850)
    const clampedX = Math.max(0, Math.min(850, mouseX));

    // Find the length on the path for this X position
    const targetLen = findLengthForX(path, clampedX);
    targetLengthRef.current = targetLen;
  };

  // On mouse leave, return to default position (60% along path)
  const handleMouseLeave = () => {
    if (pathRef.current) {
      targetLengthRef.current = totalLengthRef.current * 0.6;
    }
  };

  const cardBaseStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #0f1420 0%, #141926 50%, #0d1018 100%)',
    borderRadius: isMobile ? '16px' : '24px',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    position: 'relative',
    padding: isMobile ? '24px 24px 0 24px' : '40px 40px 0 40px',
  };

  return (
    <section style={{ position: 'relative', background: 'transparent', padding: isMobile ? '36px 24px 32px' : '64px 120px 44px' }}>
      {/* Background atmosphere glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '400px' : '800px',
        height: isMobile ? '300px' : '600px',
        background: 'radial-gradient(ellipse, rgba(140,55,15,0.2) 0%, transparent 65%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '36px' }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: isMobile ? '32px' : '52px',
            fontWeight: 700,
            color: 'white',
            letterSpacing: '-1.5px',
            margin: 0,
          }}>
            Impact at scale
          </h2>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#888', marginTop: '12px' }}>
            Design is subjective. Performance is not.
          </p>
          {/* CTA Row */}
          <div style={{ marginTop: isMobile ? '18px' : '24px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '12px' : '20px' }}>
            <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
              <button style={{
                background: '#c2622a',
                borderRadius: '50px',
                padding: isMobile ? '12px 24px' : '13px 26px',
                color: 'white',
                fontWeight: 500,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
              }}>
                Work With Us
              </button>
            </Link>
            <ExploreServicesButton style={{ fontSize: '14px', fontWeight: 500 }} />
          </div>
        </div>

        {/* Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: isMobile ? '12px' : '16px',
        }}>
          {/* Card 1 - $100M+ Revenue */}
          <div style={{ ...cardBaseStyle, height: isMobile ? '280px' : '380px' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span style={{ color: '#888', fontSize: isMobile ? '12px' : '14px', fontWeight: 500 }}>Revenue Supported</span>
              <h3 style={{
                color: 'white',
                fontSize: isMobile ? '40px' : '56px',
                fontWeight: 800,
                letterSpacing: '-2px',
                marginTop: '8px',
                margin: '8px 0 0 0',
              }}>
                $100M+
              </h3>
              <p style={{ color: '#777', fontSize: isMobile ? '12px' : '14px', lineHeight: 1.7, marginTop: '12px', maxWidth: '280px' }}>
                Systems backing <span style={{ color: 'white', fontWeight: 600 }}>nine-figure revenue</span>. When performance is non-negotiable, <span style={{ color: 'white', fontWeight: 600 }}>we deliver</span>.
              </p>
            </div>
            {/* Animated Bar Chart */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: isMobile ? '120px' : '200px',
              display: 'flex',
              alignItems: 'flex-end',
              gap: isMobile ? '4px' : '8px',
              padding: isMobile ? '0 24px' : '0 40px',
            }}>
              {barHeights.map((height, index) => (
                <div
                  key={index}
                  style={{
                    width: 'calc((100% - 88px) / 12)',
                    height: mounted ? `${isMobile ? height * 0.6 : height}px` : '0px',
                    borderRadius: isMobile ? '4px 4px 0 0' : '6px 6px 0 0',
                    background: 'linear-gradient(to top, rgba(194, 98, 42, 0.9) 0%, rgba(220, 130, 60, 0.7) 50%, rgba(150, 80, 180, 0.4) 100%)',
                    opacity: mounted ? 1 : 0,
                    transition: `height 0.8s ease ${index * 0.06}s, opacity 0.8s ease ${index * 0.06}s`,
                    transformOrigin: 'bottom',
                    animation: mounted ? `barPulse 2s ease-in-out infinite ${index * 0.15}s` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Card 2 - 100+ Assets */}
          <div
            style={{ ...cardBaseStyle, height: isMobile ? '280px' : '380px' }}
            onMouseEnter={() => setCard2Hovered(true)}
            onMouseLeave={() => setCard2Hovered(false)}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span style={{ color: '#888', fontSize: isMobile ? '12px' : '14px', fontWeight: 500 }}>Assets Deployed</span>
              <h3 style={{
                color: 'white',
                fontSize: isMobile ? '40px' : '56px',
                fontWeight: 800,
                letterSpacing: '-2px',
                margin: '8px 0 0 0',
              }}>
                100+
              </h3>
              <p style={{ color: '#777', fontSize: isMobile ? '12px' : '14px', lineHeight: 1.7, marginTop: '12px', maxWidth: '280px' }}>
                <span style={{ color: 'white', fontWeight: 600 }}>Production-ready</span> assets for every channel. Ship campaigns and launches with <span style={{ color: 'white', fontWeight: 600 }}>confidence</span>.
              </p>
            </div>
            {/* Floating White Card - hidden on mobile */}
            {!isMobile && (
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-20px',
                width: '220px',
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: card2Hovered ? '0 40px 80px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.1)',
                transform: card2Hovered ? 'rotate(0deg) scale(1.08) translateY(-10px)' : 'rotate(-3deg)',
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease',
              }}>
                {/* Top Nav */}
                <div style={{ padding: '8px 12px', fontSize: '7px', color: '#999' }}>
                  Home About Mission Services
                </div>
                {/* Content */}
                <div style={{ padding: '0 12px' }}>
                  <div style={{ color: 'black', fontSize: '18px', fontWeight: 800, lineHeight: 1.2 }}>
                    Design That
                  </div>
                  <div style={{ color: 'black', fontSize: '18px', fontWeight: 800, lineHeight: 1.2 }}>
                    Inspires &
                  </div>
                </div>
                {/* Links Row */}
                <div style={{ padding: '6px 12px', fontSize: '8px', color: 'black' }}>
                  Contact Us ↗
                </div>
                {/* Pink Gradient Box */}
                <div style={{
                  background: 'linear-gradient(135deg, #f472b6 0%, #fce7f3 70%, white 100%)',
                  height: '80px',
                  margin: 0,
                }} />
              </div>
            )}
          </div>

          {/* Card 3 - $2.65B Enterprise DNA */}
          <div style={{
            ...cardBaseStyle,
            height: isMobile ? 'auto' : '340px',
            gridColumn: isMobile ? 'auto' : '1 / -1',
            padding: isMobile ? '24px' : '40px 48px',
          }}>
            {/* Warm radial glow - center */}
            <div style={{
              position: 'absolute',
              left: '30%',
              bottom: '10%',
              width: isMobile ? '250px' : '500px',
              height: isMobile ? '200px' : '400px',
              background: 'radial-gradient(ellipse, rgba(200,100,50,0.25) 0%, rgba(150,60,20,0.15) 30%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }} />

            {/* Secondary glow - right side - hidden on mobile */}
            {!isMobile && (
              <div style={{
                position: 'absolute',
                right: '10%',
                bottom: '20%',
                width: '300px',
                height: '250px',
                background: 'radial-gradient(ellipse, rgba(180,80,30,0.2) 0%, transparent 60%)',
                pointerEvents: 'none',
                zIndex: 0,
              }} />
            )}

            {/* Left Text */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span style={{ color: '#9ca3af', fontSize: isMobile ? '12px' : '14px', fontWeight: 500 }}>Enterprise DNA</span>
              <h3 style={{
                color: 'white',
                fontSize: isMobile ? '48px' : '72px',
                fontWeight: 800,
                letterSpacing: '-3px',
                margin: '8px 0 0 0',
                textShadow: '0 0 40px rgba(255,255,255,0.15)',
              }}>
                $2.65B
              </h3>
              <p style={{ color: '#9ca3af', fontSize: isMobile ? '13px' : '15px', lineHeight: 1.6, marginTop: '14px', maxWidth: '320px', fontStyle: 'italic' }}>
                Applying the architectural standards of a multi-billion dollar valuation to your brand.
              </p>
            </div>

            {/* Interactive Wave Chart - hidden on mobile */}
            {!isMobile && (
            <div style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '70%',
              height: '100%',
            }}>
              <svg
                ref={svgRef}
                viewBox="0 0 800 340"
                width="100%"
                height="100%"
                style={{ overflow: 'visible', cursor: 'crosshair' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  {/* Strong white/cream glow for the line */}
                  <filter id="lineGlow" x="-50%" y="-100%" width="200%" height="300%">
                    <feGaussianBlur stdDeviation="8" result="blur1"/>
                    <feGaussianBlur stdDeviation="4" result="blur2"/>
                    <feGaussianBlur stdDeviation="2" result="blur3"/>
                    <feMerge>
                      <feMergeNode in="blur1"/>
                      <feMergeNode in="blur2"/>
                      <feMergeNode in="blur3"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>

                  {/* Ball outer glow */}
                  <filter id="ballGlow" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="6" result="blur"/>
                    <feMerge>
                      <feMergeNode in="blur"/>
                      <feMergeNode in="blur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>

                  {/* Warm gradient fill under wave */}
                  <linearGradient id="waveArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffb870" stopOpacity={0.25}/>
                    <stop offset="40%" stopColor="#ff8040" stopOpacity={0.12}/>
                    <stop offset="100%" stopColor="#ff6020" stopOpacity={0}/>
                  </linearGradient>

                  {/* Line gradient - cream/white to warm */}
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ffcc99"/>
                    <stop offset="50%" stopColor="#ffe4c4"/>
                    <stop offset="100%" stopColor="#fff5e6"/>
                  </linearGradient>
                </defs>

                {/* Area fill under wave */}
                <path
                  d="M 0 340 L 0 300 Q 100 320, 180 280 Q 280 220, 380 260 Q 480 300, 540 200 Q 600 100, 700 140 Q 780 170, 850 80 L 850 340 Z"
                  fill="url(#waveArea)"
                />

                {/* Main wave line — deep waves, strong glow */}
                <path
                  ref={pathRef}
                  d="M 0 300 Q 100 320, 180 280 Q 280 220, 380 260 Q 480 300, 540 200 Q 600 100, 700 140 Q 780 170, 850 80"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#lineGlow)"
                />

                {/* Ball outer glow ring */}
                <circle
                  cx={ballPos.x}
                  cy={ballPos.y}
                  r="18"
                  fill="none"
                  stroke="rgba(255,200,150,0.3)"
                  strokeWidth="8"
                  filter="url(#ballGlow)"
                />

                {/* Ball mid ring - cream glow */}
                <circle
                  cx={ballPos.x}
                  cy={ballPos.y}
                  r="12"
                  fill="none"
                  stroke="rgba(255,230,200,0.6)"
                  strokeWidth="3"
                  filter="url(#ballGlow)"
                />

                {/* Ball core - dark center like reference */}
                <circle
                  cx={ballPos.x}
                  cy={ballPos.y}
                  r="8"
                  fill="#1a1a2e"
                  stroke="rgba(255,220,180,0.9)"
                  strokeWidth="2"
                />
              </svg>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes barPulse {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.08); }
        }
      `}</style>
    </section>
  );
};

export default ImpactAtScale;

