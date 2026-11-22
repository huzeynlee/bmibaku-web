import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import type { Block, PageContent, ResolvedPage } from './types';
import { localizeHref, type Locale } from '@/i18n/config';

const DIR = path.join(process.cwd(), 'content', 'pages');

const readJson = cache((locale: 'az' | 'en', slug: string): PageContent | null => {
  const file = path.join(DIR, locale, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8')) as PageContent;
});

const localizeHtml = (html: string, locale: Locale) =>
  locale === 'az' ? html : html.replace(/href="(\/[^"]*)"/g, (_, href: string) => `href="${localizeHref(href, locale)}"`);

function localizeBlocks(blocks: Block[], locale: Locale): Block[] {
  if (locale === 'az') return blocks;
  return blocks.map((b): Block => {
    switch (b.type) {
      case 'paragraph':
        return { ...b, html: localizeHtml(b.html, locale) };
      case 'list':
        return { ...b, items: b.items.map((i) => localizeHtml(i, locale)) };
      case 'table':
        return { ...b, rows: b.rows.map((r) => r.map((c) => ({ ...c, html: localizeHtml(c.html, locale) }))) };
      case 'links':
        return { ...b, items: b.items.map((i) => ({ ...i, href: i.href ? localizeHref(i.href, locale) : i.href })) };
      case 'button':
        return { ...b, href: localizeHref(b.href, locale) };
      case 'accordion':
        return { ...b, items: b.items.map((i) => ({ ...i, blocks: localizeBlocks(i.blocks, locale) })) };
      default:
        return b;
    }
  });
}

/**
 * Page content for a locale. EN uses the official English site when it has the
 * page; otherwise (and always for FA) the official Azerbaijani content is used
 * and `fallback` is true so the page can say so.
 */
export function loadPage(slug: string, locale: Locale): ResolvedPage | null {
  const az = readJson('az', slug);
  if (!az) return null;
  const en = locale === 'en' ? readJson('en', slug) : null;
  const useEn = !!en && en.blocks.length > 0;
  const content = useEn ? en : az;
  return {
    content: { ...content, blocks: localizeBlocks(content.blocks, locale) },
    contentLocale: useEn ? 'en' : 'az',
    fallback: locale !== 'az' && !useEn,
  };
}

/** Title of a page in a locale (official EN title when available). */
export function pageTitle(slug: string, locale: Locale): string {
  if (locale === 'en') {
    const en = readJson('en', slug);
    if (en?.title) return en.title;
  }
  return readJson('az', slug)?.title ?? slug;
}

/** Plain-text excerpt from the first paragraph of a page. */
export function pageExcerpt(slug: string, locale: Locale, max = 180): string | null {
  const page = loadPage(slug, locale);
  const p = page?.content.blocks.find((b) => b.type === 'paragraph' && b.html.replace(/<[^>]+>/g, '').trim().length > 40);
  if (!p || p.type !== 'paragraph') return null;
  const text = p.html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, '')}…` : text;
}
