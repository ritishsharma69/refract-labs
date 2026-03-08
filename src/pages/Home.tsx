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
import useSmoothScroll from '../hooks/useSmoothScroll';

const Home = () => {
  useSmoothScroll();

  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
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

