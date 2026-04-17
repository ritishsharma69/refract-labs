import { useEffect, useState } from 'react';
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Inbox,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronsRight,
  ChevronDown,
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    { label: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { label: 'Team', path: '/admin/team', icon: Users },
    { label: 'Works', path: '/admin/works', icon: Briefcase },
    { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { label: 'Leads', path: '/admin/leads', icon: Inbox },
    { label: 'Settings', path: '#', icon: Settings },
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

  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-64';

  return (
    <div className="admin-shell-bg flex min-h-screen">
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md lg:hidden"
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 shrink-0 transform transition-all duration-300 ease-in-out
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${sidebarWidth}
      `}>
        <div className="admin-sidebar-panel flex h-full flex-col p-2">
          {/* Brand */}
          <div className="mb-6 border-b border-[var(--admin-border)] pb-4">
            <Link to="/" className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-[var(--admin-bg)]">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-[var(--admin-purple)] to-[#6c5ce7]">
                  <svg width="20" height="auto" viewBox="0 0 50 39" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-white">
                    <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
                    <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
                  </svg>
                </div>
                {!sidebarCollapsed && (
                  <div className="transition-opacity duration-200">
                    <span className="block text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>RefractLabs</span>
                    <span className="block text-xs" style={{ color: 'var(--admin-text-muted)' }}>Admin Panel</span>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && (
                <ChevronDown size={16} style={{ color: 'var(--admin-text-muted)' }} />
              )}
            </Link>
          </div>

          {/* Nav */}
          <nav className="space-y-1 mb-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path + item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200
                    ${isActive
                      ? 'bg-[var(--admin-purple-light)] shadow-sm'
                      : 'hover:bg-[var(--admin-bg)]'
                    }`}
                  style={isActive ? { borderLeft: '2px solid var(--admin-purple)', color: 'var(--admin-purple)' } : { color: 'var(--admin-text-secondary)' }}
                >
                  <div className="grid h-full w-12 place-content-center">
                    <Icon size={16} />
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          {!sidebarCollapsed && (
            <div className="border-t border-[var(--admin-border)] pt-4 space-y-1 mt-auto">
              <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--admin-text-muted)' }}>
                Account
              </div>
              <button
                onClick={handleLogout}
                className="relative flex h-11 w-full items-center rounded-md transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                style={{ color: 'var(--admin-text-secondary)' }}
              >
                <div className="grid h-full w-12 place-content-center">
                  <LogOut size={16} />
                </div>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}

          {sidebarCollapsed && (
            <div className="mt-auto border-t border-[var(--admin-border)] pt-2">
              <button
                onClick={handleLogout}
                className="relative flex h-11 w-full items-center rounded-md transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                style={{ color: 'var(--admin-text-secondary)' }}
              >
                <div className="grid h-full w-12 place-content-center">
                  <LogOut size={16} />
                </div>
              </button>
            </div>
          )}

          {/* Toggle collapse */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex absolute bottom-0 left-0 right-0 border-t border-[var(--admin-border)] transition-colors hover:bg-[var(--admin-bg)]"
          >
            <div className="flex items-center p-3">
              <div className="grid h-10 w-10 place-content-center">
                <ChevronsRight
                  size={16}
                  className={`transition-transform duration-300 ${sidebarCollapsed ? '' : 'rotate-180'}`}
                  style={{ color: 'var(--admin-text-muted)' }}
                />
              </div>
              {!sidebarCollapsed && (
                <span className="text-sm font-medium" style={{ color: 'var(--admin-text-secondary)' }}>Hide</span>
              )}
            </div>
          </button>
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
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[var(--admin-border)] bg-white px-8 py-5 lg:px-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--admin-text)' }}>
              {currentPage.label}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>Welcome back to your dashboard</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden items-center gap-2 rounded-xl border border-[var(--admin-border)] bg-white px-3 py-2 md:flex" style={{ minWidth: 240 }}>
              <Search size={16} style={{ color: 'var(--admin-text-muted)' }} />
              <input
                type="text"
                placeholder="Search content, sections..."
                className="flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[var(--admin-text-muted)]"
                style={{ color: 'var(--admin-text)' }}
              />
            </div>

            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-white transition-colors hover:bg-[var(--admin-bg)]" aria-label="Notifications" style={{ color: 'var(--admin-text-secondary)' }}>
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
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
        <div className="px-8 py-8 pb-12 lg:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

