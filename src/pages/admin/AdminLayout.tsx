import { useEffect, useState } from 'react';
import {
  FiBell,
  FiBriefcase,
  FiHome,
  FiLogOut,
  FiMenu,
  FiInbox,
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
    { label: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
    { label: 'Team', path: '/admin/team', icon: FiUsers },
    { label: 'Works', path: '/admin/works', icon: FiBriefcase },
    { label: 'Testimonials', path: '/admin/testimonials', icon: FiMessageSquare },
    { label: 'Leads', path: '/admin/leads', icon: FiInbox },
    { label: 'Settings', path: '#', icon: FiSettings },
  ];

  const pageMeta: Record<string, { label: string }> = {
    '/admin/dashboard': { label: 'Dashboard' },
    '/admin/team': { label: 'Team Management' },
    '/admin/works': { label: 'Works Management' },
    '/admin/testimonials': { label: 'Testimonials' },
    '/admin/leads': { label: 'Leads' },
  };

  const currentPage = pageMeta[location.pathname] || { label: 'Dashboard' };
  const userInitial = adminEmail?.charAt(0).toUpperCase() || 'A';
  const userName = adminEmail?.split('@')[0] || 'Admin';

  return (
    <div className="admin-shell-bg flex min-h-screen">
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md lg:hidden"
      >
        {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-[220px] shrink-0 transform transition-transform duration-200 ease-out
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="admin-sidebar-panel flex h-full flex-col px-4 py-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--admin-lime)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--admin-text)' }}>RefractLabs</span>
          </Link>

          {/* Nav */}
          <nav className="mt-10 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path + item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-all duration-150
                    ${isActive
                      ? 'bg-[var(--admin-lime)] text-[var(--admin-lime-dark)]'
                      : 'text-[var(--admin-text-secondary)] hover:bg-[var(--admin-bg)] hover:text-[var(--admin-text)]'
                    }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="mt-auto space-y-3 pt-6" style={{ borderTop: '1px solid var(--admin-border)' }}>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-[var(--admin-text-secondary)] transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="min-w-0 flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-[var(--admin-bg)] px-6 py-4 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--admin-text)' }}>
            {currentPage.label}
          </h1>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden items-center gap-2 rounded-xl border border-[var(--admin-border)] bg-white px-3 py-2 md:flex" style={{ minWidth: 240 }}>
              <FiSearch size={16} className="text-[var(--admin-text-muted)]" />
              <input
                type="text"
                placeholder="Search content, sections..."
                className="flex-1 border-0 bg-transparent text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-muted)]"
              />
            </div>

            <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-white text-[var(--admin-text-secondary)] transition-colors hover:bg-[var(--admin-bg)]" aria-label="Notifications">
              <FiBell size={16} />
            </button>

            {/* User avatar */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--admin-lime)] text-sm font-bold text-[var(--admin-lime-dark)]">
                {userInitial}
              </div>
              <div className="hidden flex-col md:flex">
                <span className="text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>{userName}</span>
                <span className="text-xs" style={{ color: 'var(--admin-text-muted)' }}>Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="px-6 pb-10 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

