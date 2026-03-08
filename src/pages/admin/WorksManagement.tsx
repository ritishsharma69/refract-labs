import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';

interface WorkItem {
  id: string;
  title: string;
  type: string;
  image: string;
  description?: string;
  link?: string;
}

const getStoredWorks = (): WorkItem[] => {
  const stored = localStorage.getItem('workItems');
  if (stored) return JSON.parse(stored);
  return [
    { id: '1', title: 'Color Pallet', type: 'Branding', image: '/work-1.png' },
    { id: '2', title: 'Design That Inspires', type: 'Web Design', image: '/work-2.png' },
    { id: '3', title: 'Nublink', type: 'Identity', image: '/work-3.png' },
    { id: '4', title: 'AI Platform', type: 'Software', image: '/work-4.png' },
    { id: '5', title: 'Typography System', type: 'Branding', image: '/work-5.png' },
    { id: '6', title: 'E-commerce', type: 'Web Development', image: '/work-6.png' },
  ];
};

const WorksManagement = () => {
  const [works, setWorks] = useState<WorkItem[]>(getStoredWorks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null);
  const [formData, setFormData] = useState<Partial<WorkItem>>({
    title: '', type: '', image: '', description: '', link: ''
  });

  const saveWorks = (newWorks: WorkItem[]) => {
    setWorks(newWorks);
    localStorage.setItem('workItems', JSON.stringify(newWorks));
  };

  const openAddModal = () => {
    setEditingWork(null);
    setFormData({ title: '', type: '', image: '', description: '', link: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (work: WorkItem) => {
    setEditingWork(work);
    setFormData(work);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWork) {
      const updated = works.map(w => w.id === editingWork.id ? { ...w, ...formData } : w);
      saveWorks(updated);
    } else {
      const newWork: WorkItem = {
        ...formData as WorkItem,
        id: Date.now().toString(),
      };
      saveWorks([...works, newWork]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this work?')) {
      saveWorks(works.filter(w => w.id !== id));
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

  const workTypes = ['Branding', 'Web Design', 'Web Development', 'Identity', 'Software', '3D Animation', 'UI/UX'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">Works Management</h1>
          <p className="text-gray-500 mt-1">Manage your portfolio works</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <FiPlus size={18} />
          <span>Add Work</span>
        </button>
      </div>

      {/* Works Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {works.map((work) => (
          <div key={work.id} className="bg-[#111] rounded-xl border border-white/5 overflow-hidden group">
            <div className="aspect-video bg-[#0a0a0a] relative">
              {work.image ? (
                <img src={work.image} alt={work.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-purple-500/20">
                  <span className="text-2xl font-bold text-white/20">{work.title[0]}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(work)}
                    className="p-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(work.id)}
                    className="p-3 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <span className="text-xs text-orange-400 uppercase tracking-wider">{work.type}</span>
              <h3 className="text-white font-semibold mt-1">{work.title}</h3>
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
                {editingWork ? 'Edit Work' : 'Add Work'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Cover Image</label>
                <div className="flex items-center gap-4">
                  {formData.image && (
                    <img src={formData.image} alt="" className="w-20 h-14 rounded-lg object-cover" />
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
                <label className="block text-sm text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Type</label>
                <select
                  value={formData.type || ''}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white"
                  required
                >
                  <option value="">Select type</option>
                  {workTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Description (Optional)</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Project Link (Optional)</label>
                <input
                  type="text"
                  value={formData.link || ''}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white"
                  placeholder="https://..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-white/10 text-gray-400 rounded-lg hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
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

