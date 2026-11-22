import { Languages } from 'lucide-react';
import type { Dictionary } from '@/i18n/az';

/** Shown when a page has no official translation and the Azerbaijani original is displayed. */
export function FallbackNotice({ t }: { t: Dictionary }) {
  return (
    <p className="mb-8 flex items-start gap-2.5 rounded-lg border border-line bg-white px-4 py-3 text-[13px] text-slate-600">
      <Languages className="mt-0.5 size-4 shrink-0 text-gold-700" aria-hidden="true" />
      <span>{t.translation.fallback}</span>
    </p>
  );
}

/** Site-wide strip for interface translations that the bank has not approved yet. */
export function TranslationReviewStrip({ t }: { t: Dictionary }) {
  return (
    <p className="bg-gold-50 px-4 py-1.5 text-center text-xs font-medium text-gold-700" role="note">
      {t.translation.uiReview}
    </p>
  );
}
