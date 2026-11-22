import { useEffect, useState } from 'react';

/** Id of the section crossing the middle band of the viewport. */
export function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');

  useEffect(() => {
    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        const last = visible[visible.length - 1];
        if (last) setActive(last.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return active;
}

/** True once the page has scrolled past `offset` pixels. */
export function useScrolled(offset = 24): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);
  return scrolled;
}
