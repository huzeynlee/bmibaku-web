'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import type { ImageItem } from '@/content/types';
import { useI18n } from '@/i18n/client';
import { fmt } from '@/utils/cx';

/**
 * Editorial grid of the bank's own photos with a keyboard-accessible lightbox
 * (native <dialog>: focus trap, Esc; arrows switch photos).
 */
export function Gallery({ images, title }: { images: ImageItem[]; title?: string | null }) {
  const { t, dir } = useI18n();
  const [index, setIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);

  const show = useCallback(
    (next: number) => {
      setDirection(next > (index ?? 0) ? 1 : -1);
      setIndex((next + images.length) % images.length);
    },
    [images.length, index],
  );

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
    document.documentElement.style.overflow = index !== null ? 'hidden' : '';
  }, [index]);

  const onKey = (e: React.KeyboardEvent) => {
    if (index === null) return;
    const nextKey = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === nextKey) show(index + 1);
    if (e.key === prevKey) show(index - 1);
  };

  const current = index !== null ? images[index] : null;

  return (
    <div>
      {title && <h3 className="mb-4 text-lg font-bold text-navy-900">{title}</h3>}
      <ul className="columns-1 gap-3 sm:columns-2 lg:columns-3 [&>li]:mb-3">
        {images.map((img, i) => (
          <motion.li
            key={img.src}
            data-reveal=""
            className="break-inside-avoid"
            initial={{ opacity: 0, clipPath: 'inset(8% 8% 8% 8% round 12px)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 12px)' }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={() => show(i)}
              className="focus-ring group relative block w-full overflow-hidden rounded-xl bg-navy-50"
              aria-label={fmt(t.gallery.open, { n: i + 1 })}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt || fmt(t.gallery.photo, { n: i + 1 })} loading="lazy" decoding="async" className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
              <span aria-hidden="true" className="absolute inset-0 grid place-items-center bg-navy-950/0 text-white opacity-0 transition-[opacity,background-color] duration-300 group-hover:bg-navy-950/30 group-hover:opacity-100">
                <ZoomIn className="size-7" />
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={title || t.nav.gallery}
        onCancel={(e) => {
          e.preventDefault();
          setIndex(null);
        }}
        onKeyDown={onKey}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-navy-950/95 p-0 text-white backdrop:bg-navy-950/80"
      >
        {current && (
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 text-sm text-white/75 sm:px-6">
              <span className="tabular-nums" aria-live="polite">
                {fmt(t.gallery.counter, { i: (index ?? 0) + 1, n: images.length })}
              </span>
              <button type="button" onClick={() => setIndex(null)} aria-label={t.gallery.close} className="focus-ring-dark grid size-11 place-items-center rounded-full hover:bg-white/10">
                <X className="size-6" aria-hidden="true" />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.img
                  key={current.src}
                  src={current.src}
                  alt={current.alt || fmt(t.gallery.photo, { n: (index ?? 0) + 1 })}
                  custom={direction}
                  initial={{ opacity: 0, x: 40 * direction }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 * direction }}
                  transition={{ duration: 0.3 }}
                  className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                />
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button type="button" onClick={() => show((index ?? 0) - 1)} aria-label={t.gallery.prev} className="focus-ring-dark absolute start-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:start-6">
                    <ChevronLeft className="size-6 rtl:rotate-180" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => show((index ?? 0) + 1)} aria-label={t.gallery.next} className="focus-ring-dark absolute end-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:end-6">
                    <ChevronRight className="size-6 rtl:rotate-180" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
