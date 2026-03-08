import { FiUsers, FiBriefcase, FiEye, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // In production, these would come from API/database
  const stats = [
    { label: 'Team Members', value: '2', icon: FiUsers, color: 'orange', link: '/admin/team' },
    { label: 'Works', value: '6', icon: FiBriefcase, color: 'blue', link: '/admin/works' },
    { label: 'Page Views', value: '1.2K', icon: FiEye, color: 'green', link: '#' },
    { label: 'Growth', value: '+12%', icon: FiTrendingUp, color: 'purple', link: '#' },
  ];

  const colorClasses = {
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back to RefractLabs Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-[#111] rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colorClasses[stat.color as keyof typeof colorClasses]} mb-4`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#111] rounded-xl border border-white/5 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/team"
            className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded-lg border border-white/5 hover:border-orange-500/30 transition-all duration-200"
          >
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <FiUsers className="text-orange-400" size={24} />
            </div>
            <div>
              <p className="text-white font-medium">Add Team Member</p>
              <p className="text-sm text-gray-500">Add new team member to showcase</p>
            </div>
          </Link>

          <Link
            to="/admin/works"
            className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded-lg border border-white/5 hover:border-blue-500/30 transition-all duration-200"
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <FiBriefcase className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-white font-medium">Add New Work</p>
              <p className="text-sm text-gray-500">Upload new project to works section</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

