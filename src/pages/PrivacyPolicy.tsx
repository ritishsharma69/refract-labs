import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useSmoothScroll from '../hooks/useSmoothScroll';

const PrivacyPolicy = () => {
  useSmoothScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sectionStyle = {
    marginBottom: '32px',
  };

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
      <Navbar />

      {/* Hero Section */}
      <div
        style={{
          padding: isMobile ? '120px 24px 40px' : '160px 80px 60px',
          textAlign: 'center',
        }}
      >
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: isMobile ? '36px' : '56px',
          fontWeight: 700,
          color: 'white',
          marginBottom: '16px',
        }}>
          Privacy Policy
        </h1>
        <p style={{
          fontSize: isMobile ? '14px' : '16px',
          color: '#666',
        }}>
          Last Updated: March 2026
        </p>
      </div>

      {/* Content Section */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: isMobile ? '40px 24px 80px' : '60px 40px 120px',
        }}
      >
        {/* Introduction */}
        <div style={sectionStyle}>
          <p style={textStyle}>
            Pulse Partners AI LLC dba Refract Labs ("Refract Labs," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and protect information when you visit our website refractlabs.com (the "Site") or engage with our services.
          </p>
        </div>

        {/* Information We Collect */}
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Information We Collect</h2>
          <p style={textStyle}><strong style={{ color: '#e07030' }}>Personal Information:</strong> Name, email address, phone number, company name, job title, and any other information you provide when contacting us or requesting our services.</p>
          <p style={{ ...textStyle, marginTop: '12px' }}><strong style={{ color: '#e07030' }}>Usage Data:</strong> IP address, browser type, device information, pages visited, time spent on pages, and other analytics data collected through cookies and similar technologies.</p>
          <p style={{ ...textStyle, marginTop: '12px' }}><strong style={{ color: '#e07030' }}>Communications:</strong> Records of correspondence if you contact us directly.</p>
        </div>

        {/* How We Use Your Information */}
        <div style={sectionStyle}>
          <h2 style={headingStyle}>How We Use Your Information</h2>
          <ul style={listStyle}>
            <li style={{ marginBottom: '8px' }}>To provide, maintain, and improve our services</li>
            <li style={{ marginBottom: '8px' }}>To respond to inquiries and communicate with you</li>
            <li style={{ marginBottom: '8px' }}>To send promotional communications (with your consent)</li>
            <li style={{ marginBottom: '8px' }}>To analyze website usage and improve user experience</li>
            <li style={{ marginBottom: '8px' }}>To comply with legal obligations</li>
          </ul>
        </div>

        {/* Information Sharing */}
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Information Sharing</h2>
          <p style={textStyle}>
            We do not sell your personal information. We may share information with:
          </p>
          <ul style={listStyle}>
            <li style={{ marginBottom: '8px' }}>Service providers who assist in our operations</li>
            <li style={{ marginBottom: '8px' }}>Professional advisors (legal, accounting, etc.)</li>
            <li style={{ marginBottom: '8px' }}>Law enforcement when required by law</li>
            <li style={{ marginBottom: '8px' }}>Business successors in case of merger or acquisition</li>
          </ul>
        </div>

        {/* Data Security */}
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Data Security</h2>
          <p style={textStyle}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </div>

        {/* Your Rights */}
        <div style={sectionStyle}>
          <h2 style={headingStyle}>Your Rights</h2>
          <p style={textStyle}>
            Depending on your location, you may have the right to access, correct, delete, or port your personal information. You may also have the right to opt-out of certain processing of your personal information. To exercise these rights, contact us at: <a href="mailto:legal@refractlabs.com" style={{ color: '#c2622a' }}>legal@refractlabs.com</a>.
          </p>
        </div>

        {/* Contact Us */}
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

export default PrivacyPolicy;

