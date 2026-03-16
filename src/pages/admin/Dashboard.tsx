import { useEffect, useState } from 'react';
import { FiArrowRight, FiBriefcase, FiHome, FiMessageSquare, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  fetchTeamMembers,
  fetchWorkItems,
  fetchTestimonialItems,
  subscribeToContentUpdates,
} from '../../lib/content-store';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { label: 'Team Members', value: '0', icon: FiUsers, color: 'orange', link: '/admin/team' },
    { label: 'All Works', value: '0', icon: FiBriefcase, color: 'blue', link: '/admin/works' },
    { label: 'Home Works', value: '0', icon: FiHome, color: 'green', link: '/admin/works' },
    { label: 'Testimonials', value: '0', icon: FiMessageSquare, color: 'purple', link: '/admin/testimonials' },
  ]);
  const [homeWorks, setHomeWorks] = useState(0);
  const [homeTestimonials, setHomeTestimonials] = useState(0);

  useEffect(() => {
    const syncStats = async () => {
      try {
        const [teamData, worksData, testimonialsData] = await Promise.all([
          fetchTeamMembers(),
          fetchWorkItems(),
          fetchTestimonialItems(),
        ]);
        const homeFeaturedWorks = worksData.filter((w) => w.featuredOnHome).slice(0, 4);
        const homeFeaturedTestimonials = testimonialsData.filter((t) => t.featuredOnHome).slice(0, 4);
        setStats([
          { label: 'Team Members', value: String(teamData.length), icon: FiUsers, color: 'orange', link: '/admin/team' },
          { label: 'All Works', value: String(worksData.length), icon: FiBriefcase, color: 'blue', link: '/admin/works' },
          { label: 'Home Works', value: String(homeFeaturedWorks.length), icon: FiHome, color: 'green', link: '/admin/works' },
          { label: 'Testimonials', value: String(testimonialsData.length), icon: FiMessageSquare, color: 'purple', link: '/admin/testimonials' },
        ]);
        setHomeWorks(homeFeaturedWorks.length);
        setHomeTestimonials(homeFeaturedTestimonials.length);
      } catch { /* ignore */ }
    };

    syncStats();
    const unsubscribe = subscribeToContentUpdates(syncStats);
    return () => { unsubscribe(); };
  }, []);

  const colorClasses = {
    orange: {
      icon: 'border-orange-500/20 bg-orange-500/12 text-orange-200',
      pill: 'border-orange-500/20 bg-orange-500/10 text-orange-200',
    },
    blue: {
      icon: 'border-sky-500/20 bg-sky-500/12 text-sky-200',
      pill: 'border-sky-500/20 bg-sky-500/10 text-sky-200',
    },
    green: {
      icon: 'border-emerald-500/20 bg-emerald-500/12 text-emerald-200',
      pill: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
    },
    purple: {
      icon: 'border-violet-500/20 bg-violet-500/12 text-violet-200',
      pill: 'border-violet-500/20 bg-violet-500/10 text-violet-200',
    },
  };

  const quickActions = [
    {
      label: 'Open team workspace',
      description: 'Refresh bios, photos, and social links for everyone shown on the public team page.',
      link: '/admin/team',
      icon: FiUsers,
      color: 'orange' as const,
    },
    {
      label: 'Curate featured work',
      description: 'Promote the strongest portfolio pieces and control which projects land on the homepage.',
      link: '/admin/works',
      icon: FiBriefcase,
      color: 'blue' as const,
    },
    {
      label: 'Update social proof',
      description: 'Balance text and video testimonials while keeping the homepage showcase sharp and current.',
      link: '/admin/testimonials',
      icon: FiMessageSquare,
      color: 'purple' as const,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="admin-surface rounded-[34px] p-6 sm:p-8 xl:p-10">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
          <div className="max-w-3xl">
            <span className="admin-chip">Control center</span>
            <h1 className="mt-5 text-3xl font-bold text-white font-['Space_Grotesk'] sm:text-4xl xl:text-[46px]">A cleaner command view for every admin flow.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Everything important is easier to scan now — clearer hierarchy, richer cards, and fast access to the sections you update most often.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="admin-pill">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-300 shadow-[0_0_14px_rgba(253,186,116,0.8)]" />
                Publishing workflow
              </div>
              <div className="admin-pill">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.8)]" />
                Local sync active
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:min-w-[420px]">
            {[
              { label: 'Selected works', value: homeWorks },
              { label: 'Selected testimonials', value: homeTestimonials },
              { label: 'Sections managed', value: 3 },
            ].map((item) => (
              <div key={item.label} className="admin-form-block rounded-[26px] px-5 py-5">
                <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">Live count from the connected admin content store.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const tone = colorClasses[stat.color as keyof typeof colorClasses];

            return (
              <Link
                key={stat.label}
                to={stat.link}
                className="admin-grid-card group flex h-full flex-col rounded-[30px] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${tone.icon}`}>
                    <Icon size={20} />
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${tone.pill}`}>
                    Live
                  </span>
                </div>

                <div className="mt-10 space-y-3">
                  <p className="text-4xl font-bold leading-none text-white">{stat.value}</p>
                  <p className="text-base font-medium text-white">{stat.label}</p>
                  <p className="text-sm leading-7 text-gray-500">Open the {stat.label.toLowerCase()} area to edit, curate, and keep the public-facing experience up to date.</p>
                </div>

                <div className="mt-auto pt-8">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 transition-colors group-hover:text-white">
                    Open section
                    <FiArrowRight size={16} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="admin-surface rounded-[32px] p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white font-['Space_Grotesk']">Quick actions</h2>
              <p className="mt-2 text-sm leading-7 text-gray-400">Jump straight into the areas that move the homepage and brand presentation fastest.</p>
            </div>
            <div className="admin-pill">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-300 shadow-[0_0_14px_rgba(253,186,116,0.7)]" />
              {homeWorks} works · {homeTestimonials} testimonials on home
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const tone = colorClasses[action.color];

              return (
                <Link
                  key={action.label}
                  to={action.link}
                  className="admin-form-block group flex items-start justify-between gap-4 rounded-[26px] p-5 transition-all duration-200 hover:border-white/12"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className={`mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${tone.icon}`}>
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-medium text-white">{action.label}</p>
                      <p className="mt-2 text-sm leading-7 text-gray-500">{action.description}</p>
                    </div>
                  </div>

                  <span className="mt-1 rounded-full border border-white/8 bg-white/[0.03] p-2 text-gray-400 transition-colors group-hover:text-white">
                    <FiArrowRight size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

