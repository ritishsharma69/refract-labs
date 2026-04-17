import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { FiArrowDown, FiArrowUp, FiEdit2, FiPlus, FiX } from 'react-icons/fi';
import { fetchWorkItems, createWorkItem, updateWorkItem, deleteWorkItem as apiDeleteWork, emitContentUpdate, type WorkItem } from '../../lib/content-store';
import ImageDropzone from '../../components/admin/ImageDropzone';
import AdminLoader from '../../components/admin/AdminLoader';

const defaultFormData = (): Partial<WorkItem> => ({
  title: '',
  type: '',
  image: '',
  description: '',
  link: '',
  featuredOnHome: false,
});

const WorksManagement = () => {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null);
  const [formData, setFormData] = useState<Partial<WorkItem>>(defaultFormData);

  const loadWorks = async () => {
    try { setWorks(await fetchWorkItems()); } catch { /* ignore */ }
    finally { setIsLoading(false); }
  };

  useEffect(() => { loadWorks(); }, []);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title || '',
      type: formData.type || '',
      image: formData.image || '',
      description: formData.description || '',
      link: formData.link || '',
      featuredOnHome: Boolean(formData.featuredOnHome),
    };

    try {
      if (editingWork) {
        await updateWorkItem(editingWork.id, payload);
      } else {
        await createWorkItem(payload);
      }
      await loadWorks();
      emitContentUpdate();
    } catch { /* ignore */ }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this work?')) {
      try {
        await apiDeleteWork(id);
        await loadWorks();
        emitContentUpdate();
      } catch { /* ignore */ }
    }
  };

  const moveWork = (_index: number, _direction: -1 | 1) => {
    // Reordering requires a more complex backend implementation; skipping for now
  };

  const toggleFeatured = async (id: string) => {
    const work = works.find((w) => w.id === id);
    if (!work) return;
    try {
      await updateWorkItem(id, { featuredOnHome: !work.featuredOnHome });
      await loadWorks();
      emitContentUpdate();
    } catch { /* ignore */ }
  };

  const workTypes = ['Branding', 'Web Design', 'Web Development', 'Identity', 'Software', '3D Animation', 'UI/UX'];
  const featuredCount = works.filter((work) => work.featuredOnHome).length;
  const categoryCount = new Set(works.map((work) => work.type).filter(Boolean)).size;

  return (
    <div className="space-y-8">
      <section className="admin-surface rounded-[34px] p-6 sm:p-8 xl:p-10">
        <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr] xl:items-end">
          <div className="max-w-3xl">
            <span className="admin-chip">Portfolio</span>
            <h1 className="mt-5 text-3xl font-bold text-white font-['Space_Grotesk'] sm:text-4xl xl:text-[44px]">Portfolio curation finally feels deliberate instead of cramped.</h1>
            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              Manage the full works page and pick which projects deserve home-page visibility from a cleaner, richer collection view.
            </p>
            <p className="mt-3 text-sm text-orange-300/90">Home page still uses the first 4 items marked “Show on Home”.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="admin-pill">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.8)]" />
                Project library
              </div>
              <div className="admin-pill">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-300 shadow-[0_0_14px_rgba(253,186,116,0.8)]" />
                Home picks highlighted
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'All works', value: works.length },
              { label: 'Home picks', value: featuredCount },
              { label: 'Categories', value: categoryCount },
            ].map((item) => (
              <div key={item.label} className="admin-form-block rounded-[26px] px-5 py-5">
                <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">Live portfolio summary from the connected content store.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/8 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-gray-500">
            Featured toggles, edit controls, and cover previews are now easier to scan while keeping the existing CRUD flow unchanged.
          </p>
          <button
            onClick={openAddModal}
            className="admin-primary-btn inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
          >
            <FiPlus size={18} />
            <span>Add Work</span>
          </button>
        </div>
      </section>

      {isLoading ? (
        <AdminLoader variant="cards" count={4} />
      ) : (
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 2xl:grid-cols-3">
        {works.length === 0 ? (
          <div className="admin-empty-state col-span-full rounded-[32px] px-6 py-14 text-center sm:px-10">
            <p className="text-[11px] uppercase tracking-[0.28em] text-gray-500">Portfolio collection</p>
            <h3 className="mt-4 text-2xl font-semibold text-white font-['Space_Grotesk']">No work items added yet.</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-400">
              Add the first project to start filling this redesigned library. Featured home picks and categories will update automatically.
            </p>
            <button
              onClick={openAddModal}
              className="admin-primary-btn mt-6 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
            >
              <FiPlus size={18} />
              <span>Add First Work</span>
            </button>
          </div>
        ) : works.map((work, index) => (
          <div key={work.id} className="admin-grid-card group overflow-hidden rounded-[30px]">
            <div className="relative aspect-video bg-[#0a0d12]">
              {work.image ? (
                <img src={work.image} alt={work.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.24),transparent_38%),linear-gradient(135deg,rgba(59,130,246,0.18),rgba(15,23,42,0.92))]">
                  <span className="text-2xl font-bold text-white/25">{work.title[0]}</span>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />

              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                  {work.type || 'Untitled type'}
                </span>
                {work.featuredOnHome && (
                  <span className="rounded-full border border-orange-500/30 bg-orange-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-300">
                    Show on Home
                  </span>
                )}
              </div>

              <div className="absolute right-4 top-4 flex gap-2">
                <button onClick={() => moveWork(index, -1)} className="admin-icon-btn rounded-xl bg-black/35 p-2.5 text-gray-300 hover:text-white" title="Move up">
                  <FiArrowUp size={14} />
                </button>
                <button onClick={() => moveWork(index, 1)} className="admin-icon-btn rounded-xl bg-black/35 p-2.5 text-gray-300 hover:text-white" title="Move down">
                  <FiArrowDown size={14} />
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 px-5 pb-4">
                <h3 className="text-xl font-semibold text-white">{work.title}</h3>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <p className="line-clamp-3 min-h-[84px] text-sm leading-7 text-gray-400">
                {work.description || 'Add a project description to make the portfolio card more informative in the admin preview.'}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="admin-form-block rounded-[22px] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Homepage status</p>
                  <p className="mt-2 text-lg font-semibold text-white">{work.featuredOnHome ? 'Featured' : 'Not featured'}</p>
                  <p className="mt-1 text-xs leading-6 text-gray-500">Only the first 4 featured items show in the selected works section.</p>
                </div>

                <div className="admin-form-block rounded-[22px] px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">Project link</p>
                  <p className="mt-2 truncate text-sm font-medium text-white">{work.link ? 'Live link attached' : 'No link attached'}</p>
                  <p className="mt-1 text-xs leading-6 text-gray-500">Add an external URL if this work should open a live project.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
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
                  <span className="inline-flex items-center gap-2"><FiEdit2 size={14} /> Edit</span>
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
                <button
                  onClick={() => handleDelete(work.id)}
                  className="rounded-xl border border-red-500/18 bg-red-500/10 px-3.5 py-2.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/18"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {isModalOpen && (
        <div className="admin-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="admin-modal-panel max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px]">
            <div className="flex items-start justify-between gap-4 border-b border-white/6 p-6 sm:p-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Portfolio editor</p>
                <h2 className="mt-2 text-2xl font-semibold text-white font-['Space_Grotesk']">
                  {editingWork ? 'Edit Work' : 'Add Work'}
                </h2>
                <p className="mt-2 text-sm leading-7 text-gray-400">Update project visuals, descriptions, and homepage visibility while preserving the existing content structure.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="admin-icon-btn rounded-2xl p-3 text-gray-300 hover:text-white">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
              <div className="admin-form-block rounded-[28px] p-5 sm:p-6">
                <div className="mb-4">
                  <h3 className="text-base font-medium text-white">Cover image</h3>
                  <p className="mt-1 text-sm text-gray-500">Drag &amp; drop an image, click to browse, or paste a URL for the preview card.</p>
                </div>
                <ImageDropzone
                  value={formData.image || ''}
                  onChange={(val) => setFormData({ ...formData, image: val })}
                  placeholder="Drop cover image here or click to browse"
                  previewShape="rect"
                />
              </div>

              <div className="admin-form-block rounded-[28px] p-5 sm:p-6">
                <div className="mb-4">
                  <h3 className="text-base font-medium text-white">Project details</h3>
                  <p className="mt-1 text-sm text-gray-500">Name the project, assign a category, and write the short supporting description.</p>
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

                <div className="mt-4">
                  <label className="mb-2 block text-sm text-gray-400">Description (Optional)</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="admin-textarea min-h-[120px] px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div className="admin-form-block rounded-[28px] p-5 sm:p-6">
                <div className="mb-4">
                  <h3 className="text-base font-medium text-white">Publishing settings</h3>
                  <p className="mt-1 text-sm text-gray-500">Attach a live link and decide whether this project should appear on the homepage.</p>
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

                <label className="mt-4 flex items-center gap-3 rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.featuredOnHome)}
                    onChange={(e) => setFormData({ ...formData, featuredOnHome: e.target.checked })}
                  />
                  Show on Home selected works section
                </label>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
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

