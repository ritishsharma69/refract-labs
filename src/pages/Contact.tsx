import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import ShaderHero from '../components/ui/animated-shader-hero';

import LogoMarquee from '../components/LogoMarquee';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import useSmoothScroll from '../hooks/useSmoothScroll';
import { submitLead } from '../lib/content-store';

const Contact = () => {
  useSmoothScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formMsg, setFormMsg] = useState('');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      const res = await submitLead(formData);
      setFormStatus('success');
      setFormMsg(res.message);
      setFormData({ name: '', email: '', mobile: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 4000);
    } catch (err: unknown) {
      setFormStatus('error');
      setFormMsg(err instanceof Error ? err.message : 'Something went wrong');
      setTimeout(() => setFormStatus('idle'), 4000);
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#080808' }}>
      <SEO
        title="Contact RefractLabs — Start Your Project"
        description="Talk to RefractLabs about your next web development, UI/UX design or social media management project. Get a fast response and a clear proposal within 24 hours."
        keywords="contact RefractLabs, hire web developer, UI UX design consultation, social media agency contact, project inquiry, digital agency quote"
        url="/contact"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          '@id': 'https://refractlabs.com/contact#webpage',
          url: 'https://refractlabs.com/contact',
          name: 'Contact RefractLabs',
          isPartOf: { '@id': 'https://refractlabs.com/#website' },
          about: { '@id': 'https://refractlabs.com/#organization' },
          inLanguage: 'en-US',
          mainEntity: {
            '@type': 'Organization',
            '@id': 'https://refractlabs.com/#organization',
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              telephone: '+91-76819-09401',
              email: 'hello.refractlabs@gmail.com',
              areaServed: 'IN',
              availableLanguage: ['English', 'Hindi'],
            },
          },
        }}
      />
      <Navbar />

      {/* Shader Hero Background with Contact Content */}
      <ShaderHero>
        <div
          ref={heroRef}
          style={{
            width: '100%',
            maxWidth: '1200px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '100px 24px 40px' : '80px 80px 60px',
            gap: isMobile ? '40px' : '60px',
          }}
        >
          {/* Left Content */}
          <div style={{ flex: 1, maxWidth: isMobile ? '100%' : '500px', position: 'relative', zIndex: 2 }}>
            <h1 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: isMobile ? '36px' : '56px',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '24px',
            }}>
              Work With Us
            </h1>
            <p style={{
              fontSize: isMobile ? '14px' : '16px',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
              marginBottom: '40px',
            }}>
              Have a vision in mind? Let's explore how we can bring it to life.
            </p>

            {/* Contact Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ContactCard
                label="PHONE"
                value="+91 76819 09401"
                href="tel:+917681909401"
              />
              <ContactCard
                label="EMAIL"
                value="hello.refractlabs@gmail.com"
                href="mailto:hello.refractlabs@gmail.com"
              />
              <ContactCard
                label="ADDRESS"
                value="Patiala, Punjab, India"
              />
            </div>
          </div>

          {/* Right - Contact Form */}
          <div style={{
            flex: 1,
            position: 'relative',
            zIndex: 2,
            maxWidth: isMobile ? '100%' : '480px',
            width: '100%',
          }}>
            <form onSubmit={handleSubmit} style={{
              padding: '32px',
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                Get In Touch
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                Fill in your details and we'll reach out to you shortly.
              </p>

              <input
                type="text"
                placeholder="Your Name *"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email Address *"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={inputStyle}
              />
              <input
                type="tel"
                placeholder="Mobile Number *"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                style={inputStyle}
              />
              <textarea
                placeholder="Your Message (optional)"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
              />

              <button
                type="submit"
                disabled={formStatus === 'sending'}
                style={{
                  padding: '14px 24px',
                  background: formStatus === 'success' ? '#22c55e' : 'linear-gradient(135deg, #c75b2a, #e08a5a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'Space Grotesk, sans-serif',
                  cursor: formStatus === 'sending' ? 'wait' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: formStatus === 'sending' ? 0.7 : 1,
                }}
              >
                {formStatus === 'sending' ? 'Sending...' : formStatus === 'success' ? '✓ Sent Successfully!' : 'Send Message'}
              </button>

              {formStatus === 'error' && (
                <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center' }}>{formMsg}</p>
              )}
              {formStatus === 'success' && (
                <p style={{ color: '#22c55e', fontSize: '13px', textAlign: 'center' }}>{formMsg}</p>
              )}
            </form>
          </div>
        </div>
      </ShaderHero>

      {/* Logo Marquee */}
      <LogoMarquee />

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Contact Card Component
const ContactCard = ({ label, value, href }: { label: string; value: string; href?: string }) => {
  const content = (
    <div style={{
      padding: '20px 24px',
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.3s ease',
    }}
    className="hover:bg-white/5 hover:border-white/15 cursor-pointer"
    >
      <p style={{
        fontSize: '11px',
        fontWeight: 600,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '6px',
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '16px',
        fontWeight: 500,
        color: 'white',
        fontFamily: 'Space Grotesk, sans-serif',
      }}>
        {value}
      </p>
    </div>
  );

  if (href) {
    return <a href={href} style={{ textDecoration: 'none' }}>{content}</a>;
  }
  return content;
};

const inputStyle: React.CSSProperties = {
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '10px',
  color: 'white',
  fontSize: '14px',
  fontFamily: 'Space Grotesk, sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  width: '100%',
  boxSizing: 'border-box',
};

export default Contact;

