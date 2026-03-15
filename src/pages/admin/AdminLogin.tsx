import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../lib/content-store';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="admin-shell-bg flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="admin-surface hidden rounded-[32px] p-8 lg:flex lg:flex-col lg:justify-between xl:p-10">
          <div>
            <p className="admin-chip">RefractLabs Admin</p>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white font-['Space_Grotesk'] xl:text-5xl">
              A cleaner control room for your content team.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-8 text-gray-400">
              Manage team profiles, works, and testimonials from one polished dashboard with better spacing and easier scanning.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: 'Team', label: 'People profiles' },
              { value: 'Works', label: 'Portfolio entries' },
              { value: 'Social', label: 'Testimonials & proof' },
            ].map((item) => (
              <div key={item.label} className="admin-surface-soft rounded-[24px] p-5">
                <div className="text-xl font-semibold text-white">{item.value}</div>
                <div className="mt-2 text-sm leading-6 text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-surface rounded-[32px] p-7 sm:p-9">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.24em] text-orange-300/80">Secure access</p>
            <h2 className="mt-3 text-3xl font-semibold text-white font-['Space_Grotesk']">Sign in</h2>
            <p className="mt-2 text-sm leading-7 text-gray-400">Use your admin credentials to open the dashboard.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-400">Email</label>
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
              <label className="mb-2 block text-sm text-gray-400">Password</label>
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
              className="admin-primary-btn w-full rounded-2xl px-5 py-3.5 text-sm font-semibold"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-xs leading-6 text-gray-400">
            Demo credentials: <span className="text-white">admin@refractlabs.com</span> / <span className="text-white">admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

