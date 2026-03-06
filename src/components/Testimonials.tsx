import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  company: string;
  avatarUrl?: string;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
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

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    quote: '"I reached out with a vision, and Refract executed it perfectly. They were on time at every step, and their attention to detail was exactly what we were looking for. They took our ideas and turned them into a result that elevated the brand."',
    name: 'Tanner Balisky',
    company: 'BAD BIRDIE',
    avatarUrl: undefined,
  },
  {
    id: '2',
    quote: '"Working with RefractWeb was a game-changer for our product launch. The quality of execution was beyond what we expected. They understood our brand identity immediately."',
    name: 'Sarah Mitchell',
    company: 'APEX STUDIO',
    avatarUrl: undefined,
  },
  {
    id: '3',
    quote: '"From concept to final delivery, the process was seamless. RefractWeb brought a level of craft and precision we had never experienced before."',
    name: 'James Ortega',
    company: 'NOVA LABS',
    avatarUrl: undefined,
  },
  {
    id: '4',
    quote: '"The team at RefractWeb engineers digital experiences, not just websites. Every interaction feels intentional. We received more compliments in one month than the past three years."',
    name: 'Priya Sharma',
    company: 'LUMINARY CO',
    avatarUrl: undefined,
  },
];

const Testimonials = ({ testimonials = defaultTestimonials }: TestimonialsProps) => {
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
    setCurrentIndex(prev => Math.min(testimonials.length - 1, prev + 1));
  };

  const currentTestimonial = testimonials[displayedIndex];

  return (
    <section style={{
      minHeight: isMobile ? 'auto' : '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#080808',
      position: 'relative',
      overflow: 'hidden',
      padding: isMobile ? '60px 24px' : '80px 48px',
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
          marginTop: '52px',
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
        marginTop: '44px',
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

