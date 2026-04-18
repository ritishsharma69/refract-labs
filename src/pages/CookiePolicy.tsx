import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import useSmoothScroll from '../hooks/useSmoothScroll';

const CookiePolicy = () => {
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
        title="Cookie Policy"
        description="How RefractLabs uses cookies and similar technologies to operate, secure and improve our websites and services."
        url="/cookie-policy"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Cookie Policy', url: '/cookie-policy' },
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
          Cookie Policy
        </h1>
        <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#666' }}>
          Last Updated: March 2026
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '40px 24px 80px' : '60px 40px 120px' }}>
        <div style={sectionStyle}>
          <p style={textStyle}>
            This Cookie Policy explains how Pulse Partners AI LLC dba Refract Labs ("Refract Labs," "we," "us," or "our") uses cookies and similar tracking technologies when you visit our website refractlabs.com (the "Site").
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>What Are Cookies</h2>
          <p style={textStyle}>
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the site owners.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Types of Cookies We Use</h2>
          <ul style={listStyle}>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#e07030' }}>Essential Cookies:</strong> Required for the Site to function properly. These cannot be disabled.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#e07030' }}>Analytics Cookies:</strong> Help us understand how visitors interact with the Site by collecting and reporting information anonymously.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#e07030' }}>Functional Cookies:</strong> Enable enhanced functionality and personalization, such as remembering your preferences.</li>
            <li style={{ marginBottom: '8px' }}><strong style={{ color: '#e07030' }}>Marketing Cookies:</strong> Used to track visitors across websites to display relevant advertisements.</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Third-Party Cookies</h2>
          <p style={textStyle}>
            We may use third-party services such as Google Analytics, Hotjar, and similar tools that place cookies on your device. These services help us analyze website traffic and user behavior to improve our services.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Managing Cookies</h2>
          <p style={textStyle}>
            You can control and manage cookies through your browser settings. Most browsers allow you to refuse or accept cookies, delete existing cookies, and set preferences for certain websites. Please note that disabling cookies may affect the functionality of the Site.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Cookie Retention</h2>
          <p style={textStyle}>
            Session cookies are temporary and are deleted when you close your browser. Persistent cookies remain on your device for a set period or until you delete them manually.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Updates to This Policy</h2>
          <p style={textStyle}>
            We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
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

export default CookiePolicy;

