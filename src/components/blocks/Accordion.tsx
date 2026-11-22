'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useId, useState, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { cx } from '@/utils/cx';

/** Disclosure list with height animation. Buttons follow the WAI-ARIA accordion pattern. */
export function Accordion({ items, defaultOpen = 0 }: { items: { title: string; content: ReactNode }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();
  return (
    <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                id={`${base}-b${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="focus-ring group flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-[15px] font-semibold text-navy-900 transition-colors duration-200 hover:bg-slate-50"
              >
                <span>{item.title}</span>
                <span className={cx('grid size-8 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color] duration-300 ease-out', isOpen ? 'rotate-45 border-navy-900 bg-navy-900 text-gold-400' : 'border-line text-navy-900')}>
                  <Plus className="size-4" aria-hidden="true" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${base}-p${i}`}
                  role="region"
                  aria-labelledby={`${base}-b${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-1">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
