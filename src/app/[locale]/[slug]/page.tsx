import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES, isLocale, localePath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { ROUTES, INSTITUTION_GROUPS, getRoute, groupRoutes } from '@/content/routes';
import { loadPage, pageExcerpt, pageTitle } from '@/content/load';
import { getLatestRates, getRateHistory } from '@/lib/rates';
import { SITE_URL } from '@/lib/site';
import { ContentTemplate } from '@/components/templates/ContentTemplate';
import {
  ApplicationTemplate,
  CalculatorTemplate,
  ContactTemplate,
  GalleryTemplate,
  HubTemplate,
  OverviewTemplate,
  PropertyTemplate,
  RatesTemplate,
  reportFacts,
} from '@/components/templates/SpecialTemplates';

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;
// Pages are static; rates-driven pages refresh every 10 minutes.
export const revalidate = 600;

export function generateStaticParams() {
  return ROUTES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !getRoute(slug)) return {};
  const languages = Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}${localePath(l, slug)}`]));
  return {
    title: pageTitle(slug, locale),
    description: pageExcerpt(slug, locale, 155) ?? getDictionary(locale).meta.description,
    alternates: { canonical: `${SITE_URL}${localePath(locale, slug)}`, languages: { ...languages, 'x-default': languages.az! } },
    openGraph: { title: pageTitle(slug, locale), url: `${SITE_URL}${localePath(locale, slug)}` },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const route = getRoute(slug);
  const page = route ? loadPage(slug, locale) : null;
  if (!route || !page) notFound();
  const t = getDictionary(locale);
  const props = { route, page, locale, t };

  switch (route.template) {
    case 'overview':
      return <OverviewTemplate {...props} />;
    case 'hub': {
      const facts = reportFacts(locale);
      return (
        <HubTemplate
          {...props}
          groups={INSTITUTION_GROUPS.map((g) => ({ label: t.groups[g], routes: groupRoutes(g) }))}
          reportYears={facts.years}
          latestReport={facts.latest}
        />
      );
    }
    case 'gallery':
      return <GalleryTemplate {...props} />;
    case 'contact':
      return <ContactTemplate {...props} />;
    case 'property':
      return <PropertyTemplate {...props} />;
    case 'calculator': {
      const { data } = await getLatestRates();
      const usd = data.items.find((i) => i.code === 'USD')?.cash?.sell;
      return <CalculatorTemplate {...props} usdSell={usd ? Number(usd) : null} />;
    }
    case 'application': {
      const own = page.content.forms.find((f) => f.kind === 'elementor-form')?.fields ?? [];
      const az = loadPage(slug, 'az')?.content.forms.find((f) => f.kind === 'elementor-form')?.fields ?? [];
      // The official form has 11 fields; use the AZ definition if a translation differs.
      return <ApplicationTemplate {...props} formFields={own.length === 11 ? own : az} />;
    }
    case 'rates': {
      const [{ data, error }, history] = await Promise.all([getLatestRates(), getRateHistory({ page: 1 }).catch(() => null)]);
      return <RatesTemplate {...props} latest={data} latestError={error} history={history} />;
    }
    default:
      return <ContentTemplate {...props} />;
  }
}
