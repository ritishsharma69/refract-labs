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

const WORKS_KEY = 'workItems';
const TESTIMONIALS_KEY = 'testimonialItems';
const CONTENT_UPDATED_EVENT = 'refract-content-updated';

export const DEFAULT_WORK_ITEMS: WorkItem[] = [
  {
    id: '1',
    title: 'Project Aether',
    type: 'Visual Engineering',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    description: 'Zero-latency interfaces crafted for premium digital commerce.',
    link: '#',
    featuredOnHome: true,
  },
  {
    id: '2',
    title: 'Project Sentinel',
    type: 'System Architecture',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    description: 'Biometric identity systems built around trust and usability.',
    link: '#',
    featuredOnHome: true,
  },
  {
    id: '3',
    title: 'Project Cortex',
    type: 'Intelligent Interfaces',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    description: 'Adaptive product experiences for AI-native workflows.',
    link: '#',
    featuredOnHome: true,
  },
  {
    id: '4',
    title: 'Project Flux',
    type: 'Identity Systems',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80',
    description: 'Design systems engineered for consistency at infinite scale.',
    link: '#',
    featuredOnHome: true,
  },
  {
    id: '5',
    title: 'Project Atlas',
    type: 'Branding',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    description: 'Brand worlds with sharper storytelling and stronger recall.',
    link: '#',
    featuredOnHome: false,
  },
  {
    id: '6',
    title: 'Project Nova',
    type: 'Web Development',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    description: 'Conversion-first web platforms designed for fast growth.',
    link: '#',
    featuredOnHome: false,
  },
];

export const DEFAULT_TESTIMONIAL_ITEMS: TestimonialItem[] = [
  { id: '1', type: 'text', quote: '"Working with this team completely transformed how we present our brand online. The attention to detail is unmatched."', name: 'Arjun Mehta', role: 'Founder', company: 'NovaTech', stars: 5, avatarColor: '#c2622a', featuredOnHome: true },
  { id: '2', type: 'text', quote: '"Delivered ahead of schedule with zero compromises on quality. Our conversion rate went up 40% within the first month."', name: 'Priya Singh', role: 'Marketing Director', company: 'Luminary Co', stars: 5, avatarColor: '#6644bb', featuredOnHome: true },
  { id: '3', type: 'text', quote: '"I have worked with many agencies but none matched this level of craft and communication. Truly a premium experience."', name: 'Rohit Sharma', role: 'CEO', company: 'Apex Studio', stars: 5, avatarColor: '#226644', featuredOnHome: true },
  { id: '4', type: 'text', quote: '"The team understood our vision on the first call itself. What they built exceeded every expectation we had."', name: 'Sarah Mitchell', role: 'Product Head', company: 'Orbit Labs', stars: 5, avatarColor: '#aa3344', featuredOnHome: true },
  { id: '5', type: 'text', quote: '"Fast, professional, and genuinely talented. The final product speaks for itself."', name: 'Vikram Nair', role: 'Co-Founder', company: 'Stealth Ventures', stars: 5, avatarColor: '#884422', featuredOnHome: false },
  { id: '6', type: 'video', quote: '"They brought clarity, speed, and a premium digital presence we finally feel proud to share."', name: 'Tanner Balisky', role: 'CEO', company: 'Bad Birdie', stars: 5, avatarColor: '#224488', duration: '1:24', thumbnailUrl: '', videoUrl: '', featuredOnHome: false },
  { id: '7', type: 'video', quote: '"Every milestone felt intentional. The team moved fast and never sacrificed quality."', name: 'James Ortega', role: 'Director', company: 'Nova Labs', stars: 5, avatarColor: '#448822', duration: '2:10', thumbnailUrl: '', videoUrl: '', featuredOnHome: false },
];

const readCollection = <T,>(key: string, fallback: T[]): T[] => {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T[]) : fallback;
  } catch {
    return fallback;
  }
};

const writeCollection = <T,>(key: string, value: T[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT));
};

export const getWorkItems = () => readCollection(WORKS_KEY, DEFAULT_WORK_ITEMS);
export const saveWorkItems = (items: WorkItem[]) => writeCollection(WORKS_KEY, items);
export const getHomeFeaturedWorks = () => getWorkItems().filter((item) => item.featuredOnHome).slice(0, 4);

export const getTestimonialItems = () => readCollection(TESTIMONIALS_KEY, DEFAULT_TESTIMONIAL_ITEMS);
export const saveTestimonialItems = (items: TestimonialItem[]) => writeCollection(TESTIMONIALS_KEY, items);
export const getHomeFeaturedTestimonials = () => getTestimonialItems().filter((item) => item.featuredOnHome).slice(0, 4);

export const subscribeToContentUpdates = (listener: () => void) => {
  if (typeof window === 'undefined') return () => undefined;

  const handleEvent = () => listener();
  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === WORKS_KEY || event.key === TESTIMONIALS_KEY) {
      listener();
    }
  };

  window.addEventListener(CONTENT_UPDATED_EVENT, handleEvent);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(CONTENT_UPDATED_EVENT, handleEvent);
    window.removeEventListener('storage', handleStorage);
  };
};