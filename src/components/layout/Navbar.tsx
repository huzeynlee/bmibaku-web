import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Lock, Menu } from 'lucide-react';
import { useI18n } from '../../i18n';
import { LINKS } from '../../data/banking';
import { NAV_ITEMS, type NavItem } from '../../data/navigation';
import { useActiveSection, useScrolled } from '../../hooks/useActiveSection';
import { cx, fmt } from '../../utils/cx';
import { ButtonLink } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { MobileMenu } from './MobileMenu';
import { corporateLinks, individualLinks, type ServiceLink } from './serviceLinks';

const SECTION_IDS = NAV_ITEMS.flatMap((i) => (i.sectionId ? [i.sectionId] : []));

const linkClass = (active: boolean) =>
  cx(
    'focus-ring relative inline-flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors duration-200 ease-out',
    'after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:transition-opacity after:duration-200',
    active ? 'text-navy-900 after:bg-gold-500 after:opacity-100' : 'text-slate-600 after:opacity-0 hover:text-navy-900',
  );

/** Section link plus a disclosure button that reveals the service links. */
function NavDropdown({ item, label, links, active }: { item: NavItem; label: string; links: ServiceLink[]; active: boolean }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  return (
    <li
      ref={rootRef}
      className="relative flex items-center"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <a href={item.href} aria-current={active ? 'true' : undefined} className={cx(linkClass(active), 'pe-1')}>
        {label}
      </a>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={fmt(t.nav.submenu, { label })}
        onClick={() => setOpen((v) => !v)}
        className="focus-ring grid size-8 place-items-center rounded-md text-slate-500 transition-colors duration-200 ease-out hover:bg-navy-50 hover:text-navy-900"
      >
        <ChevronDown className={cx('size-4 transition-transform duration-200 ease-out', open && 'rotate-180')} aria-hidden="true" />
      </button>
      <div
        id={panelId}
        className={cx(
          'absolute start-0 top-full z-50 mt-2 w-[22rem] rounded-xl border border-line bg-white p-2 shadow-xl shadow-navy-900/10',
          'transition-[opacity,transform,visibility] duration-200 ease-out',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0',
        )}
      >
        <ul>
          {links.map((l) => (
            <li key={l.key}>
              <a
                href={l.href}
                className="focus-ring flex items-start gap-3 rounded-lg p-3 transition-colors duration-200 ease-out hover:bg-navy-50"
              >
                <l.icon className="mt-0.5 size-[18px] shrink-0 text-gold-700" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-semibold text-navy-900">{l.title}</span>
                  <span className="mt-0.5 block text-[13px] text-slate-500">{l.desc}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a
          href={item.href}
          onClick={() => setOpen(false)}
          className="focus-ring mt-1 flex rounded-lg border-t border-line px-3 py-2.5 text-sm font-semibold text-navy-900 hover:bg-navy-50"
        >
          {t.nav.goToSection}
        </a>
      </div>
    </li>
  );
}

export function Navbar() {
  const { t } = useI18n();
  const scrolled = useScrolled(40);
  const active = useActiveSection(SECTION_IDS);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={cx(
        'sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-200 ease-out',
        scrolled
          ? 'border-line bg-white/85 shadow-[0_1px_12px_rgb(15_23_42/0.06)] backdrop-blur-xl'
          : 'border-transparent bg-surface',
      )}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#top" className="focus-ring min-w-0 rounded-lg">
          <Logo name={t.brand.name} branch={t.brand.branch} />
          <span className="sr-only">, {t.brand.home}</span>
        </a>

        <nav aria-label={t.nav.main} className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const label = t.nav[item.key];
              const isActive = !!item.sectionId && active === item.sectionId;
              if (item.menu) {
                const links = item.menu === 'individual' ? individualLinks(t) : corporateLinks(t);
                return <NavDropdown key={item.key} item={item} label={label} links={links} active={isActive} />;
              }
              return (
                <li key={item.key}>
                  <a href={item.href} aria-current={isActive ? 'true' : undefined} className={linkClass(isActive)}>
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ButtonLink href={LINKS.internetBanking} variant="primary" size="md" className="hidden sm:inline-flex">
            <Lock className="size-4 text-gold-400" aria-hidden="true" />
            {t.nav.ib}
          </ButtonLink>
          <button
            type="button"
            aria-label={t.nav.openMenu}
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(true)}
            className="focus-ring grid size-11 place-items-center rounded-lg text-navy-900 transition-colors duration-200 ease-out hover:bg-navy-50 lg:hidden"
          >
            <Menu className="size-6" aria-hidden="true" />
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
