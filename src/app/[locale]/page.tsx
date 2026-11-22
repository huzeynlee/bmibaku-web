import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { History } from 'lucide-react';
import { LOCALES, isLocale, localePath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { HERITAGE_YEARS } from '@/data/banking';
import { getLatestRates } from '@/lib/rates';
import { SITE_URL } from '@/lib/site';
import { HomeHero } from '@/components/home/HomeHero';
import { Metrics, News, QuickServices, SectionHead, Segments } from '@/components/home/HomeSections';
import { RatesPanel } from '@/components/banking/RatesPanel';
import { LoanCalculator } from '@/components/banking/LoanCalculator';
import { CtaBand } from '@/components/templates/shared';
import { buttonClass } from '@/components/ui/buttonClass';

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const languages = Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}${localePath(l)}`]));
  return {
    title: { absolute: getDictionary(locale).meta.title },
    alternates: { canonical: `${SITE_URL}${localePath(locale)}`, languages: { ...languages, 'x-default': languages.az! } },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { data: rates, error } = await getLatestRates();
  const usd = rates.items.find((i) => i.code === 'USD')?.cash?.sell;

  return (
    <>
      <HomeHero years={HERITAGE_YEARS} />
      <Metrics t={t} locale={locale} />

      <section id="rates" aria-labelledby="rates-title" className="section-y">
        <div className="container-page">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHead id="rates-title" eyebrow={t.rates.eyebrow} title={t.rates.title} lead={t.rates.lead} />
            <Link href={localePath(locale, 'valyuta-tarixcesi')} className={buttonClass('secondary', 'md', 'self-start md:self-auto')}>
              <History className="size-4" aria-hidden="true" />
              {t.rates.history}
            </Link>
          </div>
          <div className="mt-8">
            <RatesPanel data={rates} error={error} />
          </div>
        </div>
      </section>

      <section id="calculator" aria-labelledby="calc-title" className="section-y border-t border-line bg-white">
        <div className="container-page">
          <SectionHead id="calc-title" eyebrow={t.home.calculatorEyebrow} title={t.home.calculatorTitle} lead={t.home.calculatorLead} />
          <div className="mt-10">
            <LoanCalculator usdSell={usd ? Number(usd) : null} compact />
          </div>
        </div>
      </section>

      <Segments t={t} locale={locale} />
      <QuickServices t={t} locale={locale} />
      <News t={t} locale={locale} />
      <CtaBand t={t} locale={locale} />
    </>
  );
}
