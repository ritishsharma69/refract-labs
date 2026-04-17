import { useEffect, useState } from 'react';
import {
  Users,
  Briefcase,
  MessageSquare,
  Star,
  TrendingUp,
  Activity,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  fetchTeamMembers,
  fetchWorkItems,
  fetchTestimonialItems,
  subscribeToContentUpdates,
} from '../../lib/content-store';
import AdminLoader from '../../components/admin/AdminLoader';

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
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
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
    { icon: Activity, text: 'Content synced across all 3 collections', time: 'Just now', color: 'green' as const },
    { icon: Briefcase, text: `${counts.featuredWorks} works featured on homepage`, time: 'Auto', color: 'blue' as const },
    { icon: MessageSquare, text: `${counts.featuredTestimonials} testimonials spotlighted`, time: 'Auto', color: 'purple' as const },
    { icon: Users, text: `${counts.team} team profiles active`, time: 'Auto', color: 'orange' as const },
  ];

  const colorMap = {
    green: { bg: 'bg-green-50', text: 'text-green-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
  };

  const statCards = [
    { label: 'Team Profiles', value: counts.team, sub: 'Active members', icon: Users, color: 'blue' as const },
    { label: 'Portfolio Items', value: counts.works, sub: 'Live projects', icon: Briefcase, color: 'green' as const },
    { label: 'Homepage Picks', value: totalHomepagePicks, sub: `${showcaseCoverage}% coverage`, icon: Star, color: 'purple' as const },
    { label: 'Testimonials', value: counts.testimonials, sub: `${counts.featuredTestimonials} featured`, icon: MessageSquare, color: 'orange' as const },
  ];

  if (isLoading) {
    return <AdminLoader variant="spinner" label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const colors = colorMap[card.color];
          return (
            <div key={card.label} className="rounded-2xl border border-[var(--admin-border)] bg-white p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-5">
                <div className={`p-2.5 rounded-xl ${colors.bg}`}>
                  <card.icon className={`h-5 w-5 ${colors.text}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--admin-text-secondary)' }}>{card.label}</p>
              <p className="text-3xl font-bold tracking-tight" style={{ color: 'var(--admin-text)' }}>{card.value}</p>
              <p className="text-sm text-green-600 mt-2">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--admin-text)' }}>Recent Activity</h3>
              <Link to="/admin/works" className="text-sm font-medium hover:underline" style={{ color: 'var(--admin-purple)' }}>
                View all
              </Link>
            </div>
            <div className="divide-y divide-[var(--admin-border)]">
              {recentActivity.map((activity, i) => {
                const colors = colorMap[activity.color];
                return (
                  <div key={i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className={`p-2.5 rounded-xl ${colors.bg} shrink-0`}>
                      <activity.icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>
                        {activity.text}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>
                        Synced automatically
                      </p>
                    </div>
                    <div className="text-xs shrink-0" style={{ color: 'var(--admin-text-muted)' }}>
                      {activity.time}
                    </div>
                  </div>
                );
              })}

              {/* Quick Action Links */}
              {[
                { label: 'Manage Team', desc: `${counts.team} members`, link: '/admin/team', color: 'blue' as const, icon: Users },
                { label: 'Curate Portfolio', desc: `${counts.works} projects`, link: '/admin/works', color: 'green' as const, icon: Briefcase },
              ].map((action) => {
                const colors = colorMap[action.color];
                return (
                  <Link key={action.label} to={action.link} className="flex items-center gap-4 py-4 last:pb-0 hover:opacity-80 transition-opacity">
                    <div className={`p-2.5 rounded-xl ${colors.bg} shrink-0`}>
                      <action.icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>{action.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>{action.desc}</p>
                    </div>
                    <ArrowRight size={16} style={{ color: 'var(--admin-text-muted)' }} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-7">
            <h3 className="text-lg font-semibold mb-5" style={{ color: 'var(--admin-text)' }}>Quick Stats</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>Showcase Coverage</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>{showcaseCoverage}%</span>
                </div>
                <div className="w-full rounded-full h-2.5" style={{ background: '#EEF2FF' }}>
                  <div className="h-2.5 rounded-full transition-all duration-500 bg-blue-500" style={{ width: `${showcaseCoverage}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>Featured Works</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>{counts.featuredWorks}/4</span>
                </div>
                <div className="w-full rounded-full h-2.5" style={{ background: '#FFF7ED' }}>
                  <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (counts.featuredWorks / 4) * 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>Total Content</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--admin-text)' }}>{totalManagedEntries}</span>
                </div>
                <div className="w-full rounded-full h-2.5" style={{ background: '#F0FDF4' }}>
                  <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, totalManagedEntries * 5)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Health Checks */}
          <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-7">
            <h3 className="text-lg font-semibold mb-5" style={{ color: 'var(--admin-text)' }}>Health Checks</h3>
            <div className="space-y-3">
              {priorityQueue.map((task) => (
                <Link key={task.label} to={task.link} className="flex items-center justify-between py-2.5 px-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={16} className={task.state === 'Healthy' ? 'text-green-500' : 'text-orange-500'} />
                    <span className="text-sm" style={{ color: 'var(--admin-text-secondary)' }}>{task.label}</span>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    task.state === 'Healthy' ? 'bg-green-50 text-green-600' : task.state === 'Building' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {task.state}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
