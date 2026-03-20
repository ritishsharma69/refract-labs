import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { fetchTestimonialItems, subscribeToContentUpdates, type TestimonialItem } from '../lib/content-store';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  company: string;
  avatarUrl?: string;
}

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

const mapToLocal = (items: TestimonialItem[]): Testimonial[] =>
  items.map((t) => ({
    id: t.id,
    quote: t.quote,
    name: t.name,
    company: t.company.toUpperCase(),
    avatarUrl: t.avatarUrl || undefined,
  }));

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const load = () => fetchTestimonialItems()
      .then((items) => setTestimonials(mapToLocal(items.filter((t) => t.featuredOnHome).slice(0, 4))))
      .catch(() => {});
    load();
    const unsubscribe = subscribeToContentUpdates(load);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) {
      setCurrentIndex(0);
      setDisplayedIndex(0);
      return;
    }

    setCurrentIndex((prev) => Math.min(prev, testimonials.length - 1));
    setDisplayedIndex((prev) => Math.min(prev, testimonials.length - 1));
  }, [testimonials.length]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // GSAP transition on index change
  useEffect(() => {
    if (!quoteRef.current || !cardRef.current) return;
    if (currentIndex === displayedIndex) return;

    const tl = gsap.timeline();

    // Step 1: fade OUT current content
    tl.to([quoteRef.current, cardRef.current], {
      opacity: 0,
      y: -24,
      duration: 0.35,
      ease: 'power2.in',
      stagger: 0.05,
    });

    // Step 2: swap content mid-animation
    tl.call(() => {
      setDisplayedIndex(currentIndex);
    });

    // Step 3: fade IN new content
    tl.fromTo(
      [quoteRef.current, cardRef.current],
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.08,
      }
    );
  }, [currentIndex, displayedIndex]);

  // Auto advance every 6 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev =>
        prev >= testimonials.length - 1 ? 0 : prev + 1
      );
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, testimonials.length]);

  const goToPrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex(prev => Math.min(testimonials.length - 1, prev + 1));
  };

  const currentTestimonial = testimonials[displayedIndex];

  if (!currentTestimonial) {
    return (
      <section style={{
        minHeight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080808',
        position: 'relative',
        overflow: 'hidden',
        padding: isMobile ? '28px 24px 32px' : '24px 48px 36px',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '350px' : '700px',
          height: isMobile ? '300px' : '500px',
          background: 'radial-gradient(ellipse, rgba(194,98,42,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '720px',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '28px',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          padding: isMobile ? '28px 22px' : '36px 32px',
        }}>
          <div style={{ fontSize: isMobile ? '24px' : '34px', fontWeight: 600, color: 'white' }}>No featured testimonials yet</div>
          <p style={{ color: '#a1a1aa', lineHeight: 1.8, marginTop: '12px', fontSize: isMobile ? '14px' : '16px' }}>
            Turn on a few testimonials from admin and the top featured ones will automatically appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={{
      minHeight: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#080808',
      position: 'relative',
      overflow: 'hidden',
      padding: isMobile ? '28px 24px 32px' : '24px 48px 36px',
    }}>
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '350px' : '700px',
        height: isMobile ? '300px' : '500px',
        background: 'radial-gradient(ellipse, rgba(194,98,42,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Left arrow - hidden on mobile */}
      {!isMobile && (
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          style={{
            position: 'absolute',
            top: '50%',
            left: '48px',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '22px',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            opacity: currentIndex === 0 ? 0.25 : 1,
            pointerEvents: currentIndex === 0 ? 'none' : 'auto',
            zIndex: 1,
          }}
        >
          ←
        </button>
      )}

      {/* Right arrow - hidden on mobile */}
      {!isMobile && (
        <button
          onClick={goToNext}
          disabled={currentIndex === testimonials.length - 1}
          style={{
            position: 'absolute',
            top: '50%',
            right: '48px',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '22px',
            cursor: currentIndex === testimonials.length - 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            opacity: currentIndex === testimonials.length - 1 ? 0.25 : 1,
            pointerEvents: currentIndex === testimonials.length - 1 ? 'none' : 'auto',
            zIndex: 1,
          }}
        >
          →
        </button>
      )}

      {/* Quote text */}
      <p
        ref={quoteRef}
        style={{
          maxWidth: isMobile ? '100%' : '900px',
          textAlign: 'center',
          fontSize: isMobile ? '18px' : 'clamp(22px, 3vw, 36px)',
          fontWeight: 500,
          color: 'white',
          lineHeight: 1.65,
          letterSpacing: '-0.3px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {currentTestimonial.quote}
      </p>

      {/* Person card */}
      <div
        ref={cardRef}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '14px',
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '50px',
          padding: '8px 20px 8px 8px',
          marginTop: '32px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Avatar */}
        {currentTestimonial.avatarUrl ? (
          <img
            src={currentTestimonial.avatarUrl}
            alt={currentTestimonial.name}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #c2622a, #e07030)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '17px',
          }}>
            {currentTestimonial.name.charAt(0)}
          </div>
        )}

        {/* Name & Company */}
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>
            {currentTestimonial.name}
          </div>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '1.8px',
            textTransform: 'uppercase',
            marginTop: '3px',
          }}>
            {currentTestimonial.company}
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        marginTop: '28px',
        position: 'relative',
        zIndex: 1,
      }}>
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            style={{
              height: '6px',
              width: currentIndex === i ? '28px' : '6px',
              borderRadius: '3px',
              background: currentIndex === i ? 'white' : 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.35s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

