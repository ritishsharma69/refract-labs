import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { getLenisInstance } from './hooks/useSmoothScroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function ScrollToTop() {
  const { pathname } = useLocation();

  // useLayoutEffect runs before browser paint — reset scroll immediately
  useLayoutEffect(() => {
    // Kill all ScrollTrigger instances from previous page
    ScrollTrigger.getAll().forEach((t) => t.kill());

    // Force native scroll to top immediately
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Reset Lenis if available
    const lenis = getLenisInstance();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }

    // Also reset after a small delay (for when new Lenis instance mounts)
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      const newLenis = getLenisInstance();
      if (newLenis) {
        newLenis.scrollTo(0, { immediate: true });
      }
      ScrollTrigger.refresh();
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
import Home from './pages/Home';
import About from './pages/About';
import Works from './pages/Works';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import TeamManagement from './pages/admin/TeamManagement';
import WorksManagement from './pages/admin/WorksManagement';
import TestimonialsManagement from './pages/admin/TestimonialsManagement';
import LeadsManagement from './pages/admin/LeadsManagement';
import TestimonialsPage from './pages/TestimonialsPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/works" element={<Works />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="team" element={<TeamManagement />} />
          <Route path="works" element={<WorksManagement />} />
          <Route path="testimonials" element={<TestimonialsManagement />} />
          <Route path="leads" element={<LeadsManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
