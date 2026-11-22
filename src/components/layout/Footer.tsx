import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useI18n } from '../../i18n';
import { CONTACT, LINKS } from '../../data/banking';
import { NAV_ITEMS } from '../../data/navigation';
import { fmt } from '../../utils/cx';
import { ExternalLink } from '../ui/Button';
import { Logo } from '../ui/Logo';

const linkCls = 'focus-ring-dark inline-block rounded py-0.5 underline-offset-4 transition-colors duration-200 ease-out hover:text-white hover:underline';
const REFS = ['cbar', 'cbi', 'bmi', 'adif'] as const;

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" aria-labelledby="footer-title" className="bg-ink text-sm text-white/70">
      <h2 id="footer-title" className="sr-only">
        {t.footer.contact}
      </h2>
      <div className="container-page pt-14 md:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Logo name={t.brand.name} branch={t.brand.branch} dark />
            <p className="mt-5 max-w-xs leading-relaxed">{t.footer.about}</p>
          </div>

          <nav aria-labelledby="footer-nav" className="lg:col-span-2">
            <h3 id="footer-nav" className="font-semibold text-white">
              {t.footer.navigation}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <a href={item.href} className={linkCls}>
                    {t.nav[item.key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className="font-semibold text-white">{t.footer.references}</h3>
            <ul className="mt-4 space-y-2.5">
              {REFS.map((key) => (
                <li key={key}>
                  <ExternalLink href={LINKS.references[key]} className={linkCls}>
                    {t.institution.refs[key]}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-semibold text-white">{t.footer.contact}</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span>
                  <address className="not-italic">{t.footer.address}</address>
                  <ExternalLink href={CONTACT.mapUrl} className={`mt-1 inline-block text-gold-400 ${linkCls}`}>
                    {t.footer.map}
                  </ExternalLink>
                </span>
              </li>
              {CONTACT.phones.map((p) => (
                <li key={p.href} className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden="true" />
                  <a href={p.href} dir="ltr" className={`tabular-nums ${linkCls}`}>
                    {p.display}
                  </a>
                </li>
              ))}
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden="true" />
                <a href={`mailto:${CONTACT.email}`} translate="no" className={linkCls}>
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span className="tabular-nums">{t.footer.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gold-500/40 py-6 text-[13px] leading-relaxed text-white/60">
          <p className="tabular-nums">{fmt(t.footer.legal, { year })}</p>
        </div>
      </div>
    </footer>
  );
}
