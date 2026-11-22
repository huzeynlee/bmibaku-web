import { Calculator, FileSearch, Lock } from 'lucide-react';
import { useI18n } from '../../i18n';
import { LINKS } from '../../data/banking';
import { NAV_ITEMS } from '../../data/navigation';
import { Drawer } from '../ui/Drawer';
import { ButtonLink, ExternalLink } from '../ui/Button';
import { corporateLinks, individualLinks } from './serviceLinks';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();

  return (
    <Drawer open={open} onClose={onClose} labelledBy="mobile-menu-title" closeLabel={t.nav.closeMenu}>
      <div className="border-b border-line px-5 pb-4 pe-16 pt-5">
        <h2 id="mobile-menu-title" className="text-lg font-bold text-navy-900">
          {t.nav.menu}
        </h2>
      </div>
      <nav aria-label={t.nav.main} className="flex-1 px-3 py-3">
        <ul>
          {NAV_ITEMS.map((item) => {
            const sub = item.menu === 'individual' ? individualLinks(t) : item.menu === 'corporate' ? corporateLinks(t) : [];
            return (
              <li key={item.key}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className="focus-ring flex h-12 items-center rounded-lg px-3 text-base font-semibold text-navy-900 hover:bg-navy-50"
                >
                  {t.nav[item.key]}
                </a>
                {sub.length > 0 && (
                  <ul className="mb-2 ms-3 border-s border-line ps-2">
                    {sub.map((l) => (
                      <li key={l.key}>
                        <a
                          href={l.href}
                          className="focus-ring flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-[15px] text-slate-700 hover:bg-navy-50"
                        >
                          <l.icon className="size-4 shrink-0 text-gold-700" aria-hidden="true" />
                          {l.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
        <ul className="mt-3 border-t border-line pt-3">
          <li>
            <ExternalLink
              href={LINKS.concessionCalculator}
              showIcon={false}
              className="focus-ring flex min-h-11 items-center gap-3 rounded-lg px-3 text-[15px] text-slate-700 hover:bg-navy-50"
            >
              <Calculator className="size-4 shrink-0" aria-hidden="true" />
              {t.util.concession}
            </ExternalLink>
          </li>
          <li>
            <ExternalLink
              href={LINKS.creditRegistry}
              showIcon={false}
              className="focus-ring flex min-h-11 items-center gap-3 rounded-lg px-3 text-[15px] text-slate-700 hover:bg-navy-50"
            >
              <FileSearch className="size-4 shrink-0" aria-hidden="true" />
              {t.util.registry}
            </ExternalLink>
          </li>
        </ul>
      </nav>
      <div className="sticky bottom-0 border-t border-line bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <ButtonLink href={LINKS.internetBanking} variant="primary" size="lg" className="w-full">
          <Lock className="size-4 text-gold-400" aria-hidden="true" />
          {t.nav.ib}
        </ButtonLink>
      </div>
    </Drawer>
  );
}
