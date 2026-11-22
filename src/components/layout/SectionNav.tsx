'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { useId, useState } from 'react';
import { ChevronDown, ExternalLink as ExternalIcon } from 'lucide-react';
import { ICONS, type LucideIconName } from '@/content/icons';
import { cx } from '@/utils/cx';

export interface SectionNavItem {
  slug: string;
  href: string;
  title: string;
  icon: LucideIconName;
  external?: boolean;
  depth?: number;
}

export interface SectionNavGroup {
  label: string;
  items: SectionNavItem[];
}

/**
 * Contextual navigation: sticky sidebar on desktop, collapsible panel on phones.
 * The active page carries a moving indicator.
 */
export function SectionNav({ groups, active, label, chooseLabel }: { groups: SectionNavGroup[]; active: string; label: string; chooseLabel: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const current = groups.flatMap((g) => g.items).find((i) => i.slug === active);

  const list = (
    <div className="space-y-6">
      {groups.map((g) => (
        <div key={g.label}>
          {g.label && <p className="px-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{g.label}</p>}
          <ul className="mt-2 space-y-0.5">
            {g.items.map((item) => {
              const Icon = ICONS[item.icon];
              const isActive = item.slug === active;
              const cls = cx(
                'focus-ring relative flex min-h-10 items-center gap-2.5 rounded-lg py-2 pe-3 text-sm transition-colors duration-200 ease-out',
                item.depth ? 'ps-9' : 'ps-3',
                isActive ? 'font-semibold text-navy-900' : 'text-slate-600 hover:bg-navy-50 hover:text-navy-900',
              );
              const body = (
                <>
                  {isActive && <motion.span layoutId="section-nav-active" className="absolute inset-0 -z-10 rounded-lg bg-navy-50 ring-1 ring-inset ring-line" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  {isActive && <span aria-hidden="true" className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-gold-500" />}
                  <Icon className={cx('size-4 shrink-0', isActive ? 'text-gold-700' : 'text-slate-400')} aria-hidden="true" />
                  <span className="min-w-0 flex-1">{item.title}</span>
                  {item.external && <ExternalIcon className="size-3.5 shrink-0 text-slate-400" aria-hidden="true" />}
                </>
              );
              return (
                <li key={item.slug} className="relative isolate">
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {body}
                    </a>
                  ) : (
                    <Link href={item.href} aria-current={isActive ? 'page' : undefined} className={cls} onClick={() => setOpen(false)}>
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <nav aria-label={label}>
      <div className="lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="focus-ring flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 text-start text-sm font-semibold text-navy-900"
        >
          <span className="min-w-0 truncate">
            <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">{chooseLabel}</span>
            {current?.title}
          </span>
          <ChevronDown className={cx('size-5 shrink-0 transition-transform duration-200', open && 'rotate-180')} aria-hidden="true" />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24 }}
              className="overflow-hidden"
            >
              <div className="mt-2 rounded-xl border border-line bg-white p-2">{list}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="hidden lg:block">{list}</div>
    </nav>
  );
}
