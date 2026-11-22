import Link from 'next/link';
import { getDictionary } from '@/i18n/dictionaries';
import { buttonClass } from '@/components/ui/buttonClass';

// Rendered for unknown routes. The locale is not available here, so Azerbaijani is used.
export default function NotFound() {
  const t = getDictionary('az');
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-start justify-center py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-700">404</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-navy-900">{t.notFound.title}</h1>
      <p className="mt-4 max-w-md text-slate-600">{t.notFound.text}</p>
      <Link href="/" className={buttonClass('primary', 'lg', 'mt-8')}>
        {t.notFound.home}
      </Link>
    </section>
  );
}
