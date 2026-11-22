import { ArrowUpRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { SectionHeader } from '../ui/SectionHeader';
import { quickLinks } from '../layout/serviceLinks';

export function QuickServices() {
  const { t } = useI18n();
  return (
    <section id="services" aria-labelledby="services-title" className="section-y">
      <div className="container-page">
        <SectionHeader id="services-title" eyebrow={t.services.eyebrow} title={t.services.title} />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {quickLinks(t).map((l) => (
            <li key={l.key}>
              <a
                href={l.href}
                className="focus-ring group flex h-full flex-col gap-8 rounded-xl border border-line bg-white p-5 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-navy-900/25 hover:shadow-[0_12px_28px_-18px_rgb(11_31_58/0.35)]"
              >
                <span className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-lg bg-navy-900 text-gold-400">
                    <l.icon className="size-5" aria-hidden="true" />
                  </span>
                  <ArrowUpRight
                    className="size-5 text-slate-400 transition-colors duration-200 ease-out group-hover:text-navy-900 rtl:-scale-x-100"
                    aria-hidden="true"
                  />
                </span>
                <span>
                  <span className="block font-semibold text-navy-900">{l.title}</span>
                  <span className="mt-1 block text-sm text-slate-600">{l.desc}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
