import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { fetchTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember as apiDeleteMember, emitContentUpdate, type TeamMember } from '../../lib/content-store';
import ImageDropzone from '../../components/admin/ImageDropzone';
import AdminLoader from '../../components/admin/AdminLoader';
import PageHeader from '../../components/admin/PageHeader';
import EmptyState from '../../components/admin/EmptyState';
import Modal from '../../components/admin/Modal';

const SOCIAL_FIELDS: Array<{ key: keyof NonNullable<TeamMember['social']>; label: string }> = [
  { key: 'twitter', label: 'Twitter URL' },
  { key: 'linkedin', label: 'LinkedIn URL' },
  { key: 'instagram', label: 'Instagram URL' },
  { key: 'behance', label: 'Behance URL' },
];

const defaultFormData = (): Partial<TeamMember> => ({
  name: '', role: '', image: '', description: '',
  social: { twitter: '', linkedin: '', instagram: '', behance: '' },
});

const countSocials = (member: TeamMember) => Object.values(member.social || {}).filter(Boolean).length;

const TeamManagement = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>(defaultFormData);

  const loadTeam = async () => {
    try { setTeam(await fetchTeamMembers()); } finally { setIsLoading(false); }
  };

  useEffect(() => { loadTeam(); }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setFormData(defaultFormData());
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormData(member);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name || '',
      role: formData.role || '',
      image: formData.image || '',
      description: formData.description || '',
      social: formData.social || {},
    };

    if (editingMember) {
      await updateTeamMember(editingMember.id, payload);
    } else {
      await createTeamMember(payload as Omit<TeamMember, 'id'>);
    }
    await loadTeam();
    emitContentUpdate();
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    await apiDeleteMember(id);
    await loadTeam();
    emitContentUpdate();
  };

  const { totalLinkedProfiles, membersWithImages } = useMemo(() => ({
    totalLinkedProfiles: team.reduce((sum, m) => sum + countSocials(m), 0),
    membersWithImages: team.filter((m) => Boolean(m.image)).length,
  }), [team]);

  return (
    <div className="space-y-8">
      <PageHeader
        chip="People"
        title="Design-forward team profiles without touching the workflow."
        description="Keep leadership and team profiles polished, readable, and ready for the public-facing team section with better hierarchy and cleaner editing surfaces."
        pills={[
          { label: 'Visual profile cards', color: 'rgba(253,186,116,0.8)' },
          { label: 'Linked socials tracked', color: 'rgba(56,189,248,0.8)' },
        ]}
        stats={[
          { label: 'Total members', value: team.length, helper: 'Live summary from the current team dataset.' },
          { label: 'Linked profiles', value: totalLinkedProfiles, helper: 'Live summary from the current team dataset.' },
          { label: 'Portraits added', value: membersWithImages, helper: 'Live summary from the current team dataset.' },
        ]}
        footerNote="Use the improved cards below to scan bios faster, spot missing profile links, and open editing without the old cramped layout."
        actions={
          <button onClick={openAddModal} className="admin-primary-btn inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold">
            <FiPlus size={18} /> <span>Add Member</span>
          </button>
        }
      />

      {isLoading ? (
        <AdminLoader variant="cards" count={3} />
      ) : team.length === 0 ? (
        <EmptyState
          eyebrow="Team profiles"
          title="No team members added yet."
          description="Start by creating the first profile. The new layout will automatically turn it into a richer visual card with cleaner actions and spacing."
          action={
            <button onClick={openAddModal} className="admin-primary-btn inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold">
              <FiPlus size={18} /> <span>Add First Member</span>
            </button>
          }
        />
      ) : (
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 2xl:grid-cols-3">
        {team.map((member) => (
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
                  <p className="mt-2 text-lg font-semibold text-white">{countSocials(member)}</p>
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
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eyebrow="Team profile editor"
        title={editingMember ? 'Edit Member' : 'Add Member'}
        description="Update the profile details, portrait, and social links without touching the current content structure."
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
          <div className="admin-form-block rounded-[28px] p-5 sm:p-6">
            <div className="mb-4">
              <h3 className="text-base font-medium text-white">Photo</h3>
              <p className="mt-1 text-sm text-gray-500">Drag &amp; drop a portrait, click to browse, or paste a URL.</p>
            </div>
            <ImageDropzone
              value={formData.image || ''}
              onChange={(val) => setFormData({ ...formData, image: val })}
              placeholder="Drop portrait here or click to browse"
              previewShape="square"
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
                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="admin-input px-4 py-3 text-sm" required />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">Role</label>
                <input type="text" value={formData.role || ''} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="admin-input px-4 py-3 text-sm" required />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm text-gray-400">Description</label>
              <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="admin-textarea min-h-[120px] px-4 py-3 text-sm" required />
            </div>
          </div>

          <div className="admin-form-block rounded-[28px] p-5 sm:p-6">
            <div className="mb-4">
              <h3 className="text-base font-medium text-white">Social links</h3>
              <p className="mt-1 text-sm text-gray-500">Optional profile URLs for team cards and future integrations.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {SOCIAL_FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <label className="mb-2 block text-sm text-gray-400">{label}</label>
                  <input
                    type="text"
                    value={formData.social?.[key] || ''}
                    onChange={(e) => setFormData({ ...formData, social: { ...formData.social, [key]: e.target.value } })}
                    className="admin-input px-4 py-3 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="button" onClick={() => setIsModalOpen(false)} className="admin-secondary-btn flex-1 rounded-2xl px-4 py-3 text-sm font-medium text-gray-300">Cancel</button>
            <button type="submit" className="admin-primary-btn flex-1 rounded-2xl px-4 py-3 text-sm font-semibold">{editingMember ? 'Save Changes' : 'Add Member'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamManagement;

