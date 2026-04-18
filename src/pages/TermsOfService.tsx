import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import useSmoothScroll from '../hooks/useSmoothScroll';

const TermsOfService = () => {
  useSmoothScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sectionStyle = { marginBottom: '32px' };

  const headingStyle = {
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 600,
    color: '#e07030',
    marginBottom: '16px',
  };

  const textStyle = {
    fontSize: isMobile ? '14px' : '16px',
    color: '#a0a0a0',
    lineHeight: 1.8,
  };

  const listStyle = {
    ...textStyle,
    paddingLeft: '24px',
    marginTop: '12px',
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#080808' }}>
      <SEO
        title="Terms of Service"
        description="The terms and conditions that govern your use of RefractLabs' websites, services and engagements."
        url="/terms-of-service"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Terms of Service', url: '/terms-of-service' },
        ]}
      />
      <Navbar />

      <div style={{ padding: isMobile ? '120px 24px 40px' : '160px 80px 60px', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: isMobile ? '36px' : '56px',
          fontWeight: 700,
          color: 'white',
          marginBottom: '16px',
        }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#666' }}>
          Last Updated: March 2026
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '40px 24px 80px' : '60px 40px 120px' }}>
        <div style={sectionStyle}>
          <p style={textStyle}>
            These Terms of Service ("Terms") govern your access to and use of the website refractlabs.com (the "Site") and services provided by Pulse Partners AI LLC dba Refract Labs ("Refract Labs," "we," "us," or "our"). By accessing or using our Site or services, you agree to be bound by these Terms.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Use of Services</h2>
          <p style={textStyle}>
            You agree to use our services only for lawful purposes and in accordance with these Terms. You may not use our services in any way that could damage, disable, or impair the Site or interfere with any other party's use of the Site.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Intellectual Property</h2>
          <p style={textStyle}>
            All content, features, and functionality on the Site — including but not limited to text, graphics, logos, icons, images, audio, video, software, and code — are the exclusive property of Refract Labs and are protected by copyright, trademark, and other intellectual property laws.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Client Projects & Deliverables</h2>
          <p style={textStyle}>
            Upon full payment, clients receive ownership of agreed-upon deliverables as specified in their project agreement. Refract Labs retains the right to showcase completed work in portfolios and marketing materials unless otherwise agreed in writing.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Payment Terms</h2>
          <ul style={listStyle}>
            <li style={{ marginBottom: '8px' }}>All project fees are outlined in the project proposal or agreement</li>
            <li style={{ marginBottom: '8px' }}>A deposit may be required before work begins</li>
            <li style={{ marginBottom: '8px' }}>Late payments may incur additional fees as outlined in the agreement</li>
            <li style={{ marginBottom: '8px' }}>Refund policies are determined on a per-project basis</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Limitation of Liability</h2>
          <p style={textStyle}>
            To the fullest extent permitted by law, Refract Labs shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Site or our services.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Termination</h2>
          <p style={textStyle}>
            We reserve the right to terminate or suspend access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Governing Law</h2>
          <p style={textStyle}>
            These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
          </p>
        </div>

        <div style={{ ...sectionStyle, marginBottom: 0 }}>
          <h2 style={headingStyle}>Contact Us</h2>
          <p style={textStyle}>
            Pulse Partners AI LLC dba Refract Labs<br />
            6977 Navajo Rd. #520<br />
            San Diego, CA 92115<br />
            Email: <a href="mailto:legal@refractlabs.com" style={{ color: '#c2622a' }}>legal@refractlabs.com</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;

