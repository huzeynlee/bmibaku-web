export const LOCALES = ['az', 'en', 'fa'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'az';

export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (LOCALES as readonly string[]).includes(v);

export const LANGUAGE_NAMES: Record<Locale, { label: string; name: string; htmlLang: string; dir: 'ltr' | 'rtl'; ogLocale: string }> = {
  az: { label: 'AZ', name: 'Azərbaycanca', htmlLang: 'az', dir: 'ltr', ogLocale: 'az_AZ' },
  en: { label: 'EN', name: 'English', htmlLang: 'en', dir: 'ltr', ogLocale: 'en_US' },
  fa: { label: 'FA', name: 'فارسی', htmlLang: 'fa', dir: 'rtl', ogLocale: 'fa_IR' },
};

/** Content source per locale: AZ and EN have official sites; FA has none (UI only). */
export const OFFICIAL_CONTENT: Record<Locale, boolean> = { az: true, en: true, fa: false };

/**
 * Interface strings written for this redesign (not taken from an official source).
 * Shown with a review notice until the bank approves them.
 */
export const UI_TRANSLATION_REVIEW: Record<Locale, boolean> = { az: false, en: true, fa: true };

/** Path of a site page in a locale. `slug` '' is the homepage. */
export function localePath(locale: Locale, slug = ''): string {
  const tail = slug ? `${slug.replace(/^\/|\/$/g, '')}/` : '';
  return locale === 'az' ? `/${tail}` : `/${locale}/${tail}`;
}

/** Prefixes an internal absolute path ("/kreditler-ferdi/") for a locale. Leaves other URLs alone. */
export function localizeHref(href: string, locale: Locale): string {
  if (locale === 'az' || !href.startsWith('/') || href.startsWith('//') || href.startsWith('/api/')) return href;
  if (/^\/(en|fa)(\/|$)/.test(href)) return href;
  return `/${locale}${href}`;
}

/**
 * Strips a locale prefix from a path. `/az` is stripped too: AZ pages are served
 * through a middleware rewrite, and usePathname() can return the rewritten
 * `/az/...` path on the server but the browser path on the client.
 */
export function stripLocale(pathname: string): string {
  return pathname.replace(/^\/(az|en|fa)(?=\/|$)/, '') || '/';
}
