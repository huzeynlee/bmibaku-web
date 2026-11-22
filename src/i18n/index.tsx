import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from '../types/banking';
import { az, type Dictionary } from './az';
import { en } from './en';
import { fa } from './fa';

export const LANGUAGES: { code: Lang; label: string; name: string }[] = [
  { code: 'az', label: 'AZ', name: 'Azərbaycanca' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'fa', label: 'FA', name: 'فارسی' },
];

const DICTIONARIES: Record<Lang, Dictionary> = { az, en, fa };
const isLang = (v: unknown): v is Lang => v === 'az' || v === 'en' || v === 'fa';

/** URL (?lang=) first, then the saved choice, then the browser languages, then Azerbaijani. */
function detectLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (isLang(fromUrl)) return fromUrl;
  try {
    const saved = window.localStorage.getItem('lang');
    if (isLang(saved)) return saved;
  } catch {
    /* storage blocked */
  }
  for (const l of navigator.languages ?? []) {
    const code = l.slice(0, 2).toLowerCase();
    if (isLang(code)) return code;
  }
  return 'az';
}

interface I18nValue {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  t: Dictionary;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);
  const t = DICTIONARIES[lang];
  const dir = lang === 'fa' ? 'rtl' : 'ltr';

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
    const url = new URL(window.location.href);
    if (lang === 'az') url.searchParams.delete('lang');
    else url.searchParams.set('lang', lang);
    window.history.replaceState(window.history.state, '', url);
  }, [lang, dir, t]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      // Only the interface language is stored; never form data.
      window.localStorage.setItem('lang', next);
    } catch {
      /* storage blocked */
    }
  }, []);

  const value = useMemo<I18nValue>(() => ({ lang, dir, t, setLang }), [lang, dir, t, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
