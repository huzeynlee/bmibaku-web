'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Dictionary } from './az';
import { LANGUAGE_NAMES, type Locale } from './config';

interface I18nValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: Dictionary;
}

const I18nContext = createContext<I18nValue | null>(null);

/** Passes the server-selected dictionary to client components. */
export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, dir: LANGUAGE_NAMES[locale].dir, t: dict }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
