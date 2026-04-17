import { useSyncExternalStore } from 'react';

// matchMedia fires only when crossing the breakpoint, not on every resize pixel.
// Also deduped across components via useSyncExternalStore so one subscription is shared.
const MOBILE_QUERY = '(max-width: 767px)';

const subscribe = (callback: () => void) => {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
};

const getSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;
const getServerSnapshot = () => false;

const useIsMobile = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export default useIsMobile;
