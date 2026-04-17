import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { FiEdit2, FiPlus } from 'react-icons/fi';
import { fetchWorkItems, createWorkItem, updateWorkItem, deleteWorkItem as apiDeleteWork, emitContentUpdate, type WorkItem } from '../../lib/content-store';
import ImageDropzone from '../../components/admin/ImageDropzone';
import AdminLoader from '../../components/admin/AdminLoader';
import PageHeader from '../../components/admin/PageHeader';
import EmptyState from '../../components/admin/EmptyState';
import Modal from '../../components/admin/Modal';

const WORK_TYPES = ['Branding', 'Web Design', 'Web Development', 'Identity', 'Software', '3D Animation', 'UI/UX'];

const defaultFormData = (): Partial<WorkItem> => ({
  title: '', type: '', image: '', description: '', link: '', featuredOnHome: false,
});

const WorksManagement = () => {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null);
  const [formData, setFormData] = useState<Partial<WorkItem>>(defaultFormData);

  const loadWorks = async () => {
    try { setWorks(await fetchWorkItems()); } finally { setIsLoading(false); }
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
    const payload: Partial<WorkItem> = {
      title: formData.title || '',
      type: formData.type || '',
      image: formData.image || '',
      description: formData.description || '',
      link: formData.link || '',
      featuredOnHome: Boolean(formData.featuredOnHome),
    };

    if (editingWork) {
      await updateWorkItem(editingWork.id, payload);
    } else {
      await createWorkItem(payload);
    }
    await loadWorks();
    emitContentUpdate();
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this work?')) return;
    await apiDeleteWork(id);
    await loadWorks();
    emitContentUpdate();
  };

  const toggleFeatured = async (work: WorkItem) => {
    await updateWorkItem(work.id, { featuredOnHome: !work.featuredOnHome });
    await loadWorks();
    emitContentUpdate();
  };

  const { featuredCount, categoryCount } = useMemo(() => ({
    featuredCount: works.filter((w) => w.featuredOnHome).length,
    categoryCount: new Set(works.map((w) => w.type).filter(Boolean)).size,
  }), [works]);

  return (
    <div className="space-y-8">
      <PageHeader
        chip="Portfolio"
        title="Portfolio curation finally feels deliberate instead of cramped."
        description="Manage the full works page and pick which projects deserve home-page visibility from a cleaner, richer collection view."
        note="Home page still uses the first 4 items marked “Show on Home”."
        pills={[
          { label: 'Project library', color: 'rgba(56,189,248,0.8)' },
          { label: 'Home picks highlighted', color: 'rgba(253,186,116,0.8)' },
        ]}
        stats={[
          { label: 'All works', value: works.length, helper: 'Live portfolio summary from the connected content store.' },
          { label: 'Home picks', value: featuredCount, helper: 'Live portfolio summary from the connected content store.' },
          { label: 'Categories', value: categoryCount, helper: 'Live portfolio summary from the connected content store.' },
        ]}
        footerNote="Featured toggles, edit controls, and cover previews are now easier to scan while keeping the existing CRUD flow unchanged."
        actions={
          <button onClick={openAddModal} className="admin-primary-btn inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold">
            <FiPlus size={18} /> <span>Add Work</span>
          </button>
        }
      />

      {isLoading ? (
        <AdminLoader variant="cards" count={4} />
      ) : works.length === 0 ? (
        <EmptyState
          eyebrow="Portfolio collection"
          title="No work items added yet."
          description="Add the first project to start filling this redesigned library. Featured home picks and categories will update automatically."
          action={
            <button onClick={openAddModal} className="admin-primary-btn inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold">
              <FiPlus size={18} /> <span>Add First Work</span>
            </button>
          }
        />
      ) : (
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 2xl:grid-cols-3">
        {works.map((work) => (
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
                  onClick={() => toggleFeatured(work)}
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

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eyebrow="Portfolio editor"
        title={editingWork ? 'Edit Work' : 'Add Work'}
        description="Update project visuals, descriptions, and homepage visibility while preserving the existing content structure."
        maxWidth="3xl"
      >
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
                <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="admin-input px-4 py-3 text-sm" required />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">Type</label>
                <select value={formData.type || ''} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="admin-select px-4 py-3 text-sm" required>
                  <option value="">Select type</option>
                  {WORK_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm text-gray-400">Description (Optional)</label>
              <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="admin-textarea min-h-[120px] px-4 py-3 text-sm" />
            </div>
          </div>

          <div className="admin-form-block rounded-[28px] p-5 sm:p-6">
            <div className="mb-4">
              <h3 className="text-base font-medium text-white">Publishing settings</h3>
              <p className="mt-1 text-sm text-gray-500">Attach a live link and decide whether this project should appear on the homepage.</p>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">Project Link (Optional)</label>
              <input type="text" value={formData.link || ''} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="admin-input px-4 py-3 text-sm" placeholder="https://..." />
            </div>

            <label className="mt-4 flex items-center gap-3 rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
              <input type="checkbox" checked={Boolean(formData.featuredOnHome)} onChange={(e) => setFormData({ ...formData, featuredOnHome: e.target.checked })} />
              Show on Home selected works section
            </label>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="button" onClick={() => setIsModalOpen(false)} className="admin-secondary-btn flex-1 rounded-2xl px-4 py-3 text-sm font-medium text-gray-300">Cancel</button>
            <button type="submit" className="admin-primary-btn flex-1 rounded-2xl px-4 py-3 text-sm font-semibold">{editingWork ? 'Save Changes' : 'Add Work'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WorksManagement;

