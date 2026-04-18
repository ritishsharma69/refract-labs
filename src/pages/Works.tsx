import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import ExploreServicesButton from '../components/ExploreServicesButton';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import { SpiralAnimation } from '../components/ui/spiral-animation';
import SEO from '../components/SEO';
import useSmoothScroll from '../hooks/useSmoothScroll';
import { fetchWorkItems, subscribeToContentUpdates, type WorkItem } from '../lib/content-store';

gsap.registerPlugin(ScrollTrigger);

const Works = () => {
  useSmoothScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const marqueeRef1 = useRef<HTMLDivElement>(null);
  const marqueeRef2 = useRef<HTMLDivElement>(null);
  const tween1Ref = useRef<gsap.core.Tween | null>(null);
  const tween2Ref = useRef<gsap.core.Tween | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    const load = () => fetchWorkItems().then(items => { setWorkItems(items); setLoading(false); }).catch(() => setLoading(false));
    load();
    const unsubscribe = subscribeToContentUpdates(load);
    return () => {
      window.removeEventListener('resize', checkMobile);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      const heroH1 = heroRef.current?.querySelector('h1');
      const heroP = heroRef.current?.querySelector('p');

      if (heroH1) {
        gsap.fromTo(heroH1,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
        );
      }
      if (heroP) {
        gsap.fromTo(heroP,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 }
        );
      }

      // Marquee animations
      const marquee1 = marqueeRef1.current;
      const marquee2 = marqueeRef2.current;

      // Wait for DOM to be ready with content
      setTimeout(() => {
        if (marquee1) {
          const width = marquee1.scrollWidth / 2;
          gsap.set(marquee1, { x: 0 });
          tween1Ref.current = gsap.to(marquee1, {
            x: -width,
            duration: 25,
            ease: 'none',
            repeat: -1,
          });
        }

        if (marquee2) {
          const width = marquee2.scrollWidth / 2;
          gsap.set(marquee2, { x: -width });
          tween2Ref.current = gsap.to(marquee2, {
            x: 0,
            duration: 25,
            ease: 'none',
            repeat: -1,
          });
        }
      }, 100);
    });

    return () => ctx.revert();
  }, [workItems]);

  const pauseMarquees = () => {
    tween1Ref.current?.pause();
    tween2Ref.current?.pause();
  };
  const resumeMarquees = () => {
    tween1Ref.current?.resume();
    tween2Ref.current?.resume();
  };

  const renderWorkCard = (item: WorkItem, index: number) => {
    const cardInner = (
      <>
      {/* Image */}
      <div style={{
        width: '100%',
        height: '70%',
        background: `url(${item.image}) center/cover no-repeat`,
        position: 'relative',
      }}>
        {/* Fallback gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, hsl(${(Number(item.id) * 60) % 360}, 70%, 20%) 0%, hsl(${(Number(item.id) * 60 + 30) % 360}, 60%, 15%) 100%)`,
        }}>
          {/* Mock UI elements */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            display: 'flex',
            gap: '8px',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28c840' }} />
          </div>
          {/* Content placeholder */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: isMobile ? '18px' : '24px',
              fontWeight: 700,
              color: 'white',
            }}>
              {item.title}
            </div>
          </div>
        </div>
      </div>
      {/* Info */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          {item.type}
        </span>
        <h3 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: isMobile ? '18px' : '22px',
          fontWeight: 600,
          color: 'white',
        }}>
          {item.title}
        </h3>
      </div>
      </>
    );

    const sharedStyle: React.CSSProperties = {
      flex: '0 0 auto',
      width: isMobile ? '280px' : '380px',
      height: isMobile ? '320px' : '420px',
      background: 'linear-gradient(135deg, #0f1420 0%, #151a28 50%, #0f1420 100%)',
      borderRadius: '20px',
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid rgba(255,255,255,0.05)',
      marginRight: '20px',
      display: 'block',
      textDecoration: 'none',
      color: 'inherit',
      cursor: item.link ? 'pointer' : 'default',
      transition: 'transform 0.3s ease, border-color 0.3s ease',
    };

    const onEnter = (e: React.MouseEvent<HTMLElement>) => {
      if (item.link) {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
      }
    };
    const onLeave = (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)';
    };

    if (item.link) {
      return (
        <a
          key={`${item.id}-${index}`}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          style={sharedStyle}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {cardInner}
        </a>
      );
    }

    return (
      <div key={`${item.id}-${index}`} style={sharedStyle}>
        {cardInner}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#080808' }}>
      <SEO
        title="Our Works — Portfolio & Case Studies"
        description="Explore RefractLabs' portfolio of web applications, UI/UX designs and social media campaigns built for ambitious brands across industries worldwide."
        keywords="web development portfolio, UI UX design projects, React case studies, social media campaigns, digital agency portfolio, RefractLabs works"
        url="/works"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Works', url: '/works' },
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': 'https://refractlabs.com/works#webpage',
          url: 'https://refractlabs.com/works',
          name: 'RefractLabs Works & Portfolio',
          isPartOf: { '@id': 'https://refractlabs.com/#website' },
          about: { '@id': 'https://refractlabs.com/#organization' },
          inLanguage: 'en-US',
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: workItems.length,
            itemListElement: workItems.slice(0, 20).map((item, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'CreativeWork',
                name: item.title,
                image: item.image,
                genre: item.type,
                ...(item.link ? { url: item.link } : {}),
                ...(item.description ? { description: item.description } : {}),
              },
            })),
          },
        }}
      />
      <Navbar />

      {/* Hero Section */}
      <div
        ref={heroRef}
        style={{
          minHeight: '40vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '120px 24px 40px' : '140px 80px 60px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Spiral Animation Background */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
          <SpiralAnimation />
        </div>
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: isMobile ? '36px' : '64px',
          fontWeight: 700,
          color: 'white',
          fontStyle: 'italic',
          position: 'relative',
          zIndex: 1,
        }}>
          Recent Works
        </h1>
        <p style={{
          fontSize: isMobile ? '14px' : '16px',
          color: '#888',
          marginTop: '16px',
          maxWidth: '400px',
          lineHeight: 1.7,
          position: 'relative',
          zIndex: 1,
        }}>
          Let's discuss scope, timing, and fit.
        </p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '32px', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <Link to="/contact" onClick={() => window.scrollTo(0, 0)}><button className="hero-cta-btn">Work With Us</button></Link>
          <ExploreServicesButton />
        </div>
      </div>

      {/* Marquee Section - Row 1 */}
      <div
        onMouseEnter={pauseMarquees}
        onMouseLeave={resumeMarquees}
        style={{ overflow: 'hidden', padding: isMobile ? '20px 0' : '40px 0' }}
      >
        {loading ? (
          <div style={{ display: 'flex', gap: isMobile ? '12px' : '24px', padding: '0 24px' }}>
            {[1,2,3,4].map((i) => (
              <div key={i} style={{ width: isMobile ? '280px' : '420px', flexShrink: 0, borderRadius: '16px', overflow: 'hidden', background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ height: isMobile ? '200px' : '280px', background: 'linear-gradient(90deg, #111113 25%, #1a1a1d 50%, #111113 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ height: '12px', width: '40%', borderRadius: '4px', marginBottom: '10px', background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ height: '18px', width: '70%', borderRadius: '4px', background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                </div>
              </div>
            ))}
            <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
          </div>
        ) : (
          <div ref={marqueeRef1} style={{ display: 'flex', width: 'fit-content' }}>
            {[...workItems, ...workItems].map((item, index) => renderWorkCard(item, index))}
          </div>
        )}
      </div>

      {/* Marquee Section - Row 2 */}
      <div
        onMouseEnter={pauseMarquees}
        onMouseLeave={resumeMarquees}
        style={{ overflow: 'hidden', padding: isMobile ? '20px 0' : '40px 0' }}
      >
        {loading ? (
          <div style={{ display: 'flex', gap: isMobile ? '12px' : '24px', padding: '0 24px' }}>
            {[1,2,3,4].map((i) => (
              <div key={i} style={{ width: isMobile ? '280px' : '420px', flexShrink: 0, borderRadius: '16px', overflow: 'hidden', background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ height: isMobile ? '200px' : '280px', background: 'linear-gradient(90deg, #111113 25%, #1a1a1d 50%, #111113 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ height: '12px', width: '40%', borderRadius: '4px', marginBottom: '10px', background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ height: '18px', width: '70%', borderRadius: '4px', background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div ref={marqueeRef2} style={{ display: 'flex', width: 'fit-content' }}>
            {[...workItems.slice().reverse(), ...workItems.slice().reverse()].map((item, index) => renderWorkCard(item, index))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Works;

