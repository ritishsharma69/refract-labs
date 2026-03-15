import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import { fetchTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember as apiDeleteMember, emitContentUpdate, type TeamMember } from '../../lib/content-store';

const TeamManagement = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '', role: '', image: '', description: '',
    social: { twitter: '', linkedin: '', instagram: '', behance: '' }
  });

  const loadTeam = async () => {
    try { setTeam(await fetchTeamMembers()); } catch { /* ignore */ }
  };

  useEffect(() => { loadTeam(); }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name || '',
      role: formData.role || '',
      image: formData.image || '',
      description: formData.description || '',
      social: formData.social || {},
    };

    try {
      if (editingMember) {
        await updateTeamMember(editingMember.id, payload);
      } else {
        await createTeamMember(payload as Omit<TeamMember, 'id'>);
      }
      await loadTeam();
      emitContentUpdate();
    } catch { /* ignore */ }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        await apiDeleteMember(id);
        await loadTeam();
        emitContentUpdate();
      } catch { /* ignore */ }
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

  const activeSocialLinks = (member: TeamMember) => Object.values(member.social || {}).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <section className="admin-surface rounded-[30px] p-6 sm:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="admin-chip">People</span>
            <h1 className="mt-5 text-3xl font-bold text-white font-['Space_Grotesk'] sm:text-4xl">Team Management</h1>
            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              Keep leadership and team profiles polished, readable, and ready for the public-facing team section.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="admin-surface-soft rounded-[22px] px-5 py-4 text-sm text-gray-400">
              <div className="text-2xl font-semibold text-white">{team.length}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500">Total members</div>
            </div>
            <button
              onClick={openAddModal}
              className="admin-primary-btn flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
            >
              <FiPlus size={18} />
              <span>Add Member</span>
            </button>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {team.map((member) => (
          <div key={member.id} className="overflow-hidden rounded-[28px] border border-white/8 bg-[#101010]/92 shadow-[0_20px_55px_rgba(0,0,0,0.22)]">
            <div className="group relative aspect-[4/3] bg-[#0a0a0a]">
              {member.image ? (
                <img src={member.image} alt={member.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500/20 to-purple-500/20 text-5xl font-bold text-white/20">
                  {member.name.charAt(0)}
                </div>
              )}
              <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-gray-200">
                Team profile
              </div>
              <div className="absolute right-4 top-4 flex gap-2">
                <button
                  onClick={() => openEditModal(member)}
                  className="admin-icon-btn rounded-xl p-2.5 text-white"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="rounded-xl border border-red-500/18 bg-black/45 p-2.5 text-red-300 transition-colors hover:bg-red-500/18"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                <p className="mt-1 text-sm text-orange-300/90">{member.role}</p>
              </div>

              <p className="line-clamp-3 text-sm leading-7 text-gray-400">{member.description}</p>

              <div className="flex items-center justify-between gap-3 rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Connected profiles</p>
                  <p className="mt-1 font-medium text-white">{activeSocialLinks(member)} linked accounts</p>
                </div>
                <button
                  onClick={() => openEditModal(member)}
                  className="admin-secondary-btn rounded-xl px-3 py-2 text-xs font-medium"
                >
                  Edit details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="admin-modal-panel max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[30px]">
            <div className="flex items-center justify-between border-b border-white/6 p-6 sm:p-7">
              <h2 className="text-lg font-semibold text-white">
                {editingMember ? 'Edit Member' : 'Add Member'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-7">
              {/* Image Upload */}
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 sm:p-5">
                <label className="mb-3 block text-sm text-gray-400">Photo</label>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {formData.image && (
                    <img src={formData.image} alt="" className="h-20 w-20 rounded-2xl object-cover" />
                  )}
                  <label className="admin-secondary-btn flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-3 text-sm">
                    <FiUpload size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="admin-input mt-3 px-4 py-3 text-sm"
                  placeholder="Or paste image URL"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-400">Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="admin-input px-4 py-3 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-gray-400">Role</label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="admin-input px-4 py-3 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="admin-textarea min-h-[120px] px-4 py-3 text-sm"
                  required
                />
              </div>

              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 sm:p-5">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-white">Social links</h3>
                  <p className="mt-1 text-sm text-gray-500">Optional profile links for team cards and future integrations.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">Twitter URL</label>
                    <input
                      type="text"
                      value={formData.social?.twitter || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, twitter: e.target.value } })}
                      className="admin-input px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">LinkedIn URL</label>
                    <input
                      type="text"
                      value={formData.social?.linkedin || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, linkedin: e.target.value } })}
                      className="admin-input px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">Instagram URL</label>
                    <input
                      type="text"
                      value={formData.social?.instagram || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, instagram: e.target.value } })}
                      className="admin-input px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-gray-400">Behance URL</label>
                    <input
                      type="text"
                      value={formData.social?.behance || ''}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, behance: e.target.value } })}
                      className="admin-input px-4 py-3 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="admin-secondary-btn flex-1 rounded-2xl px-4 py-3 text-sm font-medium text-gray-300">
                  Cancel
                </button>
                <button type="submit"
                  className="admin-primary-btn flex-1 rounded-2xl px-4 py-3 text-sm font-semibold">
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

