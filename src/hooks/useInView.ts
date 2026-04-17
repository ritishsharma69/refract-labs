import { useEffect, useRef, useState, type RefObject } from 'react';

interface Options {
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

// IntersectionObserver-backed hook so expensive animations / mounts can be
// gated to when a section is actually on (or near) the viewport.
const useInView = <T extends Element = HTMLElement>(
  options: Options = {},
): [RefObject<T | null>, boolean] => {
  const { rootMargin = '200px 0px', threshold = 0, once = false } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, inView];
};

export default useInView;
