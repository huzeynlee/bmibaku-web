import { az, type Dictionary } from './az';
import { en } from './en';
import { fa } from './fa';
import type { Locale } from './config';

export type { Dictionary };

const DICTIONARIES: Record<Locale, Dictionary> = { az, en, fa };

export const getDictionary = (locale: Locale): Dictionary => DICTIONARIES[locale];
