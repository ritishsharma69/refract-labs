import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ExploreServicesButton from './ExploreServicesButton';

gsap.registerPlugin(ScrollTrigger);

// See More Link Component
const SeeMoreLink = () => (
  <a href="#" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-300 group/link mt-auto">
    <span>See More</span>
    <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  </a>
);

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate grid cards
      gsap.fromTo(gridRef.current?.children || [],
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" style={{ position: 'relative', overflow: 'hidden', background: '#0a0a0a', padding: isMobile ? '36px 20px 32px' : '64px 80px 48px' }}>
      {/* Warm copper radial glow behind bento grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: isMobile
            ? 'radial-gradient(ellipse 400px 400px at 50% 30%, rgba(130,55,15,0.20) 0%, transparent 65%)'
            : 'radial-gradient(ellipse 900px 600px at 50% 60%, rgba(130,55,15,0.25) 0%, transparent 65%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div ref={headerRef} style={{ textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: isMobile ? '28px' : '48px',
              fontWeight: 700,
              color: 'white',
              textAlign: 'center',
            }}
          >
            The full spectrum of core capabilities
          </h2>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: '#888',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '16px auto 0',
            lineHeight: 1.7,
          }}>
            We replace the need for multiple vendors. From brand identity to custom software,
            we build the entire ecosystem your business runs on.
          </p>
          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', marginTop: isMobile ? '18px' : '24px', gap: isMobile ? '12px' : '20px' }}>
            <Link to="/contact" onClick={() => window.scrollTo(0, 0)}><button className="hero-cta-btn" style={{ width: isMobile ? '100%' : 'auto' }}>Work With Us</button></Link>
            <ExploreServicesButton style={{ fontSize: '15px' }} />
          </div>
        </div>

        {/* Bento Grid - 3 columns on desktop, 1 column on mobile */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1.8fr 1.1fr',
            gridTemplateRows: isMobile ? 'auto' : '320px 460px 340px',
            gap: '14px',
            width: '100%',
            maxWidth: '1200px',
            margin: isMobile ? '20px auto 0' : '36px auto 0',
          }}
        >

          {/* ROW 1 - Web Development (spans col 1-2) */}
          <div style={{
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.055)',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            overflow: 'hidden',
            position: 'relative',
            gridColumn: isMobile ? 'auto' : 'span 2',
            minHeight: isMobile ? 'auto' : '320px',
          }}>
            {/* Left Side - Dark Text Content */}
            <div style={{
              flex: isMobile ? 'none' : '0 0 38%',
              padding: isMobile ? '24px' : '32px 36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#111113',
              borderRadius: isMobile ? '20px 20px 0 0' : '20px 0 0 20px',
              position: 'relative',
              zIndex: 2,
            }}>
              <div>
                <svg style={{ width: '22px', height: '22px', opacity: 0.7 }} fill="none" stroke="white" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
                  <path strokeWidth="1.5" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: isMobile ? '22px' : '26px', fontWeight: 700, color: 'white', marginTop: '18px' }}>
                  Web Development
                </h3>
                <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.75, marginTop: '12px' }}>
                  Transform concepts into <span style={{ fontWeight: 600, color: 'white' }}>high-performance</span> experiences.
                  Engineering <span style={{ fontWeight: 600, color: 'white' }}>story-driven</span> websites and <span style={{ fontWeight: 600, color: 'white' }}>premium digital</span> products.
                </p>
              </div>
              <div style={{ marginTop: isMobile ? '16px' : '0' }}><SeeMoreLink /></div>
            </div>
            {/* Right Side - Purple Gradient with iMac */}
            <div style={{
              flex: isMobile ? 'none' : '0 0 62%',
              minHeight: isMobile ? '200px' : 'auto',
              background: 'linear-gradient(135deg, #6B4FCF 0%, #8B6FF0 25%, #A890FF 50%, #C5B2FF 75%, #DFD0FF 100%)',
              display: isMobile ? 'none' : 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* iMac Monitor */}
              <div style={{ position: 'relative', marginBottom: '-60px', marginRight: '-40px' }}>
                {/* Monitor Screen */}
                <div style={{
                  width: '380px',
                  background: 'linear-gradient(180deg, #2a2a2e 0%, #1a1a1e 100%)',
                  borderRadius: '14px 14px 0 0',
                  border: '6px solid #3a3a3e',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                  overflow: 'hidden',
                }}>
                  {/* Screen Content - Website Screenshot */}
                  <div style={{ height: '220px', background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)', position: 'relative', overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ height: '24px', background: '#fff', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', padding: '0 8px', gap: '4px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff5f57' }} />
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#febc2e' }} />
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#28c840' }} />
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ width: '120px', height: '10px', background: '#f0f0f0', borderRadius: '5px', margin: '0 auto' }} />
                      </div>
                    </div>
                    {/* Hero Section */}
                    <div style={{ padding: '20px 16px', display: 'flex', gap: '16px' }}>
                      {/* Left Content */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '6px', color: '#666', marginBottom: '4px' }}>150+</div>
                        <div style={{ width: '80px', height: '8px', background: '#ddd', borderRadius: '2px', marginBottom: '8px' }} />
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>We Build Digital</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>Experiences</div>
                        <div style={{ width: '60px', height: '4px', background: '#7B5FD4', borderRadius: '2px', marginTop: '8px' }} />
                      </div>
                      {/* Right Image */}
                      <div style={{ width: '120px', height: '80px', background: 'linear-gradient(135deg, #ddd 0%, #ccc 100%)', borderRadius: '8px' }}>
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #bbb 25%, transparent 25%, transparent 75%, #bbb 75%), linear-gradient(45deg, #bbb 25%, transparent 25%, transparent 75%, #bbb 75%)', backgroundSize: '8px 8px', backgroundPosition: '0 0, 4px 4px', borderRadius: '8px', opacity: 0.5 }} />
                      </div>
                    </div>
                    {/* Stats */}
                    <div style={{ position: 'absolute', right: '12px', top: '50px', background: 'white', padding: '6px 10px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <div style={{ fontSize: '8px', fontWeight: 700, color: '#1a1a2e' }}>98%</div>
                    </div>
                    <div style={{ position: 'absolute', right: '50px', bottom: '40px', background: 'white', padding: '4px 8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <div style={{ fontSize: '7px', fontWeight: 600, color: '#7B5FD4' }}>12+</div>
                    </div>
                  </div>
                </div>
                {/* Monitor Chin */}
                <div style={{
                  width: '380px',
                  height: '18px',
                  background: 'linear-gradient(180deg, #d0d0d5 0%, #b8b8bd 100%)',
                  borderRadius: '0 0 2px 2px',
                }} />
                {/* Monitor Stand Neck */}
                <div style={{
                  width: '60px',
                  height: '50px',
                  background: 'linear-gradient(90deg, #a0a0a5 0%, #c8c8cd 50%, #a0a0a5 100%)',
                  margin: '0 auto',
                }} />
                {/* Monitor Stand Base */}
                <div style={{
                  width: '160px',
                  height: '12px',
                  background: 'linear-gradient(180deg, #c8c8cd 0%, #a8a8ad 100%)',
                  margin: '0 auto',
                  borderRadius: '4px 4px 12px 12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }} />
              </div>
            </div>
            {/* Dark bottom bar connecting to next card */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '38%',
              right: 0,
              height: '60px',
              background: 'linear-gradient(180deg, transparent 0%, rgba(17,17,19,0.9) 100%)',
              zIndex: 1,
            }} />
          </div>

          {/* Card 2 - Social Media Management (col 3, rows 1-2) - Combined with Design Tools */}
          <div style={{ background: '#111113', borderRadius: '20px', padding: isMobile ? '24px' : '32px 36px', border: '1px solid rgba(255,255,255,0.055)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', gridArea: isMobile ? 'auto' : '1 / 3 / 3 / 4' }}>
            {/* Top Section - Text Content */}
            <div>
              <svg style={{ width: '22px', height: '22px', opacity: 0.7 }} fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
              </svg>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: isMobile ? '22px' : '26px', fontWeight: 700, color: 'white', marginTop: '18px' }}>
                Social Media Management
              </h3>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.75, marginTop: '12px' }}>
                We craft <span style={{ fontWeight: 600, color: 'white' }}>content</span>, run campaigns and grow communities across <span style={{ fontWeight: 600, color: 'white' }}>every platform that matters</span>.
              </p>
            </div>
            <div style={{ marginTop: '24px' }}><SeeMoreLink /></div>

            {/* Bottom Section - Design Tools Icons */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: isMobile ? '8px' : '12px', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '20px', paddingTop: isMobile ? '24px' : '0', flexWrap: 'wrap' }}>
              {/* Icon 1 - Grid/Circles */}
              <div style={{ width: isMobile ? '60px' : '70px', height: isMobile ? '60px' : '70px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="10" cy="10" r="4" stroke="#666" strokeWidth="1.5"/>
                  <circle cx="22" cy="10" r="4" stroke="#666" strokeWidth="1.5"/>
                  <circle cx="10" cy="22" r="4" stroke="#666" strokeWidth="1.5"/>
                  <circle cx="22" cy="22" r="4" stroke="#666" strokeWidth="1.5"/>
                </svg>
              </div>
              {/* Icon 2 - Lines/Bars */}
              <div style={{ width: isMobile ? '60px' : '70px', height: isMobile ? '60px' : '70px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  {[6, 10, 14, 18, 22, 26].map((x, i) => (
                    <line key={i} x1={x} y1="8" x2={x} y2="24" stroke="#666" strokeWidth="2"/>
                  ))}
                </svg>
              </div>
              {/* Icon 3 - Typography - hidden on mobile */}
              {!isMobile && (
                <div style={{ width: '70px', height: '70px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '8px' }}>
                  <div style={{ fontSize: '6px', color: '#666', lineHeight: 1.3, fontFamily: 'monospace' }}>
                    Aa Bb Cc Dd Ee<br/>
                    Ff Gg Hh Ii Jj Kk<br/>
                    Ll Mm Nn Oo Pp<br/>
                    Qq Rr Ss Tt Uu<br/>
                    Vv Ww Xx Yy Zz
                  </div>
                </div>
              )}
              {/* Icon 4 - App Icon */}
              <div style={{ width: isMobile ? '60px' : '70px', height: isMobile ? '60px' : '70px', background: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M10 12L18 8L26 12V20L22 22V14L18 12L14 14V22L10 20V12Z" fill="#1a1a2e"/>
                  <path d="M14 22L18 24L22 22V14L18 16L14 14V22Z" fill="#333"/>
                </svg>
              </div>
            </div>
          </div>

          {/* ROW 2-3 - Software/AI Code (col 1, rows 2-3) */}
          <div style={{ background: '#111113', borderRadius: '20px', padding: 0, border: '1px solid rgba(255,255,255,0.055)', display: 'flex', flexDirection: 'column', gridArea: isMobile ? 'auto' : '2 / 1 / 4 / 2', overflow: 'hidden', position: 'relative', minHeight: isMobile ? '400px' : 'auto' }}>
            {/* TOP HALF - Code Editor */}
            <div style={{ height: '55%', background: '#0d0f14', padding: '20px 20px 0 20px', fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: '11px', lineHeight: 1.6, overflow: 'hidden', position: 'relative' }}>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>15</span><span style={{ color: '#c586c0' }}>async function</span> <span style={{ color: '#dcdcaa' }}>initiateAgent</span><span style={{ color: '#d4d4d4' }}>() {'{'}</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>16</span><span style={{ color: '#d4d4d4', paddingLeft: '16px' }}><span style={{ color: '#569cd6' }}>const</span> agent = <span style={{ color: '#569cd6' }}>new</span> <span style={{ color: '#4ec9b0' }}>RefractAI</span>({'{'}</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>17</span><span style={{ color: '#d4d4d4', paddingLeft: '32px' }}>model: <span style={{ color: '#ce9178' }}>"intelligence-v1"</span>,</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>18</span><span style={{ color: '#d4d4d4', paddingLeft: '32px' }}>context: <span style={{ color: '#ce9178' }}>"orchestration"</span></span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>19</span><span style={{ color: '#d4d4d4', paddingLeft: '16px' }}>{'});'}</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>20</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>21</span><span style={{ color: '#d4d4d4', paddingLeft: '16px' }}><span style={{ color: '#569cd6' }}>const</span> analysis = <span style={{ color: '#569cd6' }}>await</span> agent.<span style={{ color: '#dcdcaa' }}>analyze</span>({'{'}</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>22</span><span style={{ color: '#d4d4d4', paddingLeft: '32px' }}>input: strategy,</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>23</span><span style={{ color: '#d4d4d4', paddingLeft: '32px' }}>optimizeFor: <span style={{ color: '#ce9178' }}>"authority"</span></span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>24</span><span style={{ color: '#d4d4d4', paddingLeft: '16px' }}>{'});'}</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>25</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>26</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>27</span><span style={{ color: '#d4d4d4', paddingLeft: '16px' }}><span style={{ color: '#569cd6' }}>const</span> result = <span style={{ color: '#569cd6' }}>await</span> analysis.<span style={{ color: '#dcdcaa' }}>execute</span>()</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>28</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>29</span><span style={{ color: '#d4d4d4', paddingLeft: '16px' }}><span style={{ color: '#569cd6' }}>await</span> agent.<span style={{ color: '#dcdcaa' }}>dispatch</span>({'{'}</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>30</span><span style={{ color: '#d4d4d4', paddingLeft: '32px' }}>target: <span style={{ color: '#ce9178' }}>"production"</span>,</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>31</span><span style={{ color: '#d4d4d4', paddingLeft: '32px' }}>data: result,</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>32</span><span style={{ color: '#d4d4d4', paddingLeft: '32px' }}>mode: <span style={{ color: '#ce9178' }}>"autonomous"</span></span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>33</span><span style={{ color: '#d4d4d4', paddingLeft: '16px' }}>{'});'}</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>34</span><span style={{ color: '#d4d4d4' }}>{'}'}</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>35</span></div>
              <div style={{ display: 'flex' }}><span style={{ color: '#444', width: '24px', textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>36</span></div>
              {/* Orange/Coral gradient glow at bottom */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(180deg, transparent 0%, rgba(194,98,42,0.15) 40%, rgba(194,98,42,0.35) 70%, rgba(180,90,50,0.5) 100%)', pointerEvents: 'none' }} />
            </div>
            {/* Bottom bar of code section */}
            <div style={{ height: '36px', background: '#0d0f14', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', padding: '0 20px', alignItems: 'center', gap: '12px' }}>
              <svg style={{ width: '14px', height: '14px', color: '#555' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2"/></svg>
              <svg style={{ width: '14px', height: '14px', color: '#555' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
            </div>
            {/* BOTTOM HALF - Text Content */}
            <div style={{ height: '45%', padding: '28px 32px', background: '#111113', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <svg style={{ width: '18px', height: '18px', color: '#666' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 9l-3 3 3 3m8-6l3 3-3 3m-5-9l-2 12"/></svg>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', fontWeight: 700, color: 'white', marginTop: '14px' }}>
                Software / AI
              </h3>
              <p style={{ fontSize: '14px', color: '#777', lineHeight: 1.7, marginTop: '12px' }}>
                We replace <span style={{ fontWeight: 600, color: 'white' }}>manual processes</span> with <span style={{ fontWeight: 600, color: 'white' }}>intelligent</span> software tailored to your <span style={{ fontWeight: 600, color: 'white' }}>specific operations</span>.
              </p>
              <div style={{ marginTop: '20px' }}><SeeMoreLink /></div>
            </div>
          </div>

          {/* Card 5 - Everything in One Place (col 2, row 2) */}
          <div style={{ background: 'linear-gradient(145deg, #1a1025 0%, #2a1d3d 40%, #1f1530 70%, #160f24 100%)', borderRadius: '20px', padding: isMobile ? '48px 24px' : 0, border: '1px solid rgba(255,255,255,0.055)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', gridArea: isMobile ? 'auto' : '2 / 2 / 3 / 3', minHeight: isMobile ? '200px' : 'auto' }}>
            {/* Subtle glow behind shape */}
            <div style={{ position: 'absolute', width: isMobile ? '200px' : '300px', height: isMobile ? '200px' : '300px', background: 'radial-gradient(circle, rgba(120,60,200,0.3) 0%, transparent 70%)', right: '10%', top: '50%', transform: 'translateY(-50%)' }} />
            {/* 3D Geometric Arrow Shape - hidden on mobile */}
            {!isMobile && (
              <div style={{ position: 'absolute', right: '5%', width: '60%', height: '70%' }}>
                {/* Face 1 - Main (darkest) */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'rgba(120,80,200,0.25)', clipPath: 'polygon(30% 20%, 70% 50%, 30% 80%)' }} />
                {/* Face 2 - Top */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'rgba(100,60,180,0.15)', clipPath: 'polygon(30% 20%, 70% 50%, 100% 20%)' }} />
                {/* Face 3 - Bottom */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'rgba(140,100,220,0.12)', clipPath: 'polygon(30% 80%, 70% 50%, 100% 80%)' }} />
              </div>
            )}
            {/* Text centered */}
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: isMobile ? '28px' : '46px', fontWeight: 800, color: 'white', textAlign: 'center', letterSpacing: '-1px', position: 'relative', zIndex: 1 }}>
              Everything<br />in One Place
            </h3>
          </div>

          {/* Card 6+7 - 3D Animation + FX Dashboard Combined (col 2-3, row 3) */}
          <div style={{ background: '#111118', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.055)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', position: 'relative', overflow: 'hidden', gridArea: isMobile ? 'auto' : '3 / 2 / 4 / 4' }}>
            {/* LEFT SIDE - 3D Animation Text */}
            <div style={{ flex: isMobile ? 'none' : '0 0 40%', padding: isMobile ? '24px' : '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <svg style={{ width: '20px', height: '20px', color: '#777' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: isMobile ? '22px' : '28px', fontWeight: 700, color: 'white', marginTop: '16px' }}>
                3D Animation
              </h3>
              <p style={{ fontSize: '14px', color: '#777', lineHeight: 1.7, marginTop: '14px' }}>
                We build <span style={{ fontWeight: 600, color: 'white' }}>cinematic 3D assets</span> designed to give your brand a <span style={{ fontWeight: 600, color: 'white' }}>premium feel</span>.
              </p>
              <div style={{ marginTop: '24px' }}><SeeMoreLink /></div>
            </div>

            {/* RIGHT SIDE - FX Dashboard Visual - hidden on mobile */}
            <div style={{ flex: 1, background: '#0d0d18', borderRadius: '16px', margin: '12px', padding: '16px', display: isMobile ? 'none' : 'flex', flexDirection: 'column', position: 'relative' }}>
              {/* Top Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ff5f57' }} />
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#febc2e' }} />
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#28c840' }} />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 600, color: 'white' }}>FX</div>
              </div>
              {/* Toolbar */}
              <div style={{ background: '#1a1a2e', borderRadius: '6px', padding: '6px 10px', marginTop: '10px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                {['△', '▶', '▼', '□', 'T', '✎', '○', '◇', '⬡', '✦'].map((icon, i) => (
                  <span key={i} style={{ color: i < 4 ? '#9966ff' : '#555', fontSize: '11px' }}>{icon}</span>
                ))}
              </div>
              {/* Charts Stack */}
              <div style={{ flex: 1, position: 'relative', marginTop: '12px' }}>
                {/* Line Chart */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '35%', background: '#12122a', borderRadius: '8px', padding: '10px' }}>
                  <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 50" fill="none">
                    <path d="M0 40 C30 35, 50 45, 80 30 C110 15, 140 20, 200 10" stroke="#7070ff" strokeWidth="2" fill="none"/>
                    <path d="M0 38 C30 42, 60 35, 90 40 C120 45, 150 25, 200 30" stroke="#ff5040" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                {/* Image Boxes */}
                <div style={{ position: 'absolute', top: '30%', left: '5%', right: '5%', height: '25%', background: '#1a1a30', borderRadius: '8px', display: 'flex', gap: '6px', padding: '8px' }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                </div>
                {/* Bar Chart */}
                <div style={{ position: 'absolute', bottom: '5%', left: '3%', right: '3%', height: '35%', background: '#111125', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
                    {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.35, 0.65, 0.55, 0.75].map((h, i) => (
                      <div key={i} style={{ width: '6px', height: `${h * 100}%`, background: '#c2622a', borderRadius: '2px' }} />
                    ))}
                  </div>
                  <svg style={{ width: '100%', height: '14px', marginTop: '4px' }} viewBox="0 0 100 14" fill="none">
                    <path d="M0 10 L20 7 L40 9 L60 4 L80 6 L100 2" stroke="#c2622a" strokeWidth="1.5" fill="none"/>
                    <circle cx="100" cy="2" r="2.5" fill="#c2622a"/>
                  </svg>
                </div>
              </div>
              {/* Arrow Button */}
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
                <div style={{ width: '38px', height: '38px', background: '#c2622a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: '16px' }}>→</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;

