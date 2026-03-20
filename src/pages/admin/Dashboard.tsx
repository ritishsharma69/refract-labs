import { useEffect, useState } from 'react';
import {
  FiActivity,
  FiArrowRight,
  FiBriefcase,
  FiHome,
  FiLayers,
  FiMessageSquare,
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  fetchTeamMembers,
  fetchWorkItems,
  fetchTestimonialItems,
  subscribeToContentUpdates,
} from '../../lib/content-store';

type ToneKey = 'cyan' | 'blue' | 'violet' | 'teal';

type DashboardCounts = {
  team: number;
  works: number;
  featuredWorks: number;
  testimonials: number;
  featuredTestimonials: number;
};

const Dashboard = () => {
  const [counts, setCounts] = useState<DashboardCounts>({
    team: 0,
    works: 0,
    featuredWorks: 0,
    testimonials: 0,
    featuredTestimonials: 0,
  });

  useEffect(() => {
    const syncStats = async () => {
      try {
        const [teamData, worksData, testimonialsData] = await Promise.all([
          fetchTeamMembers(),
          fetchWorkItems(),
          fetchTestimonialItems(),
        ]);

        setCounts({
          team: teamData.length,
          works: worksData.length,
          featuredWorks: worksData.filter((work) => work.featuredOnHome).slice(0, 4).length,
          testimonials: testimonialsData.length,
          featuredTestimonials: testimonialsData.filter((testimonial) => testimonial.featuredOnHome).slice(0, 4).length,
        });
      } catch {
        // ignore fetch failures and keep the UI resilient
      }
    };

    syncStats();
    const unsubscribe = subscribeToContentUpdates(syncStats);
    return () => {
      unsubscribe();
    };
  }, []);

  const colorClasses: Record<ToneKey, {
    icon: string;
    pill: string;
    bar: string;
    progress: string;
    glow: string;
  }> = {
    cyan: {
      icon: 'border-cyan-400/20 bg-cyan-400/12 text-cyan-100',
      pill: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100',
      bar: 'from-cyan-300 via-sky-400 to-blue-500',
      progress: 'from-cyan-300 to-sky-500',
      glow: 'shadow-[0_0_24px_rgba(34,211,238,0.32)]',
    },
    blue: {
      icon: 'border-sky-500/20 bg-sky-500/12 text-sky-200',
      pill: 'border-sky-500/20 bg-sky-500/10 text-sky-200',
      bar: 'from-sky-300 via-blue-400 to-indigo-500',
      progress: 'from-sky-300 to-indigo-500',
      glow: 'shadow-[0_0_24px_rgba(56,189,248,0.3)]',
    },
    violet: {
      icon: 'border-violet-500/20 bg-violet-500/12 text-violet-200',
      pill: 'border-violet-500/20 bg-violet-500/10 text-violet-200',
      bar: 'from-violet-300 via-fuchsia-400 to-indigo-500',
      progress: 'from-violet-300 to-fuchsia-500',
      glow: 'shadow-[0_0_24px_rgba(167,139,250,0.3)]',
    },
    teal: {
      icon: 'border-teal-400/20 bg-teal-400/12 text-teal-100',
      pill: 'border-teal-400/20 bg-teal-400/10 text-teal-100',
      bar: 'from-teal-300 via-cyan-400 to-sky-500',
      progress: 'from-teal-300 to-cyan-500',
      glow: 'shadow-[0_0_24px_rgba(45,212,191,0.3)]',
    },
  };

  const totalManagedEntries = counts.team + counts.works + counts.testimonials;
  const totalHomepagePicks = counts.featuredWorks + counts.featuredTestimonials;
  const showcaseCoverage = Math.min(
    100,
    Math.round((totalHomepagePicks / Math.max(1, counts.works + counts.testimonials)) * 100),
  );

  const stats = [
    {
      label: 'Team profiles',
      value: counts.team,
      icon: FiUsers,
      color: 'cyan' as ToneKey,
      link: '/admin/team',
      detail: 'Public-facing member cards ready for editing.',
    },
    {
      label: 'Portfolio items',
      value: counts.works,
      icon: FiBriefcase,
      color: 'blue' as ToneKey,
      link: '/admin/works',
      detail: 'Projects available in the work library.',
    },
    {
      label: 'Homepage spotlight',
      value: totalHomepagePicks,
      icon: FiHome,
      color: 'violet' as ToneKey,
      link: '/admin/works',
      detail: `${showcaseCoverage}% of works + testimonials are featured.`,
    },
    {
      label: 'Testimonials',
      value: counts.testimonials,
      icon: FiMessageSquare,
      color: 'teal' as ToneKey,
      link: '/admin/testimonials',
      detail: `${counts.featuredTestimonials} featured trust stories live on home.`,
    },
  ];

  const spotlightMetrics = [
    { label: 'Collections online', value: '3 / 3', icon: FiLayers, note: 'Team, works, and testimonials are connected.' },
    { label: 'Managed entries', value: String(totalManagedEntries), icon: FiActivity, note: 'Total assets currently controlled from admin.' },
    { label: 'Homepage picks', value: String(totalHomepagePicks), icon: FiStar, note: 'Featured content appearing in public sections.' },
  ];

  const performanceSeries = [
    { label: 'Team', short: 'TM', value: counts.team, tone: 'cyan' as ToneKey },
    { label: 'Works', short: 'WK', value: counts.works, tone: 'blue' as ToneKey },
    { label: 'Featured', short: 'FT', value: totalHomepagePicks, tone: 'violet' as ToneKey },
    { label: 'Proof', short: 'TS', value: counts.testimonials, tone: 'teal' as ToneKey },
  ];
  const maxSeriesValue = Math.max(4, ...performanceSeries.map((item) => item.value));

  const quickActions = [
    {
      label: 'Team workspace',
      description: 'Refresh bios, portraits, and profile links from one clean editing surface.',
      link: '/admin/team',
      icon: FiUsers,
      color: 'cyan' as ToneKey,
    },
    {
      label: 'Curate featured work',
      description: 'Promote stronger projects and control what lands on the homepage first.',
      link: '/admin/works',
      icon: FiBriefcase,
      color: 'blue' as ToneKey,
    },
    {
      label: 'Update social proof',
      description: 'Balance text and video testimonials for a sharper trust layer.',
      link: '/admin/testimonials',
      icon: FiMessageSquare,
      color: 'violet' as ToneKey,
    },
  ];

  const contentLanes = [
    {
      label: 'Team visibility',
      value: counts.team,
      tone: 'cyan' as ToneKey,
      progress: totalManagedEntries ? Math.round((counts.team / totalManagedEntries) * 100) : 0,
      note: 'Share of public people content in the system.',
    },
    {
      label: 'Portfolio depth',
      value: counts.works,
      tone: 'blue' as ToneKey,
      progress: totalManagedEntries ? Math.round((counts.works / totalManagedEntries) * 100) : 0,
      note: 'Projects available to drive homepage credibility.',
    },
    {
      label: 'Trust layer',
      value: counts.testimonials,
      tone: 'teal' as ToneKey,
      progress: totalManagedEntries ? Math.round((counts.testimonials / totalManagedEntries) * 100) : 0,
      note: 'Testimonials supporting the conversion narrative.',
    },
  ];

  const priorityQueue = [
    {
      label: 'Homepage work rotation',
      state: counts.featuredWorks >= 4 ? 'Healthy' : 'Needs focus',
      helper: `${counts.featuredWorks}/4 featured works selected for home.`,
      link: '/admin/works',
    },
    {
      label: 'Trust section coverage',
      state: counts.featuredTestimonials >= 3 ? 'Healthy' : 'Needs focus',
      helper: `${counts.featuredTestimonials}/4 testimonials spotlighted.`,
      link: '/admin/testimonials',
    },
    {
      label: 'Team presence',
      state: counts.team >= 4 ? 'Healthy' : 'Building',
      helper: `${counts.team} team profiles currently visible in admin.`,
      link: '/admin/team',
    },
  ];

  return (
    <div className="space-y-7 xl:space-y-8">
      <section className="grid gap-7 2xl:grid-cols-[minmax(0,1.12fr)_400px]">
        <div className="admin-hero-panel rounded-[34px] p-6 sm:p-8 2xl:p-10">
          <div className="relative z-[1] max-w-3xl">
            <span className="admin-chip">Executive overview</span>
            <h1 className="mt-5 max-w-[12ch] text-3xl font-bold leading-[1.02] text-white font-['Space_Grotesk'] sm:text-4xl xl:text-[46px] 2xl:text-[52px]">
              Run the entire content engine from one premium pulse dashboard.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Same admin data, restructured into a cleaner analytics-style layout with stronger hierarchy, glowing cards, and faster scanning.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {[
                { label: 'Collections', value: 3, note: 'Live content groups' },
                { label: 'Managed assets', value: totalManagedEntries, note: 'Entries across all sections' },
                { label: 'Homepage picks', value: totalHomepagePicks, note: 'Featured on public pages' },
              ].map((item) => (
                <div key={item.label} className="admin-metric-strip rounded-[24px] p-4 sm:p-5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-xs leading-6 text-slate-400">{item.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3 pt-1">
              <Link to="/admin/works" className="admin-primary-btn inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium text-white">
                Open portfolio control
              </Link>
              <Link to="/admin/testimonials" className="admin-secondary-btn inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium text-white">
                Review trust layer
              </Link>
            </div>
          </div>
        </div>

        <div className="admin-surface rounded-[34px] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Live operator board</p>
              <h2 className="mt-3 text-2xl font-semibold text-white font-['Space_Grotesk']">Control signal</h2>
            </div>
            <div className="admin-pill">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.8)]" />
              API synced
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {spotlightMetrics.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="admin-spotlight-card rounded-[26px] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-100">
                        <Icon size={19} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="mt-2 text-xs leading-6 text-slate-400">{item.note}</p>
                      </div>
                    </div>
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                </div>
              );
            })}

            <div className="admin-form-block rounded-[26px] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Showcase coverage</p>
                  <p className="mt-2 text-lg font-semibold text-white">{showcaseCoverage}% ready</p>
                </div>
                <FiTrendingUp className="text-sky-200" size={20} />
              </div>
              <div className="admin-progress-track mt-4 h-2.5 rounded-full">
                <div className="admin-progress-fill h-full rounded-full bg-gradient-to-r from-sky-300 via-cyan-300 to-indigo-500" style={{ width: `${showcaseCoverage}%` }} />
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-400">Percentage of works + testimonials currently featured for homepage storytelling.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const tone = colorClasses[stat.color];

          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="admin-kpi-card group flex h-full min-h-[230px] flex-col rounded-[30px] p-6 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${tone.icon}`}>
                  <Icon size={20} />
                </div>
                <span className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${tone.pill}`}>
                  Live
                </span>
              </div>

              <div className="mt-9 space-y-3">
                <p className="text-4xl font-bold leading-none text-white">{stat.value}</p>
                <p className="text-base font-medium text-white">{stat.label}</p>
                <p className="text-sm leading-7 text-slate-400">{stat.detail}</p>
              </div>

              <div className="mt-auto pt-8">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors group-hover:text-white">
                  Open section
                  <FiArrowRight size={16} />
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-7 2xl:grid-cols-[minmax(0,1.08fr)_400px]">
        <div className="admin-surface rounded-[34px] p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Content pulse</p>
              <h2 className="mt-2 text-2xl font-semibold text-white font-['Space_Grotesk']">Collection intensity</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">A quick visual read on how much content each part of the admin currently controls.</p>
            </div>
            <div className="admin-pill">
              <FiZap size={14} />
              {totalManagedEntries} managed items
            </div>
          </div>

          <div className="admin-chart-grid mt-8">
            {performanceSeries.map((item) => {
              const tone = colorClasses[item.tone];
              const height = 20 + (item.value / maxSeriesValue) * 80;

              return (
                <div key={item.label} className="admin-chart-column">
                  <div className="admin-chart-bar">
                    <div className={`admin-chart-bar__fill bg-gradient-to-t ${tone.bar} ${tone.glow}`} style={{ height: `${height}%` }} />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{item.short}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] ${tone.pill}`}>{item.value}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { label: 'Featured works', value: counts.featuredWorks },
              { label: 'Featured testimonials', value: counts.featuredTestimonials },
              { label: 'Collections managed', value: 3 },
            ].map((item) => (
              <div key={item.label} className="admin-metric-strip rounded-[24px] p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="admin-surface rounded-[34px] p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Quick launch</p>
                <h2 className="mt-2 text-2xl font-semibold text-white font-['Space_Grotesk']">Fast actions</h2>
              </div>
              <div className="admin-pill">
                <FiTrendingUp size={14} />
                Live editing
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
                    className="admin-action-tile group flex items-start justify-between gap-4 rounded-[26px] p-5"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className={`mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${tone.icon}`}>
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-medium text-white">{action.label}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-400">{action.description}</p>
                      </div>
                    </div>

                    <span className="mt-1 rounded-full border border-white/8 bg-white/[0.03] p-2 text-slate-400 transition-colors group-hover:text-white">
                      <FiArrowRight size={16} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="admin-surface-soft rounded-[34px] p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Distribution lanes</p>
            <h2 className="mt-2 text-2xl font-semibold text-white font-['Space_Grotesk']">Content balance</h2>

            <div className="mt-6 space-y-5">
              {contentLanes.map((item) => {
                const tone = colorClasses[item.tone];

                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="mt-1 text-xs leading-6 text-slate-400">{item.note}</p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-[11px] ${tone.pill}`}>{item.value}</span>
                    </div>
                    <div className="admin-progress-track mt-3 h-2.5 rounded-full">
                      <div className={`admin-progress-fill h-full rounded-full bg-gradient-to-r ${tone.progress}`} style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-7 2xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="admin-surface rounded-[34px] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Priority queue</p>
              <h2 className="mt-2 text-2xl font-semibold text-white font-['Space_Grotesk']">What to tune next</h2>
            </div>
            <FiStar className="text-sky-200" size={18} />
          </div>

          <div className="mt-6 space-y-4">
            {priorityQueue.map((item) => (
              <Link key={item.label} to={item.link} className="admin-action-tile group flex items-start justify-between gap-4 rounded-[24px] p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-base font-medium text-white">{item.label}</p>
                    <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-sky-100">
                      {item.state}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{item.helper}</p>
                </div>
                <span className="mt-1 rounded-full border border-white/8 bg-white/[0.03] p-2 text-slate-400 transition-colors group-hover:text-white">
                  <FiArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-surface rounded-[34px] p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">System matrix</p>
              <h2 className="mt-2 text-2xl font-semibold text-white font-['Space_Grotesk']">Operating layers</h2>
            </div>
            <div className="admin-pill">
              <FiActivity size={14} />
              Reference-style layout
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const tone = colorClasses[stat.color];

              return (
                <div key={`${stat.label}-matrix`} className="admin-spotlight-card rounded-[26px] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${tone.icon}`}>
                      <Icon size={18} />
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-[11px] ${tone.pill}`}>{stat.value}</span>
                  </div>
                  <p className="mt-5 text-base font-medium text-white">{stat.label}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{stat.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

