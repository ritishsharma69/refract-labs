import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { FiArrowDown, FiArrowUp, FiEdit2, FiPlus, FiTrash2, FiUpload, FiX } from 'react-icons/fi';
import { getWorkItems, saveWorkItems, type WorkItem } from '../../lib/content-store';

const defaultFormData = (): Partial<WorkItem> => ({
  title: '',
  type: '',
  image: '',
  description: '',
  link: '',
  featuredOnHome: false,
});

const WorksManagement = () => {
  const [works, setWorks] = useState<WorkItem[]>(getWorkItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null);
  const [formData, setFormData] = useState<Partial<WorkItem>>(defaultFormData);

  const saveWorks = (newWorks: WorkItem[]) => {
    setWorks(newWorks);
    saveWorkItems(newWorks);
  };

  const openAddModal = () => {
    setEditingWork(null);
    setFormData(defaultFormData());
    setIsModalOpen(true);
  };

  const openEditModal = (work: WorkItem) => {
    setEditingWork(work);
    setFormData(work);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextWork: WorkItem = {
      id: editingWork?.id || Date.now().toString(),
      title: formData.title || '',
      type: formData.type || '',
      image: formData.image || '',
      description: formData.description || '',
      link: formData.link || '',
      featuredOnHome: Boolean(formData.featuredOnHome),
    };

    if (editingWork) {
      const updated = works.map((work) => (work.id === editingWork.id ? nextWork : work));
      saveWorks(updated);
    } else {
      saveWorks([...works, nextWork]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this work?')) {
      saveWorks(works.filter((work) => work.id !== id));
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

  const moveWork = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= works.length) return;

    const nextWorks = [...works];
    [nextWorks[index], nextWorks[targetIndex]] = [nextWorks[targetIndex], nextWorks[index]];
    saveWorks(nextWorks);
  };

  const toggleFeatured = (id: string) => {
    saveWorks(works.map((work) => (work.id === id ? { ...work, featuredOnHome: !work.featuredOnHome } : work)));
  };

  const workTypes = ['Branding', 'Web Design', 'Web Development', 'Identity', 'Software', '3D Animation', 'UI/UX'];
  const featuredCount = works.filter((work) => work.featuredOnHome).length;
  const categoryCount = new Set(works.map((work) => work.type).filter(Boolean)).size;

  return (
    <div className="space-y-6">
      <section className="admin-surface rounded-[30px] p-6 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="admin-chip">Portfolio</span>
            <h1 className="mt-5 text-3xl font-bold text-white font-['Space_Grotesk'] sm:text-4xl">Works Management</h1>
            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              Manage the full works page and pick which projects deserve home-page visibility.
            </p>
            <p className="mt-3 text-sm text-orange-300/90">Home page uses the first 4 items marked “Show on Home”.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {[
              { label: 'All works', value: works.length },
              { label: 'Home picks', value: featuredCount },
              { label: 'Categories', value: categoryCount },
            ].map((item) => (
              <div key={item.label} className="admin-surface-soft rounded-[22px] px-5 py-4 text-sm text-gray-400">
                <div className="text-2xl font-semibold text-white">{item.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500">{item.label}</div>
              </div>
            ))}
            <button
              onClick={openAddModal}
              className="admin-primary-btn flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
            >
              <FiPlus size={18} />
              <span>Add Work</span>
            </button>
          </div>
        </div>
      </section>

      {/* Works Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {works.map((work, index) => (
          <div key={work.id} className="group overflow-hidden rounded-[28px] border border-white/8 bg-[#101010]/92 shadow-[0_20px_55px_rgba(0,0,0,0.22)]">
            <div className="relative aspect-video bg-[#0a0a0a]">
              {work.image ? (
                <img src={work.image} alt={work.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500/20 to-purple-500/20">
                  <span className="text-2xl font-bold text-white/20">{work.title[0]}</span>
                </div>
              )}
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                  {work.type}
                </span>
                {work.featuredOnHome && (
                  <span className="rounded-full border border-orange-500/30 bg-orange-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-300">
                    Show on Home
                  </span>
                )}
              </div>
              <div className="absolute right-4 top-4 flex gap-2">
                <button onClick={() => moveWork(index, -1)} className="admin-icon-btn rounded-xl bg-black/35 p-2.5 text-gray-300 hover:text-white">
                  <FiArrowUp size={14} />
                </button>
                <button onClick={() => moveWork(index, 1)} className="admin-icon-btn rounded-xl bg-black/35 p-2.5 text-gray-300 hover:text-white">
                  <FiArrowDown size={14} />
                </button>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/50 group-hover:opacity-100">
                <div className="flex gap-2 px-4">
                  <button
                    onClick={() => openEditModal(work)}
                    className="admin-icon-btn rounded-2xl p-3 text-white"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(work.id)}
                    className="rounded-2xl border border-red-500/18 bg-red-500/18 p-3 text-red-300 transition-colors hover:bg-red-500/28"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <h3 className="mt-1 text-lg font-semibold text-white">{work.title}</h3>
                {work.description && <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-400">{work.description}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleFeatured(work.id)}
                  className={`rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors ${work.featuredOnHome ? 'bg-orange-500 text-white' : 'border border-white/8 bg-white/[0.04] text-gray-300 hover:bg-white/[0.08]'}`}
                >
                  {work.featuredOnHome ? 'Remove from Home' : 'Show on Home'}
                </button>
                <button
                  onClick={() => openEditModal(work)}
                  className="admin-secondary-btn rounded-xl px-3.5 py-2.5 text-xs font-medium"
                >
                  Edit
                </button>
                {work.link && (
                  <a
                    href={work.link}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/8 bg-transparent px-3.5 py-2.5 text-xs font-medium text-gray-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                  >
                    Visit Link
                  </a>
                )}
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
                {editingWork ? 'Edit Work' : 'Add Work'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-7">
              {/* Image Upload */}
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 sm:p-5">
                <label className="mb-3 block text-sm text-gray-400">Cover Image</label>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {formData.image && (
                    <img src={formData.image} alt="" className="h-20 w-28 rounded-2xl object-cover" />
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
                  <label className="mb-2 block text-sm text-gray-400">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="admin-input px-4 py-3 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">Type</label>
                  <select
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="admin-select px-4 py-3 text-sm"
                    required
                  >
                    <option value="">Select type</option>
                    {workTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">Description (Optional)</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="admin-textarea min-h-[120px] px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">Project Link (Optional)</label>
                <input
                  type="text"
                  value={formData.link || ''}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="admin-input px-4 py-3 text-sm"
                  placeholder="https://..."
                />
              </div>

              <label className="flex items-center gap-3 rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={Boolean(formData.featuredOnHome)}
                  onChange={(e) => setFormData({ ...formData, featuredOnHome: e.target.checked })}
                />
                Show on Home selected works section
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="admin-secondary-btn flex-1 rounded-2xl px-4 py-3 text-sm font-medium text-gray-300">
                  Cancel
                </button>
                <button type="submit"
                  className="admin-primary-btn flex-1 rounded-2xl px-4 py-3 text-sm font-semibold">
                  {editingWork ? 'Save Changes' : 'Add Work'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorksManagement;

