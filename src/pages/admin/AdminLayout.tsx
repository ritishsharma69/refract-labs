import { useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiBriefcase, FiLogOut, FiMenu, FiMessageSquare, FiX } from 'react-icons/fi';
import { useState } from 'react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminEmail = typeof window !== 'undefined' ? localStorage.getItem('adminEmail') : null;

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', caption: 'Overview & pulse', path: '/admin/dashboard', icon: FiHome },
    { label: 'Team', caption: 'People & profiles', path: '/admin/team', icon: FiUsers },
    { label: 'Works', caption: 'Portfolio library', path: '/admin/works', icon: FiBriefcase },
    { label: 'Testimonials', caption: 'Social proof feed', path: '/admin/testimonials', icon: FiMessageSquare },
  ];

  const pageMeta: Record<string, { label: string; description: string }> = {
    '/admin/dashboard': {
      label: 'Dashboard',
      description: 'High-level visibility into the content areas your team updates most often.',
    },
    '/admin/team': {
      label: 'Team Management',
      description: 'Shape bios, portraits, and profile links without losing visual hierarchy.',
    },
    '/admin/works': {
      label: 'Works Management',
      description: 'Curate portfolio entries, home-page picks, and links from a cleaner workspace.',
    },
    '/admin/testimonials': {
      label: 'Testimonials',
      description: 'Control social proof cards, featured stories, and the homepage showcase.',
    },
  };

  const currentPage = pageMeta[location.pathname] || {
    label: 'Admin Workspace',
    description: 'Manage content across the RefractLabs publishing system.',
  };

  const todayLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="admin-shell-bg min-h-screen text-white">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="admin-secondary-btn fixed left-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-2xl text-white lg:hidden"
      >
        {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      <div className="mx-auto flex min-h-screen w-full max-w-[1700px] lg:px-4">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-[312px] transform transition-transform duration-200 ease-out
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:py-4
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="admin-surface flex h-full flex-col px-4 py-4 lg:rounded-[34px]">
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,146,92,0.18),rgba(255,255,255,0.04))] p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/12 bg-black/25 text-lg font-bold text-white shadow-[0_14px_34px_rgba(0,0,0,0.2)]">
                  RL
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-200/85">RefractLabs admin</p>
                  <Link to="/" className="mt-2 block truncate text-[28px] font-bold leading-none text-white font-['Space_Grotesk']">
                    Command Deck
                  </Link>
                  <p className="mt-3 text-sm leading-6 text-gray-300/80">
                    A sharper content operations layer for team profiles, portfolio work, and social proof.
                  </p>
                </div>
              </div>

              {adminEmail && (
                <div className="mt-5 rounded-[24px] border border-white/10 bg-black/25 px-4 py-3.5">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Signed in as</p>
                  <p className="mt-1 truncate text-sm font-medium text-white">{adminEmail}</p>
                </div>
              )}
            </div>

            <div className="mt-6 px-1">
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-gray-500">Workspace</p>
              <nav className="mt-3 space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`admin-nav-link flex items-center justify-between gap-3 rounded-[24px] px-4 py-4 transition-all duration-200 ${isActive ? 'admin-nav-link--active' : 'text-gray-400 hover:text-white'}`}
                    >
                      <span className="flex min-w-0 items-center gap-3.5">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] border ${isActive ? 'border-orange-400/20 bg-orange-400/15 text-orange-200' : 'border-white/6 bg-white/[0.04] text-gray-300'}`}>
                          <Icon size={18} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-white">{item.label}</span>
                          <span className="mt-1 block truncate text-xs text-gray-500">{item.caption}</span>
                        </span>
                      </span>
                      <span className={`h-2.5 w-2.5 rounded-full transition-all ${isActive ? 'bg-orange-300 shadow-[0_0_14px_rgba(255,179,136,0.8)]' : 'bg-white/10'}`} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto space-y-4 px-1 pt-6">
              <div className="admin-surface-soft rounded-[28px] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">Session status</p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">Live local sync</p>
                    <p className="mt-1 text-xs leading-6 text-gray-500">Content changes update instantly across the admin workspace.</p>
                  </div>
                  <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.85)]" />
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="admin-secondary-btn flex w-full items-center justify-center gap-3 rounded-[22px] px-4 py-3.5 text-sm font-medium text-gray-200 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-100"
              >
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-auto px-4 pb-8 pt-24 sm:px-6 lg:px-8 lg:pb-10 lg:pt-4 xl:px-10">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
            <div className="admin-topbar rounded-[32px] p-5 sm:p-6 lg:p-7">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <span className="admin-chip">Admin workspace</span>
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">Current section</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white font-['Space_Grotesk'] sm:text-[30px]">{currentPage.label}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-400">{currentPage.description}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                  <div className="admin-pill">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.85)]" />
                    {todayLabel}
                  </div>
                  <div className="admin-pill">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.85)]" />
                    Live local sync enabled
                  </div>
                </div>
              </div>
            </div>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

