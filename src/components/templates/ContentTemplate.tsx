import { FileQuestion } from 'lucide-react';
import type { Dictionary } from '@/i18n/az';
import type { Locale } from '@/i18n/config';
import type { ResolvedPage } from '@/content/types';
import { childrenOf, type RouteDef } from '@/content/routes';
import { Blocks } from '../blocks/Blocks';
import { PageHero } from '../layout/PageHero';
import { SectionNav } from '../layout/SectionNav';
import { FallbackNotice } from '../layout/Notices';
import { CtaBand, RouteTiles, SITE_URL, SourceMeta, crumbsFor, liftIntro, navGroupsFor, siblingsOf } from './shared';

export function eyebrowFor(route: RouteDef, t: Dictionary): string {
  if (route.group) return t.groups[route.group];
  return t.sections[route.section].eyebrow;
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <FileQuestion className="mx-auto size-8 text-slate-400" aria-hidden="true" />
      <p className="mx-auto mt-4 max-w-md text-[15px] text-slate-600">{text}</p>
    </div>
  );
}

interface Props {
  route: RouteDef;
  page: ResolvedPage;
  locale: Locale;
  t: Dictionary;
}

export function ContentTemplate({ route, page, locale, t }: Props) {
  const { content } = page;
  const { intro, rest } = liftIntro(content.blocks);
  const nav = navGroupsFor(route.slug, locale, t);
  const children = childrenOf(route.slug);
  const hasChildLinks = rest.some((b) => b.type === 'links' && b.items.some((i) => children.some((c) => i.href?.includes(`/${c.slug}/`))));
  const related = route.section === 'individual' || route.section === 'corporate' ? siblingsOf(route.slug) : [];

  return (
    <>
      <PageHero
        section={route.section}
        eyebrow={eyebrowFor(route, t)}
        title={content.heroTitle ?? content.title}
        description={intro}
        crumbs={crumbsFor(route.slug, locale, t)}
        breadcrumbLabel={t.common.breadcrumb}
        siteUrl={SITE_URL}
        meta={<SourceMeta page={content} t={t} locale={locale} />}
      />

      <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-12">
        {nav && (
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <SectionNav groups={nav} active={route.slug} label={t.common.sectionNav} chooseLabel={t.common.chooseSection} />
            </div>
          </aside>
        )}
        <div className={nav ? 'min-w-0 lg:col-span-9' : 'min-w-0 lg:col-span-10 lg:col-start-2'}>
          {page.fallback && <FallbackNotice t={t} />}
          {rest.length > 0 ? <Blocks blocks={rest} t={t} skip={['form', 'rates', 'slides']} /> : !children.length && <EmptyState text={t.common.emptySource} />}
          {children.length > 0 && !hasChildLinks && (
            <div className="mt-12">
              <RouteTiles routes={children} locale={locale} t={t} title={t.common.inThisSection} columns={nav ? 2 : 3} />
            </div>
          )}
          {related.length > 0 && (
            <div className="mt-16 border-t border-line pt-10">
              <RouteTiles routes={related} locale={locale} t={t} title={t.common.relatedServices} />
            </div>
          )}
        </div>
      </div>
      <CtaBand t={t} locale={locale} />
    </>
  );
}
