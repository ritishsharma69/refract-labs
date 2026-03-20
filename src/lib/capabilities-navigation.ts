import { getLenisInstance } from '../hooks/useSmoothScroll';

export const CAPABILITIES_HASH = '#capabilities';
export const CAPABILITIES_ROUTE = `/about${CAPABILITIES_HASH}`;

export const scrollToCapabilitiesSection = (target?: HTMLElement | null) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const element = target ?? document.getElementById('capabilities');
  if (!element) return;

  const navbarOffset = window.innerWidth < 768 ? 82 : 90;
  const lenis = getLenisInstance();

  if (lenis) {
    lenis.scrollTo(element, { offset: -navbarOffset, duration: 1.1 });
    return;
  }

  const sectionTop = element.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: Math.max(sectionTop - navbarOffset, 0), behavior: 'smooth' });
};