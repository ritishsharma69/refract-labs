import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { FiEdit2, FiMessageSquare, FiPlus, FiTrash2, FiVideo } from 'react-icons/fi';
import { fetchTestimonialItems, createTestimonialItem, updateTestimonialItem, deleteTestimonialItem as apiDeleteItem, emitContentUpdate, type TestimonialItem } from '../../lib/content-store';
import ImageDropzone from '../../components/admin/ImageDropzone';
import AdminLoader from '../../components/admin/AdminLoader';
import PageHeader from '../../components/admin/PageHeader';
import EmptyState from '../../components/admin/EmptyState';
import Modal from '../../components/admin/Modal';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [formData, setFormData] = useState<Partial<TestimonialItem>>(defaultFormData);

  const loadItems = async () => {
    try { setItems(await fetchTestimonialItems()); } catch { /* ignore */ }
    finally { setIsLoading(false); }
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

  const handleSubmit = async (event: FormEvent) => {
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

    if (editingItem) {
      await updateTestimonialItem(editingItem.id, payload);
    } else {
      await createTestimonialItem(payload);
    }
    await loadItems();
    emitContentUpdate();
    setIsModalOpen(false);
  };

  const toggleFeatured = async (item: TestimonialItem) => {
    await updateTestimonialItem(item.id, { featuredOnHome: !item.featuredOnHome });
    await loadItems();
    emitContentUpdate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await apiDeleteItem(id);
    await loadItems();
    emitContentUpdate();
  };

  const { featuredCount, videoCount, textCount } = useMemo(() => {
    const v = items.filter((i) => i.type === 'video').length;
    return {
      featuredCount: items.filter((i) => i.featuredOnHome).length,
      videoCount: v,
      textCount: items.length - v,
    };
  }, [items]);

  return (
    <div className="space-y-8">
      <PageHeader
        chip="Social proof"
        title="Testimonials now feel curated, not stacked on top of each other."
        description="Manage homepage highlights and shape the full `/testimonials` experience from a clearer editor with better card hierarchy."
        note="Home page still shows the first 4 items marked “Show on Home”."
        pills={[
          { label: 'Text + video proof', color: 'rgba(167,139,250,0.8)' },
          { label: 'Home picks highlighted', color: 'rgba(253,186,116,0.8)' },
        ]}
        stats={[
          { label: 'All testimonials', value: items.length, helper: 'Live testimonial summary from the admin content feed.' },
          { label: 'Home picks', value: featuredCount, helper: 'Live testimonial summary from the admin content feed.' },
          { label: 'Video stories', value: videoCount, helper: 'Live testimonial summary from the admin content feed.' },
        ]}
        footerNote="The new card system makes it easier to distinguish text quotes, video stories, featured items, and client identity details at a glance."
        actions={
          <>
            <div className="admin-pill">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.8)]" />
              {textCount} text entries
            </div>
            <button onClick={openAddModal} className="admin-primary-btn inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold">
              <FiPlus size={18} /> <span>Add Testimonial</span>
            </button>
          </>
        }
      />

      {isLoading ? (
        <AdminLoader variant="cards" count={3} />
      ) : items.length === 0 ? (
        <EmptyState
          eyebrow="Social proof library"
          title="No testimonials added yet."
          description="Add the first client quote or video story to populate this redesigned testimonial feed. Home picks and type counts will update automatically."
          action={
            <button onClick={openAddModal} className="admin-primary-btn inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold">
              <FiPlus size={18} /> <span>Add First Testimonial</span>
            </button>
          }
        />
      ) : (
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 2xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="admin-grid-card overflow-hidden rounded-[30px]">
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${item.type === 'video' ? 'bg-orange-500 text-white' : 'bg-white/8 text-gray-300'}`}>
                  {item.type === 'video' ? <FiVideo size={12} /> : <FiMessageSquare size={12} />}
                  {item.type}
                </span>
                {item.featuredOnHome && (
                  <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400">
                    Show on Home
                  </span>
                )}
              </div>

              {item.type === 'video' && (
                <div className="relative mt-5 flex aspect-video items-center justify-center overflow-hidden rounded-[24px] border border-white/6 bg-gradient-to-br from-[#181818] to-[#26170d] text-sm text-white/70">
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <span>Video thumbnail placeholder</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute left-4 bottom-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/85">
                    {item.duration || 'Video story'}
                  </div>
                </div>
              )}

              <p className="mt-5 line-clamp-5 min-h-[140px] text-sm italic leading-7 text-gray-300">“{item.quote}”</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
                <div className="admin-form-block flex items-center gap-3 rounded-[22px] p-4 min-w-0">
                  {item.avatarUrl ? (
                    <img src={item.avatarUrl} alt={item.name} className="h-12 w-12 shrink-0 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 text-sm font-bold text-white" style={{ background: `linear-gradient(135deg, ${item.avatarColor || '#c2622a'}, #ff9050)` }}>
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                    <p className="truncate text-xs text-gray-500">{item.role} · {item.company}</p>
                  </div>
                </div>

                <div className="admin-form-block rounded-[22px] px-4 py-4 text-right">
                  <p className="text-orange-400 text-xs">{'★'.repeat(Math.max(1, Math.min(5, item.stars || 5)))}</p>
                  <p className="mt-1 text-[11px] text-gray-500">{item.type === 'video' ? 'Video rating' : 'Quote rating'}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => toggleFeatured(item)} className={`rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors ${item.featuredOnHome ? 'bg-orange-500 text-white' : 'border border-white/8 bg-white/[0.04] text-gray-300 hover:bg-white/[0.08]'}`}>
                  {item.featuredOnHome ? 'Remove from Home' : 'Show on Home'}
                </button>
                <button onClick={() => openEditModal(item)} className="admin-secondary-btn rounded-xl px-3.5 py-2.5 text-xs font-medium">
                  <span className="inline-flex items-center gap-2"><FiEdit2 size={14} /> Edit</span>
                </button>
                <button onClick={() => handleDelete(item.id)} className="rounded-xl border border-red-500/18 bg-red-500/10 px-3.5 py-2.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/18">
                  <span className="inline-flex items-center gap-2"><FiTrash2 size={14} /> Delete</span>
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
        eyebrow="Testimonial editor"
        title={editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
        description="Edit quotes, video fields, client identity, and homepage visibility without changing the underlying data flow."
      >
        <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
              <div className="admin-form-block rounded-[28px] p-5 sm:p-6">
                <div className="mb-4">
                  <h3 className="text-base font-medium text-white">Content format</h3>
                  <p className="mt-1 text-sm text-gray-500">Choose between text and video, set the rating, and write the testimonial content.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Quote</label>
                  <textarea value={formData.quote || ''} onChange={(e) => setFormData({ ...formData, quote: e.target.value })} className="admin-textarea min-h-[140px] px-4 py-3 text-sm" required />
                </div>
              </div>

              <div className="admin-form-block rounded-[28px] p-5 sm:p-6">
                <div className="mb-4">
                  <h3 className="text-base font-medium text-white">Client identity</h3>
                  <p className="mt-1 text-sm text-gray-500">Add the person, company, and avatar styling shown on the testimonial cards.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Name</label>
                    <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="admin-input px-4 py-3 text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Role</label>
                    <input type="text" value={formData.role || ''} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="admin-input px-4 py-3 text-sm" required />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Company</label>
                    <input type="text" value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="admin-input px-4 py-3 text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Avatar Color</label>
                    <input type="color" value={formData.avatarColor || '#c2622a'} onChange={(e) => setFormData({ ...formData, avatarColor: e.target.value })} className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-2" />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Avatar image (optional)</label>
                  <ImageDropzone
                    value={formData.avatarUrl || ''}
                    onChange={(val) => setFormData({ ...formData, avatarUrl: val })}
                    placeholder="Drop avatar here or click to browse"
                    previewShape="square"
                  />
                </div>
              </div>

              {formData.type === 'video' && (
                <div className="admin-form-block rounded-[28px] p-5 sm:p-6">
                  <div className="mb-4">
                    <h3 className="text-base font-medium text-white">Video details</h3>
                    <p className="mt-1 text-sm text-gray-500">Attach the thumbnail, duration, and hosted video URL for video testimonials.</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Thumbnail</label>
                    <ImageDropzone
                      value={formData.thumbnailUrl || ''}
                      onChange={(val) => setFormData({ ...formData, thumbnailUrl: val })}
                      placeholder="Drop thumbnail here or click to browse"
                      previewShape="rect"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Duration</label>
                      <input type="text" value={formData.duration || ''} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="admin-input px-4 py-3 text-sm" placeholder="1:24" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Video URL</label>
                      <input type="text" value={formData.videoUrl || ''} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} className="admin-input px-4 py-3 text-sm" placeholder="Direct .mp4 or hosted video URL" />
                    </div>
                  </div>
                </div>
              )}

              <div className="admin-form-block rounded-[28px] p-5 sm:p-6">
                <label className="flex items-center gap-3 rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
                  <input type="checkbox" checked={Boolean(formData.featuredOnHome)} onChange={(e) => setFormData({ ...formData, featuredOnHome: e.target.checked })} />
                  Show on Home testimonials section
                </label>
              </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="button" onClick={() => setIsModalOpen(false)} className="admin-secondary-btn flex-1 rounded-2xl px-4 py-3 text-sm font-medium text-gray-300">Cancel</button>
            <button type="submit" className="admin-primary-btn flex-1 rounded-2xl px-4 py-3 text-sm font-semibold">{editingItem ? 'Save Changes' : 'Add Testimonial'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TestimonialsManagement;