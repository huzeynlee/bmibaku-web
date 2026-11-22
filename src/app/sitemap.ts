import type { MetadataRoute } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import { LOCALES, localePath } from '@/i18n/config';
import { ROUTES } from '@/content/routes';
import { SITE_URL } from '@/lib/site';

function modified(slug: string): Date | undefined {
  const file = path.join(process.cwd(), 'content', 'pages', 'az', `${slug}.json`);
  if (!fs.existsSync(file)) return undefined;
  return new Date((JSON.parse(fs.readFileSync(file, 'utf8')) as { modified: string }).modified);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = ['', ...ROUTES.map((r) => r.slug)];
  return slugs.map((slug) => ({
    url: `${SITE_URL}${localePath('az', slug)}`,
    lastModified: slug ? modified(slug) : undefined,
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}${localePath(l, slug)}`])) },
  }));
}
