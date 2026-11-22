import Link from 'next/link';
import { Clock, ExternalLink as ExternalIcon, Mail, MapPin, Phone } from 'lucide-react';
import type { Dictionary } from '@/i18n/az';
import { localePath, type Locale } from '@/i18n/config';
import type { NavData } from '@/content/nav';
import { CONTACT, LINKS } from '@/data/banking';
import { fmt } from '@/utils/cx';
import { Logo } from '../ui/Logo';
import { NewTabHint } from '../ui/NewTabHint';

const linkCls = 'focus-ring-dark inline-block rounded py-0.5 underline-offset-4 transition-colors duration-200 ease-out hover:text-white hover:underline';
const REFS = ['cbar', 'cbi', 'bmi', 'adif'] as const;

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-2">{children}</ul>
    </div>
  );
}

export function Footer({ t, locale, nav }: { t: Dictionary; locale: Locale; nav: NavData }) {
  const year = new Date().getFullYear();
  return (
    <footer id="contact-footer" aria-labelledby="footer-title" className="relative overflow-hidden bg-ink text-sm text-white/70">
      <h2 id="footer-title" className="sr-only">
        {t.footer.contact}
      </h2>
      <div className="container-page pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-3">
            <Logo name={t.brand.name} branch={t.brand.branch} dark />
            <p className="mt-5 max-w-xs leading-relaxed">{t.footer.about}</p>
          </div>

          <div className="lg:col-span-2">
            <Column title={t.nav.individual}>
              {nav.individual.filter((l) => !l.external).map((l) => (
                <li key={l.slug}>
                  <Link href={l.href} className={linkCls}>
                    {l.title}
                  </Link>
                </li>
              ))}
            </Column>
          </div>
          <div className="lg:col-span-2">
            <Column title={t.nav.corporate}>
              {nav.corporate.map((l) => (
                <li key={l.slug}>
                  <Link href={l.href} className={linkCls}>
                    {l.title}
                  </Link>
                </li>
              ))}
            </Column>
          </div>
          <div className="lg:col-span-2">
            <Column title={t.footer.references}>
              {REFS.map((key) => (
                <li key={key}>
                  <a href={LINKS.references[key]} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    {t.institution.refs[key]}
                    <ExternalIcon className="ms-1.5 inline size-3 align-[-1px] opacity-60" aria-hidden="true" />
                    <NewTabHint text={t.common.newTab} />
                  </a>
                </li>
              ))}
              <li>
                <Link href={localePath(locale, 'haqqimizda')} className={linkCls}>
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href={localePath(locale, 'foto-qalereya')} className={linkCls}>
                  {t.nav.gallery}
                </Link>
              </li>
            </Column>
          </div>
          <div className="lg:col-span-3">
            <Column title={t.footer.contact}>
              <li className="flex gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span>
                  <address className="not-italic">{t.footer.address}</address>
                  <a href={CONTACT.mapUrl} target="_blank" rel="noopener noreferrer" className={`mt-1 text-gold-400 ${linkCls}`}>
                    {t.footer.map}
                    <NewTabHint text={t.common.newTab} />
                  </a>
                </span>
              </li>
              {CONTACT.phones.map((p) => (
                <li key={p.href} className="flex gap-3">
                  <Phone className="mt-1 size-4 shrink-0 text-gold-400" aria-hidden="true" />
                  <a href={p.href} dir="ltr" className={`tabular-nums ${linkCls}`}>
                    {p.display}
                  </a>
                </li>
              ))}
              <li className="flex gap-3">
                <Mail className="mt-1 size-4 shrink-0 text-gold-400" aria-hidden="true" />
                <a href={`mailto:${CONTACT.email}`} translate="no" className={linkCls}>
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-1 size-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span className="tabular-nums">{t.footer.hours}</span>
              </li>
            </Column>
          </div>
        </div>

        <div className="mt-14 border-t border-gold-500/40 py-6 text-[13px] leading-relaxed text-white/60">
          <p className="tabular-nums">{fmt(t.footer.legal, { year })}</p>
        </div>
      </div>
    </footer>
  );
}
