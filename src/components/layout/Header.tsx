'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, ExternalLink as ExternalIcon, Lock, Menu } from 'lucide-react';
import { useI18n } from '@/i18n/client';
import { localePath, stripLocale } from '@/i18n/config';
import { getRoute } from '@/content/routes';
import { ICONS } from '@/content/icons';
import type { NavData, NavLink } from '@/content/nav';
import { LINKS } from '@/data/banking';
import { cx } from '@/utils/cx';
import { buttonClass } from '../ui/buttonClass';
import { Logo } from '../ui/Logo';
import { MobileMenu } from './MobileMenu';

type TopKey = 'home' | 'individual' | 'corporate' | 'about' | 'gallery' | 'contact';
type MenuKey = 'individual' | 'corporate' | 'about';

function activeTop(pathname: string): TopKey | null {
  const slug = stripLocale(pathname).split('/').filter(Boolean)[0];
  if (!slug) return 'home';
  const section = getRoute(slug)?.section;
  if (section === 'individual' || section === 'corporate') return section;
  if (section === 'institution' || section === 'property') return 'about';
  if (section === 'gallery') return 'gallery';
  if (section === 'contact') return 'contact';
  return null;
}

function MenuLink({ link, onNavigate }: { link: NavLink; onNavigate: () => void }) {
  const Icon = ICONS[link.icon];
  const inner = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-white text-navy-900 transition-colors duration-200 ease-out group-hover:border-gold-500/60 group-hover:text-gold-700">
        <Icon className="size-[18px]" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 text-sm font-medium text-navy-900">{link.title}</span>
      {link.external ? (
        <ExternalIcon className="size-3.5 text-slate-400" aria-hidden="true" />
      ) : (
        <ArrowRight className="size-3.5 -translate-x-1 text-gold-700 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 rtl:rotate-180" aria-hidden="true" />
      )}
    </>
  );
  const cls = 'focus-ring group flex items-center gap-3 rounded-lg p-2 transition-colors duration-200 ease-out hover:bg-navy-50';
  return link.external ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls} onClick={onNavigate}>
      {inner}
    </a>
  ) : (
    <Link href={link.href} className={cls} onClick={onNavigate}>
      {inner}
    </Link>
  );
}

export function Header({ nav }: { nav: NavData }) {
  const { t, locale } = useI18n();
  const pathname = usePathname() || '/';
  const current = activeTop(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const panelId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null);
        headerRef.current?.querySelector<HTMLButtonElement>(`[data-menu="${open}"]`)?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const hoverOpen = useCallback((key: MenuKey | null) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpen(key), key ? 90 : 160);
  }, []);
  const fine = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const items: { key: TopKey; href: string; label: string; menu?: MenuKey }[] = [
    { key: 'home', href: localePath(locale), label: t.nav.home },
    { key: 'individual', href: localePath(locale, 'ferdi-bankciliq'), label: t.nav.individual, menu: 'individual' },
    { key: 'corporate', href: localePath(locale, 'korporativ-bankciliq'), label: t.nav.corporate, menu: 'corporate' },
    { key: 'about', href: localePath(locale, 'haqqimizda'), label: t.nav.about, menu: 'about' },
    { key: 'gallery', href: localePath(locale, 'foto-qalereya'), label: t.nav.gallery },
    { key: 'contact', href: localePath(locale, 'contact'), label: t.nav.contact },
  ];

  const close = () => setOpen(null);

  return (
    <header
      ref={headerRef}
      onPointerLeave={() => fine() && open && hoverOpen(null)}
      className={cx(
        'sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300 ease-out',
        scrolled || open ? 'border-line bg-white/85 shadow-[0_1px_16px_rgb(15_23_42/0.06)] backdrop-blur-xl' : 'border-transparent bg-surface/60 backdrop-blur-sm',
      )}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Link href={localePath(locale)} className="focus-ring block min-w-0 rounded-lg">
            <Logo name={t.brand.name} branch={t.brand.branch} />
            <span className="sr-only">, {t.brand.home}</span>
          </Link>
        </motion.div>

        <nav aria-label={t.nav.main} className="hidden xl:block">
          <motion.ul
            className="flex items-center gap-0.5"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
          >
            {items.map((item) => {
              const active = current === item.key;
              const expanded = open === item.menu;
              return (
                <motion.li
                  key={item.key}
                  data-reveal=""
                  className="relative flex items-center"
                  variants={{ hidden: { opacity: 0, y: -6 }, show: { opacity: 1, y: 0 } }}
                  onPointerEnter={() => fine() && hoverOpen(item.menu ?? null)}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cx(
                      'focus-ring relative inline-flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors duration-200 ease-out',
                      item.menu && 'pe-1',
                      active || expanded ? 'text-navy-900' : 'text-slate-600 hover:text-navy-900',
                    )}
                  >
                    {item.label}
                    {active && (
                      <motion.span layoutId="nav-active" className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-gold-500" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
                    )}
                  </Link>
                  {item.menu && (
                    <button
                      type="button"
                      data-menu={item.menu}
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      aria-label={t.nav.submenu.replace('{label}', item.label)}
                      onClick={() => setOpen(expanded ? null : item.menu!)}
                      className="focus-ring grid size-8 place-items-center rounded-md text-slate-500 transition-colors duration-200 ease-out hover:bg-navy-50 hover:text-navy-900"
                    >
                      <ChevronDown className={cx('size-4 transition-transform duration-200 ease-out', expanded && 'rotate-180')} aria-hidden="true" />
                    </button>
                  )}
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <motion.a
            href={LINKS.internetBanking}
            className={buttonClass('primary', 'md', 'hidden sm:inline-flex')}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Lock className="size-4 text-gold-400" aria-hidden="true" />
            {t.nav.ib}
          </motion.a>
          <button
            type="button"
            aria-label={t.nav.openMenu}
            aria-haspopup="dialog"
            onClick={() => setMobileOpen(true)}
            className="focus-ring grid size-11 place-items-center rounded-lg text-navy-900 transition-colors duration-200 ease-out hover:bg-navy-50 xl:hidden"
          >
            <Menu className="size-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mega"
            id={panelId}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_24px_48px_-24px_rgb(11_31_58/0.25)] xl:block"
          >
            <div className="container-page grid grid-cols-12 gap-8 py-8">
              <div className="col-span-3 border-e border-line pe-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-700">
                  {open === 'about' ? t.sections.institution.eyebrow : t.sections[open].eyebrow}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {open === 'about' ? t.sections.institution.intro : t.sections[open].intro}
                </p>
                <Link
                  href={items.find((i) => i.menu === open)!.href}
                  onClick={close}
                  className="focus-ring group mt-5 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-navy-900"
                >
                  {t.nav.overview}
                  <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
              {open === 'about' ? (
                <div className="col-span-9 grid grid-cols-4 gap-6">
                  {nav.institution.map((g) => (
                    <div key={g.group}>
                      <p className="px-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{g.label}</p>
                      <ul className="mt-2 space-y-0.5">
                        {g.items.map((l) => (
                          <li key={l.slug}>
                            <MenuLink link={l} onNavigate={close} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="col-span-9 grid grid-cols-3 gap-1">
                  {nav[open].map((l) => (
                    <li key={l.slug}>
                      <MenuLink link={l} onNavigate={close} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} nav={nav} items={items} />
    </header>
  );
}
