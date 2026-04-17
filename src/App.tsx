import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useLayoutEffect } from 'react';
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
import TestimonialsPage from './pages/TestimonialsPage';

// Admin routes are lazy-loaded so they're only compiled/downloaded when accessed
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const TeamManagement = lazy(() => import('./pages/admin/TeamManagement'));
const WorksManagement = lazy(() => import('./pages/admin/WorksManagement'));
const TestimonialsManagement = lazy(() => import('./pages/admin/TestimonialsManagement'));
const LeadsManagement = lazy(() => import('./pages/admin/LeadsManagement'));

const AdminFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
    <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/10 border-t-[#8b7be8]" />
  </div>
);

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

        {/* Admin Routes (lazy-loaded) */}
        <Route
          path="/admin/login"
          element={<Suspense fallback={<AdminFallback />}><AdminLogin /></Suspense>}
        />
        <Route
          path="/admin"
          element={<Suspense fallback={<AdminFallback />}><AdminLayout /></Suspense>}
        >
          <Route path="dashboard" element={<Suspense fallback={<AdminFallback />}><Dashboard /></Suspense>} />
          <Route path="team" element={<Suspense fallback={<AdminFallback />}><TeamManagement /></Suspense>} />
          <Route path="works" element={<Suspense fallback={<AdminFallback />}><WorksManagement /></Suspense>} />
          <Route path="testimonials" element={<Suspense fallback={<AdminFallback />}><TestimonialsManagement /></Suspense>} />
          <Route path="leads" element={<Suspense fallback={<AdminFallback />}><LeadsManagement /></Suspense>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
