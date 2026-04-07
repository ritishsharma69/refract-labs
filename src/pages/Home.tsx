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
        keywords="web development agency, UI UX design, React development, Next.js, digital agency India, branding, RefractLabs"
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

      {/* Services / Capabilities Section */}
      <Services />

      {/* Selected Work Section */}
      <SelectedWork />

      {/* Impact at Scale Section */}
      <ImpactAtScale />

      {/* Build Environment Section */}
      <BuildEnvironment />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Final CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;

