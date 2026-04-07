import { useState, useEffect } from 'react';
import { FiTrash2, FiMail, FiPhone, FiUser, FiClock, FiCheckCircle } from 'react-icons/fi';
import { fetchLeads, deleteLead, markLeadRead, type LeadItem } from '../../lib/content-store';

const LeadsManagement = () => {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const loadLeads = async () => {
    try { setLeads(await fetchLeads()); } catch { /* ignore */ }
  };

  useEffect(() => { loadLeads(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this lead?')) {
      try { await deleteLead(id); await loadLeads(); } catch { /* ignore */ }
    }
  };

  const handleMarkRead = async (id: string) => {
    try { await markLeadRead(id); await loadLeads(); } catch { /* ignore */ }
  };

  const filteredLeads = leads.filter((l) => {
    if (filter === 'unread') return !l.read;
    if (filter === 'read') return l.read;
    return true;
  });

  const unreadCount = leads.filter((l) => !l.read).length;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <section className="admin-surface rounded-[34px] p-6 sm:p-8 xl:p-10">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div className="max-w-3xl">
            <span className="admin-chip">Leads</span>
            <h1 className="mt-5 text-3xl font-bold text-white font-['Space_Grotesk'] sm:text-4xl xl:text-[44px]">
              Incoming leads from the contact form.
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              Every form submission from the website lands here. Review, follow up, and manage all leads in one place.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Total leads', value: leads.length },
              { label: 'Unread', value: unreadCount },
              { label: 'Read', value: leads.length - unreadCount },
            ].map((item) => (
              <div key={item.label} className="admin-form-block rounded-[26px] px-5 py-5">
                <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mt-8 flex gap-3 border-t border-white/8 pt-6">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                  : 'text-gray-400 border border-white/8 hover:bg-white/5'
              }`}
            >
              {f} {f === 'unread' && unreadCount > 0 && `(${unreadCount})`}
            </button>
          ))}
        </div>
      </section>

      {/* Lead cards */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="admin-empty-state col-span-full rounded-[32px] px-6 py-14 text-center sm:px-10">
            <p className="text-[11px] uppercase tracking-[0.28em] text-gray-500">Leads</p>
            <h3 className="mt-4 text-2xl font-semibold text-white font-['Space_Grotesk']">
              {filter === 'all' ? 'No leads yet.' : `No ${filter} leads.`}
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-400">
              When someone submits the contact form on your website, their details will appear here.
            </p>
          </div>
        ) : filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className={`admin-grid-card rounded-[24px] p-6 transition-all ${
              !lead.read ? 'border-l-4 border-l-orange-400' : ''
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    lead.read ? 'bg-gray-700 text-gray-400' : 'bg-orange-500/20 text-orange-300'
                  }`}>
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FiUser size={14} className="text-gray-500" /> {lead.name}
                      {!lead.read && (
                        <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">NEW</span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <FiClock size={11} /> {formatDate(lead.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-sky-400 hover:underline">
                    <FiMail size={14} /> {lead.email}
                  </a>
                  <a href={`tel:${lead.mobile}`} className="flex items-center gap-1.5 text-green-400 hover:underline">
                    <FiPhone size={14} /> {lead.mobile}
                  </a>
                </div>

                {lead.message && (
                  <p className="text-sm leading-7 text-gray-400 mt-1">
                    "{lead.message}"
                  </p>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                {!lead.read && (
                  <button
                    onClick={() => handleMarkRead(lead.id)}
                    className="admin-secondary-btn flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-green-400 hover:bg-green-500/10"
                    title="Mark as read"
                  >
                    <FiCheckCircle size={16} /> Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(lead.id)}
                  className="rounded-xl border border-red-500/18 bg-black/45 p-2.5 text-red-300 transition-colors hover:bg-red-500/18"
                  title="Delete lead"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadsManagement;
