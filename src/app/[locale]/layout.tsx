import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Plus_Jakarta_Sans, Vazirmatn } from 'next/font/google';
import type { ReactNode } from 'react';
import '@/styles/globals.css';
import { LANGUAGE_NAMES, LOCALES, UI_TRANSLATION_REVIEW, isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { I18nProvider } from '@/i18n/client';
import { getNav } from '@/content/nav';
import { SITE_URL } from '@/lib/site';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { UtilityBar } from '@/components/layout/UtilityBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileActionBar } from '@/components/layout/MobileActionBar';
import { TranslationReviewStrip } from '@/components/layout/Notices';

const sans = Plus_Jakarta_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-sans', display: 'swap' });
const persian = Vazirmatn({ subsets: ['arabic'], variable: '--font-fa', display: 'swap' });

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));

export const viewport: Viewport = { themeColor: '#F8FAFC', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: `%s | ${t.brand.name} – ${t.brand.branch}` },
    description: t.meta.description,
    icons: {
      icon: [
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      type: 'website',
      siteName: `${t.brand.name} – ${t.brand.branch}`,
      locale: LANGUAGE_NAMES[locale].ogLocale,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Bank Melli Iran – Baku Branch' }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'BankOrCreditUnion',
  name: 'Bank Melli İran Bakı filialı',
  alternateName: 'Bank Melli Iran Baku Branch',
  url: SITE_URL,
  logo: `${SITE_URL}/brand/bmi-logo-lockup.png`,
  foundingDate: '1993-01-29',
  email: 'bank@bmibaku.az',
  telephone: ['+994125989005', '+994125989006'],
  address: { '@type': 'PostalAddress', streetAddress: '8 Noyabr prospekti 23', addressLocality: 'Bakı', postalCode: 'AZ1025', addressCountry: 'AZ' },
};

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const nav = getNav(locale, t);
  const { htmlLang, dir } = LANGUAGE_NAMES[locale];

  return (
    <html lang={htmlLang} dir={dir} className={`${sans.variable} ${persian.variable}`}>
      <body>
        <noscript>
          <style>{'[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}'}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }} />
        <I18nProvider locale={locale} dict={t}>
          <MotionProvider>
            <div className="pb-[calc(5.25rem+env(safe-area-inset-bottom))] md:pb-0">
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-navy-900 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                {t.nav.skip}
              </a>
              {UI_TRANSLATION_REVIEW[locale] && <TranslationReviewStrip t={t} />}
              <UtilityBar t={t} />
              <Header nav={nav} />
              <main id="main" tabIndex={-1} className="focus:outline-none">
                {children}
              </main>
              <Footer t={t} locale={locale} nav={nav} />
            </div>
            <MobileActionBar t={t} locale={locale} />
          </MotionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
