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
        title="Home"
        description="RefractLabs — Premium Web Development, UI/UX Design & Digital Identity Agency. We bend ideas into reality with cutting-edge React, Next.js & modern web technologies."
        keywords="web development agency, UI UX design, React development, Next.js, digital agency India, social media management, RefractLabs"
        url="/"
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

