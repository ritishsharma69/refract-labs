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
    { label: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
    { label: 'Team', path: '/admin/team', icon: FiUsers },
    { label: 'Works', path: '/admin/works', icon: FiBriefcase },
    { label: 'Testimonials', path: '/admin/testimonials', icon: FiMessageSquare },
  ];

  return (
    <div className="admin-shell-bg min-h-screen text-white lg:flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="admin-secondary-btn lg:hidden fixed left-4 top-4 z-50 rounded-2xl p-3 text-white"
      >
        {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-[290px] transform transition-transform duration-200 ease-in-out
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:px-4 lg:py-4
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="admin-surface flex h-full flex-col overflow-hidden border-r border-white/5 bg-[#090909]/95 px-4 py-5 lg:rounded-[30px] lg:border-white/8">
          <div className="rounded-[24px] border border-white/6 bg-white/[0.02] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-300/80">Admin workspace</p>
            <Link to="/" className="mt-3 block text-[28px] font-bold leading-none text-white font-['Space_Grotesk']">
              RefractLabs
            </Link>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Cleaner, roomier controls for team, works, and testimonials.
            </p>
            {adminEmail && (
              <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Signed in as</p>
                <p className="mt-1 truncate text-sm font-medium text-white">{adminEmail}</p>
              </div>
            )}
          </div>

          <div className="mt-6 px-2">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">Navigation</p>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 transition-all duration-200 ${
                      isActive
                        ? 'border-orange-500/25 bg-orange-500/12 text-white shadow-[0_18px_40px_rgba(194,98,42,0.12)]'
                        : 'border-transparent text-gray-400 hover:border-white/8 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isActive ? 'bg-orange-500/18 text-orange-300' : 'bg-white/[0.04] text-gray-300'}`}>
                        <Icon size={18} />
                      </span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </span>
                    {isActive && <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto px-2 pt-6">
            <button
              onClick={handleLogout}
              className="admin-secondary-btn flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-gray-300 hover:border-red-500/20 hover:bg-red-500/8 hover:text-red-200"
            >
              <FiLogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-auto px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:pb-8 lg:pt-6">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6">
          <div className="admin-surface-soft flex flex-col gap-3 rounded-[24px] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300/80">RefractLabs admin</p>
              <p className="mt-1 text-sm text-gray-400">More breathing room, better hierarchy, and faster content management.</p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/8 bg-black/20 px-4 py-2 text-xs text-gray-400">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.8)]" />
              Live local sync enabled
            </div>
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

