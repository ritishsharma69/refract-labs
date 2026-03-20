import { useState, useEffect, type ChangeEvent } from 'react';
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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
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

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
  const totalLinkedProfiles = team.reduce((total, member) => total + activeSocialLinks(member), 0);
  const membersWithImages = team.filter((member) => Boolean(member.image)).length;

  return (
    <div className="space-y-8">
      <section className="admin-surface rounded-[34px] p-6 sm:p-8 xl:p-10">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div className="max-w-3xl">
            <span className="admin-chip">People</span>
            <h1 className="mt-5 text-3xl font-bold text-white font-['Space_Grotesk'] sm:text-4xl xl:text-[44px]">Design-forward team profiles without touching the workflow.</h1>
            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              Keep leadership and team profiles polished, readable, and ready for the public-facing team section with better hierarchy and cleaner editing surfaces.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="admin-pill">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-300 shadow-[0_0_14px_rgba(253,186,116,0.8)]" />
                Visual profile cards
              </div>
              <div className="admin-pill">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.8)]" />
                Linked socials tracked
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Total members', value: team.length },
              { label: 'Linked profiles', value: totalLinkedProfiles },
              { label: 'Portraits added', value: membersWithImages },
            ].map((item) => (
              <div key={item.label} className="admin-form-block rounded-[26px] px-5 py-5">
                <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">Live summary from the current team dataset.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/8 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-gray-500">
            Use the improved cards below to scan bios faster, spot missing profile links, and open editing without the old cramped layout.
          </p>
          <button
            onClick={openAddModal}
            className="admin-primary-btn inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
          >
            <FiPlus size={18} />
            <span>Add Member</span>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 2xl:grid-cols-3">
        {team.length === 0 ? (
          <div className="admin-empty-state col-span-full rounded-[32px] px-6 py-14 text-center sm:px-10">
            <p className="text-[11px] uppercase tracking-[0.28em] text-gray-500">Team profiles</p>
            <h3 className="mt-4 text-2xl font-semibold text-white font-['Space_Grotesk']">No team members added yet.</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-400">
              Start by creating the first profile. The new layout will automatically turn it into a richer visual card with cleaner actions and spacing.
            </p>
            <button
              onClick={openAddModal}
              className="admin-primary-btn mt-6 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
            >
              <FiPlus size={18} />
              <span>Add First Member</span>
            </button>
          </div>
        ) : team.map((member) => (
          <div key={member.id} className="admin-grid-card group overflow-hidden rounded-[30px]">
            <div className="relative aspect-[4/3] bg-[#0a0d12]">
              {member.image ? (
                <img src={member.image} alt={member.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.24),transparent_38%),linear-gradient(135deg,rgba(59,130,246,0.18),rgba(15,23,42,0.92))] text-5xl font-bold text-white/25">
                  {member.name.charAt(0)}
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent" />

              <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-gray-200">
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

              <div className="absolute inset-x-0 bottom-0 px-6 pb-5">
                <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                <p className="mt-1 text-sm text-orange-200/90">{member.role}</p>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <p className="line-clamp-3 text-sm leading-7 text-gray-400">{member.description}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="admin-form-block rounded-[22px] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Connected profiles</p>
                  <p className="mt-2 text-lg font-semibold text-white">{activeSocialLinks(member)}</p>
                  <p className="mt-1 text-xs leading-6 text-gray-500">Twitter, LinkedIn, Instagram, or Behance links attached.</p>
                </div>

                <button
                  onClick={() => openEditModal(member)}
                  className="admin-secondary-btn flex items-center justify-center rounded-[22px] px-4 py-4 text-sm font-medium text-gray-200"
                >
                  Edit details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="admin-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="admin-modal-panel max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px]">
            <div className="flex items-start justify-between gap-4 border-b border-white/6 p-6 sm:p-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Team profile editor</p>
                <h2 className="mt-2 text-2xl font-semibold text-white font-['Space_Grotesk']">
                  {editingMember ? 'Edit Member' : 'Add Member'}
                </h2>
                <p className="mt-2 text-sm leading-7 text-gray-400">Update the profile details, portrait, and social links without touching the current content structure.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="admin-icon-btn rounded-2xl p-3 text-gray-300 hover:text-white">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
              <div className="admin-form-block rounded-[28px] p-5 sm:p-6">
                <div className="mb-4">
                  <h3 className="text-base font-medium text-white">Photo</h3>
                  <p className="mt-1 text-sm text-gray-500">Upload a portrait or paste an image URL for this profile card.</p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.03]">
                    {formData.image ? (
                      <img src={formData.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl font-semibold text-white/25">{(formData.name || 'R').charAt(0)}</span>
                    )}
                  </div>
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

              <div className="admin-form-block rounded-[28px] p-5 sm:p-6">
                <div className="mb-4">
                  <h3 className="text-base font-medium text-white">Profile details</h3>
                  <p className="mt-1 text-sm text-gray-500">These fields control the visible name, role, and supporting bio text.</p>
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

                <div className="mt-4">
                  <label className="mb-2 block text-sm text-gray-400">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="admin-textarea min-h-[120px] px-4 py-3 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-block rounded-[28px] p-5 sm:p-6">
                <div className="mb-4">
                  <h3 className="text-base font-medium text-white">Social links</h3>
                  <p className="mt-1 text-sm text-gray-500">Optional profile URLs for team cards and future integrations.</p>
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

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
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

