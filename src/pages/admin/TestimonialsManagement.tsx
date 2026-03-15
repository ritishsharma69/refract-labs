import { useState, useEffect } from 'react';
import { FiArrowDown, FiArrowUp, FiMessageSquare, FiPlus, FiVideo, FiX } from 'react-icons/fi';
import { fetchTestimonialItems, createTestimonialItem, updateTestimonialItem, deleteTestimonialItem as apiDeleteItem, emitContentUpdate, type TestimonialItem } from '../../lib/content-store';

const defaultFormData = (): Partial<TestimonialItem> => ({
  type: 'text',
  quote: '',
  name: '',
  role: '',
  company: '',
  stars: 5,
  avatarUrl: '',
  avatarColor: '#c2622a',
  thumbnailUrl: '',
  videoUrl: '',
  duration: '',
  featuredOnHome: false,
});

const TestimonialsManagement = () => {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [formData, setFormData] = useState<Partial<TestimonialItem>>(defaultFormData);

  const loadItems = async () => {
    try { setItems(await fetchTestimonialItems()); } catch { /* ignore */ }
  };

  useEffect(() => { loadItems(); }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData(defaultFormData());
    setIsModalOpen(true);
  };

  const openEditModal = (item: TestimonialItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      type: formData.type === 'video' ? 'video' as const : 'text' as const,
      quote: formData.quote || '',
      name: formData.name || '',
      role: formData.role || '',
      company: formData.company || '',
      stars: Number(formData.stars || 5),
      avatarUrl: formData.avatarUrl || '',
      avatarColor: formData.avatarColor || '#c2622a',
      thumbnailUrl: formData.thumbnailUrl || '',
      videoUrl: formData.videoUrl || '',
      duration: formData.duration || '',
      featuredOnHome: Boolean(formData.featuredOnHome),
    };

    try {
      if (editingItem) {
        await updateTestimonialItem(editingItem.id, payload);
      } else {
        await createTestimonialItem(payload);
      }
      await loadItems();
      emitContentUpdate();
    } catch { /* ignore */ }

    setIsModalOpen(false);
  };

  const moveItem = (_index: number, _direction: -1 | 1) => {
    // Reordering requires more complex backend; skipping for now
  };

  const toggleFeatured = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    try {
      await updateTestimonialItem(id, { featuredOnHome: !item.featuredOnHome });
      await loadItems();
      emitContentUpdate();
    } catch { /* ignore */ }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this testimonial?')) {
      try {
        await apiDeleteItem(id);
        await loadItems();
        emitContentUpdate();
      } catch { /* ignore */ }
    }
  };

  const featuredCount = items.filter((item) => item.featuredOnHome).length;
  const videoCount = items.filter((item) => item.type === 'video').length;

  return (
    <div className="space-y-6">
      <section className="admin-surface rounded-[30px] p-6 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="admin-chip">Social proof</span>
            <h1 className="mt-5 text-3xl font-bold text-white font-['Space_Grotesk'] sm:text-4xl">Testimonials</h1>
            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              Manage the home highlights and shape the full `/testimonials` experience from a cleaner content editor.
            </p>
            <p className="mt-3 text-sm text-orange-300/90">Home page shows the first 4 items marked “Show on Home”.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {[
              { label: 'All testimonials', value: items.length },
              { label: 'Home picks', value: featuredCount },
              { label: 'Video stories', value: videoCount },
            ].map((item) => (
              <div key={item.label} className="admin-surface-soft rounded-[22px] px-5 py-4 text-sm text-gray-400">
                <div className="text-2xl font-semibold text-white">{item.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500">{item.label}</div>
              </div>
            ))}

            <button onClick={openAddModal} className="admin-primary-btn flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold">
              <FiPlus size={18} />
              <span>Add Testimonial</span>
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-[28px] border border-white/8 bg-[#101010]/92 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.22)]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase ${item.type === 'video' ? 'bg-orange-500 text-white' : 'bg-white/8 text-gray-300'}`}>
                  {item.type === 'video' ? <FiVideo size={12} /> : <FiMessageSquare size={12} />}
                  {item.type}
                </span>
                {item.featuredOnHome && <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400">Show on Home</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => moveItem(index, -1)} className="admin-icon-btn rounded-xl p-2.5 text-gray-400 hover:text-white"><FiArrowUp size={14} /></button>
                <button onClick={() => moveItem(index, 1)} className="admin-icon-btn rounded-xl p-2.5 text-gray-400 hover:text-white"><FiArrowDown size={14} /></button>
              </div>
            </div>

            {item.type === 'video' && (
              <div className="mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-[22px] border border-white/6 bg-gradient-to-br from-[#1a1a1a] to-[#2a1a0a] text-sm text-white/70">
                {item.thumbnailUrl ? <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" /> : <span>Video thumbnail placeholder</span>}
              </div>
            )}

            <p className="line-clamp-5 text-sm italic leading-7 text-gray-300">{item.quote}</p>

            <div className="mt-5 flex items-center justify-between gap-3 rounded-[22px] border border-white/6 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${item.avatarColor || '#c2622a'}, #ff9050)` }}>
                  {item.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                  <p className="truncate text-xs text-gray-500">{item.role} · {item.company}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-orange-400 text-xs">{'★'.repeat(Math.max(1, Math.min(5, item.stars || 5)))}</p>
                {item.duration && <p className="text-[11px] text-gray-500 mt-1">{item.duration}</p>}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => toggleFeatured(item.id)} className={`rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors ${item.featuredOnHome ? 'bg-orange-500 text-white' : 'border border-white/8 bg-white/[0.04] text-gray-300 hover:bg-white/[0.08]'}`}>
                {item.featuredOnHome ? 'Remove from Home' : 'Show on Home'}
              </button>
              <button onClick={() => openEditModal(item)} className="admin-secondary-btn rounded-xl px-3.5 py-2.5 text-xs font-medium">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="rounded-xl border border-red-500/18 bg-red-500/10 px-3.5 py-2.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/18">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="admin-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="admin-modal-panel max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[30px]">
            <div className="flex items-center justify-between border-b border-white/6 p-6 sm:p-7">
              <h2 className="text-lg font-semibold text-white">{editingItem ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><FiX size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Type</label>
                  <select value={formData.type || 'text'} onChange={(e) => setFormData({ ...formData, type: e.target.value as TestimonialItem['type'] })} className="admin-select px-4 py-3 text-sm">
                    <option value="text">Text</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Stars</label>
                  <input type="number" min="1" max="5" value={formData.stars || 5} onChange={(e) => setFormData({ ...formData, stars: Number(e.target.value) })} className="admin-input px-4 py-3 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Quote</label>
                <textarea value={formData.quote || ''} onChange={(e) => setFormData({ ...formData, quote: e.target.value })} className="admin-textarea min-h-[140px] px-4 py-3 text-sm" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Name</label>
                  <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="admin-input px-4 py-3 text-sm" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Role</label>
                  <input type="text" value={formData.role || ''} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="admin-input px-4 py-3 text-sm" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Company</label>
                  <input type="text" value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="admin-input px-4 py-3 text-sm" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Avatar Color</label>
                  <input type="color" value={formData.avatarColor || '#c2622a'} onChange={(e) => setFormData({ ...formData, avatarColor: e.target.value })} className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-2" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Avatar Image URL (optional)</label>
                <input type="text" value={formData.avatarUrl || ''} onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })} className="admin-input px-4 py-3 text-sm" placeholder="https://..." />
              </div>

              {formData.type === 'video' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Thumbnail URL</label>
                    <input type="text" value={formData.thumbnailUrl || ''} onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })} className="admin-input px-4 py-3 text-sm" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Duration</label>
                    <input type="text" value={formData.duration || ''} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="admin-input px-4 py-3 text-sm" placeholder="1:24" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Video URL</label>
                    <input type="text" value={formData.videoUrl || ''} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} className="admin-input px-4 py-3 text-sm" placeholder="Direct .mp4 or hosted video URL" />
                  </div>
                </div>
              )}

              <label className="flex items-center gap-3 rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
                <input type="checkbox" checked={Boolean(formData.featuredOnHome)} onChange={(e) => setFormData({ ...formData, featuredOnHome: e.target.checked })} />
                Show on Home testimonials section
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-secondary-btn flex-1 rounded-2xl px-4 py-3 text-sm font-medium text-gray-300">Cancel</button>
                <button type="submit" className="admin-primary-btn flex-1 rounded-2xl px-4 py-3 text-sm font-semibold">{editingItem ? 'Save Changes' : 'Add Testimonial'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManagement;