import { useState } from 'react';
import { FiArrowRight, FiLock, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { loginAdmin } from '../../lib/content-store';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell-bg min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <Helmet>
        <title>Admin Login — RefractLabs</title>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="admin-surface relative hidden overflow-hidden rounded-[36px] p-8 lg:flex lg:flex-col lg:justify-between xl:p-10">
          <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.22),transparent_64%)]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16),transparent_68%)]" />

          <div className="relative z-10 max-w-2xl">
            <span className="admin-chip">Admin access</span>
            <p className="mt-6 text-sm font-medium uppercase tracking-[0.26em] text-slate-400">RefractLabs control panel</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white font-['Space_Grotesk'] xl:text-5xl">
              Clean admin UI for faster edits and less visual noise.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
              Sign in to manage team, works, and testimonials from one consistent workspace. Simpler layout, cleaner spacing, easier scanning.
            </p>
          </div>

          <div className="relative z-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { title: 'Protected access', copy: 'Only admin credentials can open the workspace.', icon: FiShield },
              { title: 'Single system', copy: 'Team, works, and testimonials stay in one place.', icon: FiLock },
              { title: 'Quick workflow', copy: 'Log in and jump straight to the section you need.', icon: FiArrowRight },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="admin-form-block rounded-[24px] p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-orange-300">
                    <Icon size={18} />
                  </div>
                  <h2 className="mt-5 text-base font-semibold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="admin-surface flex rounded-[36px] p-6 sm:p-8 xl:p-10">
          <div className="m-auto w-full max-w-xl">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <span className="admin-chip">Secure sign in</span>
                <h2 className="mt-4 text-3xl font-semibold text-white font-['Space_Grotesk'] sm:text-[34px]">Welcome back</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Use your admin credentials to access the redesigned RefractLabs dashboard.
                </p>
              </div>
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white sm:flex">
                <FiLock size={20} />
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-input px-4 py-3.5 text-sm"
                  placeholder="admin@refractlabs.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input px-4 py-3.5 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="admin-primary-btn inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold"
              >
                <span>{loading ? 'Signing in...' : 'Open dashboard'}</span>
                {!loading && <FiArrowRight size={16} />}
              </button>
            </form>

            <div className="admin-form-block mt-6 rounded-[24px] p-4 sm:p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Demo credentials</p>
              <div className="mt-3 flex flex-col gap-3 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                <span className="admin-kbd">admin@refractlabs.com</span>
                <span className="admin-kbd">admin123</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminLogin;

