'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Calculator, ChevronDown, FileSearch, Lock } from 'lucide-react';
import { useI18n } from '@/i18n/client';
import type { NavData, NavLink } from '@/content/nav';
import { ICONS } from '@/content/icons';
import { LINKS } from '@/data/banking';
import { cx } from '@/utils/cx';
import { Drawer } from '../ui/Drawer';
import { buttonClass } from '../ui/buttonClass';
import { LanguageSwitcher } from './LanguageSwitcher';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  nav: NavData;
  items: { key: string; href: string; label: string; menu?: 'individual' | 'corporate' | 'about' }[];
}

function SubLink({ link, onClose }: { link: NavLink; onClose: () => void }) {
  const Icon = ICONS[link.icon];
  const cls = 'focus-ring flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-[15px] text-slate-700 hover:bg-navy-50';
  const body = (
    <>
      <Icon className="size-4 shrink-0 text-gold-700" aria-hidden="true" />
      {link.title}
    </>
  );
  return link.external ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
    </a>
  ) : (
    <Link href={link.href} onClick={onClose} className={cls}>
      {body}
    </Link>
  );
}

export function MobileMenu({ open, onClose, nav, items }: MobileMenuProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Drawer open={open} onClose={onClose} labelledBy="mobile-menu-title" closeLabel={t.nav.closeMenu}>
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 pb-4 pe-16 pt-5">
        <h2 id="mobile-menu-title" className="text-lg font-bold text-navy-900">
          {t.nav.menu}
        </h2>
        <LanguageSwitcher dark={false} />
      </div>
      <nav aria-label={t.nav.main} className="flex-1 px-3 py-3">
        <ul>
          {items.map((item) => {
            const sub = item.menu === 'about' ? nav.institution.flatMap((g) => g.items) : item.menu ? nav[item.menu] : [];
            const isOpen = expanded === item.key;
            return (
              <li key={item.key}>
                <div className="flex items-center">
                  <Link href={item.href} onClick={onClose} className="focus-ring flex h-12 flex-1 items-center rounded-lg px-3 text-base font-semibold text-navy-900 hover:bg-navy-50">
                    {item.label}
                  </Link>
                  {sub.length > 0 && (
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-label={t.nav.submenu.replace('{label}', item.label)}
                      onClick={() => setExpanded(isOpen ? null : item.key)}
                      className="focus-ring grid size-11 place-items-center rounded-lg text-slate-500 hover:bg-navy-50"
                    >
                      <ChevronDown className={cx('size-5 transition-transform duration-200', isOpen && 'rotate-180')} aria-hidden="true" />
                    </button>
                  )}
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24 }}
                      className="mb-2 ms-3 overflow-hidden border-s border-line ps-2"
                    >
                      {sub.map((l) => (
                        <li key={l.slug}>
                          <SubLink link={l} onClose={onClose} />
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
        <ul className="mt-3 border-t border-line pt-3">
          {nav.tools.map((l) => (
            <li key={l.slug}>
              <SubLink link={l} onClose={onClose} />
            </li>
          ))}
          <li>
            <a href={LINKS.concessionCalculator} target="_blank" rel="noopener noreferrer" className="focus-ring flex min-h-11 items-center gap-3 rounded-lg px-3 text-[15px] text-slate-700 hover:bg-navy-50">
              <Calculator className="size-4 shrink-0" aria-hidden="true" />
              {t.util.concession}
            </a>
          </li>
          <li>
            <a href={LINKS.creditRegistry} target="_blank" rel="noopener noreferrer" className="focus-ring flex min-h-11 items-center gap-3 rounded-lg px-3 text-[15px] text-slate-700 hover:bg-navy-50">
              <FileSearch className="size-4 shrink-0" aria-hidden="true" />
              {t.util.registry}
            </a>
          </li>
        </ul>
      </nav>
      <div className="sticky bottom-0 border-t border-line bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <a href={LINKS.internetBanking} className={buttonClass('primary', 'lg', 'w-full')}>
          <Lock className="size-4 text-gold-400" aria-hidden="true" />
          {t.nav.ib}
        </a>
      </div>
    </Drawer>
  );
}
