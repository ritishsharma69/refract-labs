import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  description: string;
  social: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
}

// Load from localStorage or use defaults
const getStoredTeam = (): TeamMember[] => {
  const stored = localStorage.getItem('teamMembers');
  if (stored) return JSON.parse(stored);
  return [
    {
      id: '1',
      name: 'Adam Guarino',
      role: 'Co-Founder and COO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face',
      description: 'Adam orchestrates creative strategy and production for high-growth organizations.',
      social: { linkedin: '#', twitter: '#' },
    },
    {
      id: '2',
      name: 'Jake Young',
      role: 'Co-Founder and CEO',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&crop=face',
      description: 'Jake operates across major creative markets including San Diego and London.',
      social: { linkedin: '#', twitter: '#' },
    },
  ];
};

const TeamManagement = () => {
  const [team, setTeam] = useState<TeamMember[]>(getStoredTeam);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '', role: '', image: '', description: '',
    social: { twitter: '', linkedin: '', instagram: '', behance: '' }
  });

  const saveTeam = (newTeam: TeamMember[]) => {
    setTeam(newTeam);
    localStorage.setItem('teamMembers', JSON.stringify(newTeam));
  };

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: '', role: '', image: '', description: '',
      social: { twitter: '', linkedin: '', instagram: '', behance: '' }
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormData(member);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      const updated = team.map(m => m.id === editingMember.id ? { ...m, ...formData } : m);
      saveTeam(updated);
    } else {
      const newMember: TeamMember = {
        ...formData as TeamMember,
        id: Date.now().toString(),
      };
      saveTeam([...team, newMember]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      saveTeam(team.filter(m => m.id !== id));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">Team Management</h1>
          <p className="text-gray-500 mt-1">Manage your team members</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <FiPlus size={18} />
          <span>Add Member</span>
        </button>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member) => (
          <div key={member.id} className="bg-[#111] rounded-xl border border-white/5 overflow-hidden">
            <div className="aspect-[4/3] bg-[#0a0a0a] relative">
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => openEditModal(member)}
                  className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 bg-black/50 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-semibold text-white">
                {editingMember ? 'Edit Member' : 'Add Member'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Photo</label>
                <div className="flex items-center gap-4">
                  {formData.image && (
                    <img src={formData.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg cursor-pointer hover:bg-[#222] transition-colors">
                    <FiUpload size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                  placeholder="Or paste image URL"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Role</label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Twitter URL</label>
                  <input
                    type="text"
                    value={formData.social?.twitter || ''}
                    onChange={(e) => setFormData({ ...formData, social: { ...formData.social, twitter: e.target.value } })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">LinkedIn URL</label>
                  <input
                    type="text"
                    value={formData.social?.linkedin || ''}
                    onChange={(e) => setFormData({ ...formData, social: { ...formData.social, linkedin: e.target.value } })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-white/10 text-gray-400 rounded-lg hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  {editingMember ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;

