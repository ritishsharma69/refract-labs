import { useEffect, useState } from 'react';
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiMessageSquare,
  FiMoreHorizontal,
  FiPlus,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  fetchTeamMembers,
  fetchWorkItems,
  fetchTestimonialItems,
  subscribeToContentUpdates,
} from '../../lib/content-store';

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

  const totalManagedEntries = counts.team + counts.works + counts.testimonials;
  const totalHomepagePicks = counts.featuredWorks + counts.featuredTestimonials;
  const showcaseCoverage = Math.min(
    100,
    Math.round((totalHomepagePicks / Math.max(1, counts.works + counts.testimonials)) * 100),
  );

  // Donut chart data
  const donutData = [
    { label: 'Team', value: counts.team, color: '#C8E972' },
    { label: 'Works', value: counts.works, color: '#8B7BE8' },
    { label: 'Featured', value: totalHomepagePicks, color: '#3B82F6' },
    { label: 'Testimonials', value: counts.testimonials, color: '#F59E0B' },
  ];

  const donutTotal = donutData.reduce((s, d) => s + d.value, 0) || 1;
  let cumulativePercent = 0;
  const donutSegments = donutData.map((d) => {
    const percent = (d.value / donutTotal) * 100;
    const offset = cumulativePercent;
    cumulativePercent += percent;
    return { ...d, percent, offset };
  });

  // Bar chart data for content over time
  const barData = [
    { label: 'Team', value: counts.team },
    { label: 'Works', value: counts.works },
    { label: 'Feat.W', value: counts.featuredWorks },
    { label: 'Testi.', value: counts.testimonials },
    { label: 'Feat.T', value: counts.featuredTestimonials },
    { label: 'Total', value: totalManagedEntries },
  ];
  const maxBarValue = Math.max(1, ...barData.map((b) => b.value));

  const priorityQueue = [
    {
      label: 'Homepage work rotation',
      state: counts.featuredWorks >= 4 ? 'Healthy' : 'Needs focus',
      progress: Math.min(100, (counts.featuredWorks / 4) * 100),
      helper: `${counts.featuredWorks}/4 featured works selected`,
      link: '/admin/works',
    },
    {
      label: 'Trust section coverage',
      state: counts.featuredTestimonials >= 3 ? 'Healthy' : 'Needs focus',
      progress: Math.min(100, (counts.featuredTestimonials / 4) * 100),
      helper: `${counts.featuredTestimonials}/4 testimonials spotlighted`,
      link: '/admin/testimonials',
    },
    {
      label: 'Team presence',
      state: counts.team >= 4 ? 'Healthy' : 'Building',
      progress: Math.min(100, (counts.team / 4) * 100),
      helper: `${counts.team} team profiles visible`,
      link: '/admin/team',
    },
  ];

  const recentActivity = [
    { text: 'Content synced across all 3 collections', time: 'Just now', color: '#22C55E' },
    { text: `${counts.featuredWorks} works featured on homepage`, time: 'Auto', color: '#3B82F6' },
    { text: `${counts.featuredTestimonials} testimonials spotlighted`, time: 'Auto', color: '#8B7BE8' },
    { text: `${counts.team} team profiles active`, time: 'Auto', color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      {/* ── ROW 1: Stat Cards + Resource Card ── */}
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Team Profiles */}
          <div className="admin-card rounded-2xl border-2 border-[var(--admin-lime)] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[var(--admin-text-secondary)]">Team Profiles</p>
              <FiMoreHorizontal size={16} className="text-[var(--admin-text-muted)]" />
            </div>
            <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--admin-text)' }}>{counts.team}</p>
            <div className="mt-2 flex items-center gap-1">
              <FiTrendingUp size={14} className="text-green-500" />
              <span className="text-xs font-medium text-green-600">Active</span>
            </div>
          </div>

          {/* Portfolio Items */}
          <div className="admin-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[var(--admin-text-secondary)]">Portfolio Items</p>
              <FiMoreHorizontal size={16} className="text-[var(--admin-text-muted)]" />
            </div>
            <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--admin-text)' }}>{counts.works}</p>
            <div className="mt-2 flex items-center gap-1">
              <FiTrendingUp size={14} className="text-green-500" />
              <span className="text-xs font-medium text-green-600">Live</span>
            </div>
          </div>

          {/* Homepage Picks */}
          <div className="admin-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[var(--admin-text-secondary)]">Homepage Picks</p>
              <FiMoreHorizontal size={16} className="text-[var(--admin-text-muted)]" />
            </div>
            <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--admin-text)' }}>{totalHomepagePicks}</p>
            <div className="mt-2 flex items-center gap-1">
              <FiStar size={14} className="text-amber-500" />
              <span className="text-xs font-medium text-amber-600">{showcaseCoverage}% coverage</span>
            </div>
          </div>

          {/* Testimonials */}
          <div className="admin-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[var(--admin-text-secondary)]">Testimonials</p>
              <FiMoreHorizontal size={16} className="text-[var(--admin-text-muted)]" />
            </div>
            <p className="mt-2 text-3xl font-bold" style={{ color: 'var(--admin-text)' }}>{counts.testimonials}</p>
            <div className="mt-2 flex items-center gap-1">
              <FiMessageSquare size={14} className="text-purple-500" />
              <span className="text-xs font-medium text-purple-600">{counts.featuredTestimonials} featured</span>
            </div>
          </div>
        </div>

        {/* Resource Card (Dark) */}
        <div className="admin-card-dark flex flex-col justify-between rounded-2xl p-6">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white/80">Content Resources</p>
              <FiMoreHorizontal size={16} className="text-white/40" />
            </div>
            <div className="mt-4 flex flex-col items-center">
              <p className="text-5xl font-bold text-white">{totalManagedEntries}</p>
              <p className="mt-1 text-sm text-white/50">Total Entries</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/10 px-3 py-2 text-center">
              <p className="text-lg font-bold text-white">{counts.featuredWorks}</p>
              <p className="text-[11px] text-white/50">Featured Works</p>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2 text-center">
              <p className="text-lg font-bold text-white">{counts.featuredTestimonials}</p>
              <p className="text-[11px] text-white/50">Featured Proofs</p>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2 text-center">
              <p className="text-lg font-bold text-white">3</p>
              <p className="text-[11px] text-white/50">Collections</p>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-2 text-center">
              <p className="text-lg font-bold text-white">{totalHomepagePicks}</p>
              <p className="text-[11px] text-white/50">Homepage Items</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Bar Chart + Donut Chart ── */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="admin-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold" style={{ color: 'var(--admin-text)' }}>Content Overview</p>
              <p className="text-xs text-[var(--admin-text-muted)]">Distribution across sections</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-[var(--admin-text-muted)]">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: '#C8E972' }} /> Active
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[var(--admin-text-muted)]">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: '#E8E4DF' }} /> Featured
              </span>
            </div>
          </div>
          <div className="mt-6 flex items-end gap-3" style={{ height: 180 }}>
            {barData.map((bar, i) => {
              const h = Math.max(8, (bar.value / Math.max(1, maxBarValue)) * 160);
              const isEven = i % 2 === 0;
              return (
                <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-semibold" style={{ color: 'var(--admin-text)' }}>{bar.value}</span>
                  <div
                    className="w-full rounded-t-lg transition-all duration-500"
                    style={{
                      height: h,
                      background: isEven ? '#C8E972' : '#E8E4DF',
                      minWidth: 20,
                    }}
                  />
                  <span className="text-[10px] text-[var(--admin-text-muted)]">{bar.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="admin-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold" style={{ color: 'var(--admin-text)' }}>Content by Category</p>
              <p className="text-xs text-[var(--admin-text-muted)]">Breakdown of all managed content</p>
            </div>
            <div className="admin-pill">Today</div>
          </div>
          <div className="mt-6 flex items-center gap-8">
            {/* SVG Donut */}
            <div className="relative" style={{ width: 160, height: 160 }}>
              <svg viewBox="0 0 36 36" className="h-full w-full" style={{ transform: 'rotate(-90deg)' }}>
                {donutSegments.map((seg) => (
                  <circle
                    key={seg.label}
                    cx="18" cy="18" r="14"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="4"
                    strokeDasharray={`${seg.percent} ${100 - seg.percent}`}
                    strokeDashoffset={`${-seg.offset}`}
                    strokeLinecap="round"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold" style={{ color: 'var(--admin-text)' }}>{donutTotal}</p>
                <p className="text-[10px] text-[var(--admin-text-muted)]">Total</p>
              </div>
            </div>
            {/* Legend */}
            <div className="flex flex-col gap-3">
              {donutData.map((d) => (
                <div key={d.label} className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full" style={{ background: d.color }} />
                  <span className="text-sm text-[var(--admin-text-secondary)]">{d.label}</span>
                  <span className="ml-auto text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Quick Actions + Tasks + Schedule ── */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Quick Actions (Vacancies style) */}
        <div className="admin-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold" style={{ color: 'var(--admin-text)' }}>Quick Actions</p>
            <Link to="/admin/works" className="text-xs font-medium text-[var(--admin-purple)]">See All</Link>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { label: 'Manage Team', desc: 'Edit bios & profiles', tags: ['Team', `${counts.team} Members`], link: '/admin/team', icon: FiUsers },
              { label: 'Curate Portfolio', desc: 'Update works & features', tags: ['Works', `${counts.works} Items`], link: '/admin/works', icon: FiBriefcase },
              { label: 'Social Proof', desc: 'Manage testimonials', tags: ['Proof', `${counts.testimonials} Stories`], link: '/admin/testimonials', icon: FiMessageSquare },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.link}
                  className="group flex items-start gap-3 rounded-xl border border-[var(--admin-border)] p-4 transition-all hover:border-[var(--admin-border-hover)] hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--admin-bg)]">
                    <Icon size={18} className="text-[var(--admin-text-secondary)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>{action.label}</p>
                      <FiMoreHorizontal size={14} className="text-[var(--admin-text-muted)]" />
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--admin-text-muted)]">{action.desc}</p>
                    <div className="mt-2 flex gap-2">
                      {action.tags.map((tag) => (
                        <span key={tag} className="rounded-md bg-[var(--admin-bg)] px-2 py-0.5 text-[11px] font-medium text-[var(--admin-text-secondary)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tasks */}
        <div className="admin-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold" style={{ color: 'var(--admin-text)' }}>Tasks</p>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--admin-bg)] text-[var(--admin-text-secondary)]">
              <FiPlus size={14} />
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {priorityQueue.map((task) => {
              const badgeClass = task.state === 'Healthy'
                ? 'admin-badge admin-badge--healthy'
                : task.state === 'Building'
                  ? 'admin-badge admin-badge--building'
                  : 'admin-badge admin-badge--warning';

              return (
                <Link
                  key={task.label}
                  to={task.link}
                  className="group flex items-start gap-3 rounded-xl border border-[var(--admin-border)] p-4 transition-all hover:border-[var(--admin-border-hover)] hover:shadow-sm"
                >
                  <div className="mt-0.5">
                    <FiCheckCircle
                      size={18}
                      className={task.state === 'Healthy' ? 'text-green-500' : 'text-[var(--admin-text-muted)]'}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>{task.label}</p>
                    <p className="mt-0.5 text-xs text-[var(--admin-text-muted)]">{task.helper}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={badgeClass}>{task.state}</span>
                      <div className="admin-progress-track h-1.5 flex-1 rounded-full">
                        <div
                          className="admin-progress-fill h-full rounded-full"
                          style={{
                            width: `${task.progress}%`,
                            background: task.state === 'Healthy' ? '#22C55E' : task.state === 'Building' ? '#8B7BE8' : '#F59E0B',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Schedule / Timeline */}
        <div className="admin-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold" style={{ color: 'var(--admin-text)' }}>Schedule</p>
            <div className="admin-pill">
              <FiClock size={12} />
              Today
            </div>
          </div>
          <div className="mt-4 space-y-0">
            {[
              { time: 'Now', label: 'Content Sync Active', tag: 'System', color: '#C8E972' },
              { time: 'Auto', label: 'Homepage Updates', tag: 'Publishing', color: '#8B7BE8' },
              { time: 'Daily', label: 'Portfolio Review', tag: 'Works', color: '#3B82F6' },
              { time: 'Weekly', label: 'Testimonial Curation', tag: 'Proof', color: '#F59E0B' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 py-3" style={{ borderBottom: i < 3 ? '1px solid var(--admin-border)' : 'none' }}>
                <div className="w-12 shrink-0 text-xs font-medium text-[var(--admin-text-muted)]">{item.time}</div>
                <div
                  className="rounded-lg px-3 py-2 flex-1"
                  style={{ background: item.color + '22', borderLeft: `3px solid ${item.color}` }}
                >
                  <p className="text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>{item.label}</p>
                  <p className="text-[11px] text-[var(--admin-text-muted)]">{item.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 4: Content Table + Recent Activity ── */}
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Content Table */}
        <div className="admin-card overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-6 py-4">
            <div className="flex items-center gap-3">
              <p className="text-base font-semibold" style={{ color: 'var(--admin-text)' }}>Content Overview</p>
              <span className="rounded-full bg-[var(--admin-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--admin-text-secondary)]">{totalManagedEntries}</span>
            </div>
            <div className="flex items-center gap-2">
              {['All', 'Team', 'Works', 'Testimonials'].map((tab, i) => (
                <button
                  key={tab}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${i === 0
                    ? 'bg-[var(--admin-lime)] text-[var(--admin-lime-dark)]'
                    : 'text-[var(--admin-text-secondary)] hover:bg-[var(--admin-bg)]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Type</th>
                <th>Items</th>
                <th>Featured</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--admin-bg)]">
                      <FiUsers size={14} className="text-[var(--admin-text-secondary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>Team</p>
                      <p className="text-xs text-[var(--admin-text-muted)]">People & profiles</p>
                    </div>
                  </div>
                </td>
                <td className="text-sm text-[var(--admin-text-secondary)]">Profiles</td>
                <td className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>{counts.team}</td>
                <td className="text-sm text-[var(--admin-text-secondary)]">—</td>
                <td><span className="admin-badge admin-badge--healthy">Active</span></td>
              </tr>
              <tr>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--admin-bg)]">
                      <FiBriefcase size={14} className="text-[var(--admin-text-secondary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>Works</p>
                      <p className="text-xs text-[var(--admin-text-muted)]">Portfolio library</p>
                    </div>
                  </div>
                </td>
                <td className="text-sm text-[var(--admin-text-secondary)]">Projects</td>
                <td className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>{counts.works}</td>
                <td className="text-sm text-[var(--admin-text-secondary)]">{counts.featuredWorks} featured</td>
                <td><span className="admin-badge admin-badge--healthy">Active</span></td>
              </tr>
              <tr>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--admin-bg)]">
                      <FiMessageSquare size={14} className="text-[var(--admin-text-secondary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>Testimonials</p>
                      <p className="text-xs text-[var(--admin-text-muted)]">Social proof</p>
                    </div>
                  </div>
                </td>
                <td className="text-sm text-[var(--admin-text-secondary)]">Reviews</td>
                <td className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>{counts.testimonials}</td>
                <td className="text-sm text-[var(--admin-text-secondary)]">{counts.featuredTestimonials} featured</td>
                <td><span className="admin-badge admin-badge--healthy">Active</span></td>
              </tr>
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-[var(--admin-border)] px-6 py-3">
            <p className="text-xs text-[var(--admin-text-muted)]">3 collections managed</p>
            <div className="flex gap-2">
              <Link to="/admin/team" className="text-xs font-medium text-[var(--admin-purple)] hover:underline">View All →</Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-card rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold" style={{ color: 'var(--admin-text)' }}>Recent Activity</p>
            <FiMoreHorizontal size={16} className="text-[var(--admin-text-muted)]" />
          </div>
          <div className="mt-1">
            <p className="text-xs font-semibold text-[var(--admin-text-secondary)]">Today</p>
          </div>
          <div className="mt-3 space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="admin-activity-dot mt-1.5" style={{ background: item.color }} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug" style={{ color: 'var(--admin-text)' }}>{item.text}</p>
                  <p className="mt-0.5 text-xs text-[var(--admin-text-muted)]">{item.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Coverage Summary */}
          <div className="mt-6 rounded-xl bg-[var(--admin-bg)] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>Showcase Coverage</p>
              <span className="text-sm font-bold" style={{ color: 'var(--admin-purple)' }}>{showcaseCoverage}%</span>
            </div>
            <div className="admin-progress-track mt-3">
              <div
                className="admin-progress-fill h-full"
                style={{ width: `${showcaseCoverage}%`, background: 'var(--admin-purple)' }}
              />
            </div>
            <p className="mt-2 text-[11px] text-[var(--admin-text-muted)]">
              Percentage of works + testimonials currently featured on homepage
            </p>
          </div>

          {/* Quick links */}
          <div className="mt-4 space-y-2">
            <Link
              to="/admin/works"
              className="flex items-center justify-between rounded-xl bg-[var(--admin-lime)] px-4 py-3 text-sm font-semibold text-[var(--admin-lime-dark)] transition-all hover:shadow-md"
            >
              Open Portfolio
              <FiArrowRight size={16} />
            </Link>
            <Link
              to="/admin/testimonials"
              className="flex items-center justify-between rounded-xl border border-[var(--admin-border)] px-4 py-3 text-sm font-medium transition-all hover:bg-[var(--admin-bg)]"
              style={{ color: 'var(--admin-text)' }}
            >
              Review Testimonials
              <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

