import { useEffect, useState } from 'react';
import { FiUsers, FiBriefcase, FiHome, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  getHomeFeaturedTestimonials,
  getHomeFeaturedWorks,
  getTestimonialItems,
  getWorkItems,
  subscribeToContentUpdates,
} from '../../lib/content-store';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { label: 'Team Members', value: '0', icon: FiUsers, color: 'orange', link: '/admin/team' },
    { label: 'All Works', value: '0', icon: FiBriefcase, color: 'blue', link: '/admin/works' },
    { label: 'Home Works', value: '0', icon: FiHome, color: 'green', link: '/admin/works' },
    { label: 'Testimonials', value: '0', icon: FiMessageSquare, color: 'purple', link: '/admin/testimonials' },
  ]);

  useEffect(() => {
    const readTeamMembers = () => {
      try {
        const stored = localStorage.getItem('teamMembers');
        return stored ? JSON.parse(stored).length : 2;
      } catch {
        return 2;
      }
    };

    const syncStats = () => {
      setStats([
        { label: 'Team Members', value: String(readTeamMembers()), icon: FiUsers, color: 'orange', link: '/admin/team' },
        { label: 'All Works', value: String(getWorkItems().length), icon: FiBriefcase, color: 'blue', link: '/admin/works' },
        { label: 'Home Works', value: String(getHomeFeaturedWorks().length), icon: FiHome, color: 'green', link: '/admin/works' },
        { label: 'Testimonials', value: String(getTestimonialItems().length), icon: FiMessageSquare, color: 'purple', link: '/admin/testimonials' },
      ]);
    };

    syncStats();

    const unsubscribe = subscribeToContentUpdates(syncStats);
    window.addEventListener('storage', syncStats);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', syncStats);
    };
  }, []);

  const colorClasses = {
    orange: 'bg-orange-500/12 text-orange-300 border-orange-500/20',
    blue: 'bg-blue-500/12 text-blue-300 border-blue-500/20',
    green: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/20',
    purple: 'bg-purple-500/12 text-purple-300 border-purple-500/20',
  };

  const homeWorks = getHomeFeaturedWorks().length;
  const homeTestimonials = getHomeFeaturedTestimonials().length;

  return (
    <div className="space-y-6">
      <section className="admin-surface rounded-[30px] p-6 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="admin-chip">Control center</span>
            <h1 className="mt-5 text-3xl font-bold text-white font-['Space_Grotesk'] sm:text-4xl">Dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Everything important is now easier to scan — roomy cards, clear actions, and fast shortcuts for the sections you update most often.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[440px]">
            {[
              { label: 'Selected works', value: homeWorks },
              { label: 'Selected testimonials', value: homeTestimonials },
              { label: 'Sections managed', value: 3 },
            ].map((item) => (
              <div key={item.label} className="admin-surface-soft rounded-[24px] px-5 py-4">
                <p className="text-2xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="group rounded-[28px] border border-white/8 bg-[#101010]/92 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.22)] transition-all duration-200 hover:-translate-y-1 hover:border-white/14 hover:bg-[#131313]"
            >
              <div className="mb-10 flex items-start justify-between gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon size={20} />
                </div>
                <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-gray-500 group-hover:text-gray-300">
                  View
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-4xl font-bold leading-none text-white">{stat.value}</p>
                <p className="text-sm font-medium text-gray-300">{stat.label}</p>
                <p className="text-sm leading-6 text-gray-500">Open the {stat.label.toLowerCase()} area to edit and organize content.</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="admin-surface rounded-[30px] p-6 sm:p-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
            <p className="mt-2 text-sm leading-7 text-gray-400">Jump straight into the sections that get updated most frequently.</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-gray-400">
            Home currently shows <span className="font-medium text-white">{homeWorks}</span> selected works and <span className="font-medium text-white">{homeTestimonials}</span> selected testimonials.
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Link
            to="/admin/team"
            className="group rounded-[24px] border border-white/8 bg-[#0d0d0d] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-orange-500/25"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/12 text-orange-300">
                <FiUsers size={24} />
              </div>
              <span className="rounded-full border border-orange-500/18 bg-orange-500/8 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-orange-300">Team</span>
            </div>
            <div className="mt-5">
              <p className="text-base font-medium text-white">Add Team Member</p>
              <p className="mt-2 text-sm leading-7 text-gray-500">Create or update the people who represent the brand publicly.</p>
            </div>
          </Link>

          <Link
            to="/admin/works"
            className="group rounded-[24px] border border-white/8 bg-[#0d0d0d] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-blue-500/25"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/12 text-blue-300">
                <FiBriefcase size={24} />
              </div>
              <span className="rounded-full border border-blue-500/18 bg-blue-500/8 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-blue-300">Works</span>
            </div>
            <div className="mt-5">
              <p className="text-base font-medium text-white">Add New Work</p>
              <p className="mt-2 text-sm leading-7 text-gray-500">Upload fresh case studies and decide what should appear on the home page.</p>
            </div>
          </Link>

          <Link
            to="/admin/testimonials"
            className="group rounded-[24px] border border-white/8 bg-[#0d0d0d] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-purple-500/25"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/12 text-purple-300">
                <FiMessageSquare size={24} />
              </div>
              <span className="rounded-full border border-purple-500/18 bg-purple-500/8 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-purple-300">Social proof</span>
            </div>
            <div className="mt-5">
              <p className="text-base font-medium text-white">Manage Testimonials</p>
              <p className="mt-2 text-sm leading-7 text-gray-500">Control the home highlights and the full testimonials experience from one place.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

