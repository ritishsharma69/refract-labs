import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import LogoMarquee from '../components/LogoMarquee';
import Services from '../components/Services';
import SelectedWork from '../components/SelectedWork';
import ImpactAtScale from '../components/ImpactAtScale';
import BuildEnvironment from '../components/BuildEnvironment';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import useSmoothScroll from '../hooks/useSmoothScroll';

gsap.registerPlugin(ScrollTrigger);

// Tells the browser to skip layout/paint for off-screen sections until
// they're near the viewport. Massive scroll perf win with zero visual change.
// `containIntrinsicSize` reserves a placeholder size so scrollbars don't jump.
const DEFER_STYLE = {
  contentVisibility: 'auto',
  containIntrinsicSize: '1px 800px',
} as React.CSSProperties;

const Home = () => {
  useSmoothScroll();

  // Refresh ScrollTrigger after component mounts to ensure proper calculations
  useEffect(() => {
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      <SEO
        title="Web Development, UI/UX Design & Social Media Management Agency"
        description="RefractLabs is a premium digital agency building high-performance websites, UI/UX products and social media strategies. Partner with us to turn ideas into measurable growth."
        keywords="web development agency, UI UX design agency, social media management, React development, Next.js developers, digital agency India, product design studio, creative agency"
        url="/"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': 'https://refractlabs.com/#webpage',
            url: 'https://refractlabs.com/',
            name: 'RefractLabs — Web Development, UI/UX Design & Social Media Management Agency',
            isPartOf: { '@id': 'https://refractlabs.com/#website' },
            about: { '@id': 'https://refractlabs.com/#organization' },
            primaryImageOfPage: 'https://refractlabs.com/og-image.png',
            inLanguage: 'en-US',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Web Development',
            provider: { '@id': 'https://refractlabs.com/#organization' },
            areaServed: 'Worldwide',
            description: 'High-performance websites and web applications built with React, Next.js and modern web technologies.',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'UI/UX Design',
            provider: { '@id': 'https://refractlabs.com/#organization' },
            areaServed: 'Worldwide',
            description: 'Product design, user research, design systems and interaction design that scale across platforms.',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Social Media Management',
            provider: { '@id': 'https://refractlabs.com/#organization' },
            areaServed: 'Worldwide',
            description: 'Content creation, campaign management and community growth across every platform that matters.',
          },
        ]}
      />
      <Navbar />

      {/* Hero Section with Logo Marquee at bottom */}
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#080808',
      }}>
        <Hero />
        <LogoMarquee />
      </div>

      <div style={DEFER_STYLE}><Services /></div>
      <div style={DEFER_STYLE}><SelectedWork /></div>
      <div style={DEFER_STYLE}><ImpactAtScale /></div>
      <div style={DEFER_STYLE}><BuildEnvironment /></div>
      <div style={DEFER_STYLE}><Testimonials /></div>
      <div style={DEFER_STYLE}><CTASection /></div>
      <Footer />
    </div>
  );
};

export default Home;

