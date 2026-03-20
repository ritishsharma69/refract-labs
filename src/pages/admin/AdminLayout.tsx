import { useEffect, useState } from 'react';
import {
  FiBell,
  FiBriefcase,
  FiGrid,
  FiHome,
  FiLogOut,
  FiMenu,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

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
      description: 'Shape bios, portraits, and profile links from a cleaner workspace.',
    },
    '/admin/works': {
      label: 'Works Management',
      description: 'Curate portfolio entries, homepage picks, and links from one consistent UI.',
    },
    '/admin/testimonials': {
      label: 'Testimonials',
      description: 'Control social proof cards, featured stories, and homepage visibility.',
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
  const userInitial = adminEmail?.charAt(0).toUpperCase() || 'A';

  return (
    <div className="admin-shell-bg min-h-screen text-white">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="admin-icon-btn fixed left-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-2xl text-white lg:hidden"
      >
        {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      <div className="mx-auto flex min-h-screen w-full max-w-[1720px] lg:gap-5 lg:px-5 xl:px-6 2xl:gap-6">
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-[286px] transform transition-transform duration-200 ease-out
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:py-4
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="admin-sidebar-panel flex h-full flex-col px-4 py-4 lg:rounded-[34px]">
            <div className="admin-sidebar-brand p-5">
              <div className="flex items-start gap-4">
                <div className="admin-brand-mark">
                  RL
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-200/85">RefractLabs admin</p>
                  <Link to="/" className="mt-2 block truncate text-[28px] font-bold leading-none text-white font-['Space_Grotesk']">
                    Blue Ops
                  </Link>
                  <p className="mt-3 text-sm leading-6 text-slate-300/90">
                    Premium command center for people, portfolio, and proof — closer to the analytics reference you shared.
                  </p>
                </div>
              </div>

              {adminEmail && (
                <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/35 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/25 bg-sky-400/12 text-sm font-semibold text-sky-100">
                      {userInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Signed in as</p>
                      <p className="mt-1 truncate text-sm font-medium text-white">{adminEmail}</p>
                      <p className="mt-1 text-xs text-slate-400">Content operator</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 px-1">
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">Navigation</p>
              <nav className="mt-3 space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`admin-nav-link flex items-center justify-between gap-3 rounded-[24px] px-4 py-4 transition-all duration-200 ${isActive ? 'admin-nav-link--active' : 'text-slate-400 hover:text-white'}`}
                    >
                      <span className="flex min-w-0 items-center gap-3.5">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] border ${isActive ? 'border-sky-400/30 bg-sky-400/15 text-sky-100' : 'border-white/8 bg-white/[0.03] text-slate-300'}`}>
                          <Icon size={18} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-white">{item.label}</span>
                          <span className="mt-1 block truncate text-xs text-slate-500">{item.caption}</span>
                        </span>
                      </span>
                      <span className={`h-2.5 w-2.5 rounded-full transition-all ${isActive ? 'bg-sky-300 shadow-[0_0_16px_rgba(125,211,252,0.9)]' : 'bg-white/10'}`} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto space-y-4 px-1 pt-6">
              <div className="admin-surface-soft rounded-[28px] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Session status</p>
                    <p className="mt-3 text-sm font-medium text-white">Live local sync</p>
                    <p className="mt-1 text-xs leading-6 text-slate-500">Content changes update instantly across the workspace.</p>
                  </div>
                  <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.85)]" />
                </div>
              </div>

              <div className="admin-form-block rounded-[26px] px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Environment</p>
                    <p className="mt-2 text-sm font-medium text-white">Local dashboard</p>
                  </div>
                  <FiGrid className="text-sky-200" size={18} />
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-400">Optimized for faster editing flows with a more premium analytics-style feel.</p>
              </div>

              <button
                onClick={handleLogout}
                className="admin-secondary-btn flex w-full items-center justify-center gap-3 rounded-[22px] px-4 py-3.5 text-sm font-medium text-slate-200 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-100"
              >
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="min-w-0 flex-1 overflow-auto px-4 pb-10 pt-24 sm:px-6 lg:px-6 lg:pb-12 lg:pt-5 xl:px-8 2xl:px-10">
          <div className="mx-auto flex w-full max-w-[1420px] flex-col gap-7 lg:gap-8">
            <div className="admin-topbar rounded-[32px] p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-center 2xl:justify-between">
                  <div>
                    <span className="admin-chip">Analytics workspace</span>
                    <div className="mt-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Current section</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white font-['Space_Grotesk'] sm:text-[30px]">{currentPage.label}</h2>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">{currentPage.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 2xl:justify-end">
                    <button className="admin-top-action" type="button" aria-label="Notifications">
                      <FiBell size={18} />
                    </button>
                    <button className="admin-top-action" type="button" aria-label="Settings">
                      <FiSettings size={18} />
                    </button>
                    <div className="flex h-12 min-w-[56px] items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 text-sm font-semibold text-sky-100 shadow-[0_16px_34px_rgba(14,165,233,0.18)]">
                      {userInitial}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_auto] 2xl:items-center">
                  <label className="admin-search-shell">
                    <FiSearch className="text-slate-400" size={18} />
                    <input
                      className="admin-analytics-search"
                      type="text"
                      placeholder="Search sections, actions, or content blocks..."
                    />
                  </label>

                  <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-start 2xl:justify-end">
                    <div className="admin-pill">
                      <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.85)]" />
                      {todayLabel}
                    </div>
                    <div className="admin-pill">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.85)]" />
                      Live sync enabled
                    </div>
                    <Link to="/" className="admin-primary-btn inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium text-white">
                      View site
                    </Link>
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

