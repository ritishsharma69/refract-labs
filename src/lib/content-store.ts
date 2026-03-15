export interface WorkItem {
  id: string;
  title: string;
  type: string;
  image: string;
  description?: string;
  link?: string;
  featuredOnHome?: boolean;
}

export interface TestimonialItem {
  id: string;
  type: 'text' | 'video';
  quote: string;
  name: string;
  role: string;
  company: string;
  stars: number;
  avatarUrl?: string;
  avatarColor?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  duration?: string;
  featuredOnHome?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  description: string;
  social: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CONTENT_UPDATED_EVENT = 'refract-content-updated';

// ── Auth helpers ──────────────────────────────────────────
export const getAuthToken = () => localStorage.getItem('adminToken') || '';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getAuthToken()}`,
});

// ── Generic fetch wrapper ─────────────────────────────────
const apiFetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
};

// ── Works ─────────────────────────────────────────────────
export const fetchWorkItems = () => apiFetch<WorkItem[]>('/works');
export const createWorkItem = (data: Omit<WorkItem, 'id'>) =>
  apiFetch<WorkItem>('/works', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) });
export const updateWorkItem = (id: string, data: Partial<WorkItem>) =>
  apiFetch<WorkItem>(`/works/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) });
export const deleteWorkItem = (id: string) =>
  apiFetch<{ message: string }>(`/works/${id}`, { method: 'DELETE', headers: authHeaders() });

// ── Testimonials ──────────────────────────────────────────
export const fetchTestimonialItems = () => apiFetch<TestimonialItem[]>('/testimonials');
export const createTestimonialItem = (data: Omit<TestimonialItem, 'id'>) =>
  apiFetch<TestimonialItem>('/testimonials', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) });
export const updateTestimonialItem = (id: string, data: Partial<TestimonialItem>) =>
  apiFetch<TestimonialItem>(`/testimonials/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) });
export const deleteTestimonialItem = (id: string) =>
  apiFetch<{ message: string }>(`/testimonials/${id}`, { method: 'DELETE', headers: authHeaders() });

// ── Team ──────────────────────────────────────────────────
export const fetchTeamMembers = () => apiFetch<TeamMember[]>('/team');
export const createTeamMember = (data: Omit<TeamMember, 'id'>) =>
  apiFetch<TeamMember>('/team', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) });
export const updateTeamMember = (id: string, data: Partial<TeamMember>) =>
  apiFetch<TeamMember>(`/team/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) });
export const deleteTeamMember = (id: string) =>
  apiFetch<{ message: string }>(`/team/${id}`, { method: 'DELETE', headers: authHeaders() });

// ── Auth ──────────────────────────────────────────────────
export const loginAdmin = async (email: string, password: string) => {
  const data = await apiFetch<{ token: string; email: string }>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('adminToken', data.token);
  localStorage.setItem('adminEmail', data.email);
  localStorage.setItem('adminAuth', 'true');
  return data;
};

export const verifyToken = async (): Promise<boolean> => {
  try {
    const data = await apiFetch<{ valid: boolean }>('/auth/verify', {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return data.valid;
  } catch {
    return false;
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminEmail');
  localStorage.removeItem('adminAuth');
};

// ── Content update event (for cross-component reactivity) ─
export const emitContentUpdate = () => {
  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT));
};

export const subscribeToContentUpdates = (listener: () => void) => {
  if (typeof window === 'undefined') return () => undefined;
  const handler = () => listener();
  window.addEventListener(CONTENT_UPDATED_EVENT, handler);
  return () => window.removeEventListener(CONTENT_UPDATED_EVENT, handler);
};