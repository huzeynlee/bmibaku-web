import type { ReactNode } from 'react';
import type { Section } from '@/content/routes';
import { cx } from '@/utils/cx';
import { MaskText } from '../motion/MaskText';
import { Motif, type MotifKind } from '../motion/Motif';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';

/** Art direction per section: background, motif, accent. */
const ART: Record<Section, { motif: MotifKind; surface: string; glow: string }> = {
  individual: { motif: 'cards', surface: 'bg-navy-900', glow: 'from-gold-500/15' },
  corporate: { motif: 'grid', surface: 'bg-navy-950', glow: 'from-navy-700/60' },
  institution: { motif: 'colonnade', surface: 'bg-navy-900', glow: 'from-gold-500/10' },
  property: { motif: 'building', surface: 'bg-navy-900', glow: 'from-gold-400/10' },
  gallery: { motif: 'frames', surface: 'bg-ink', glow: 'from-gold-500/10' },
  contact: { motif: 'compass', surface: 'bg-navy-900', glow: 'from-navy-700/50' },
  tools: { motif: 'chart', surface: 'bg-navy-950', glow: 'from-gold-500/15' },
};

interface PageHeroProps {
  section: Section;
  eyebrow: string;
  title: string;
  description?: string | null;
  crumbs: Crumb[];
  breadcrumbLabel: string;
  siteUrl: string;
  meta?: ReactNode;
  size?: 'compact' | 'large';
  children?: ReactNode;
}

/** Inner-page hero: dark surface, drawn architectural motif, masked title. */
export function PageHero({ section, eyebrow, title, description, crumbs, breadcrumbLabel, siteUrl, meta, size = 'compact', children }: PageHeroProps) {
  const art = ART[section];
  return (
    <section aria-labelledby="page-title" className={cx('relative isolate overflow-hidden text-white', art.surface)}>
      <div aria-hidden="true" className={cx('absolute inset-0 -z-10 bg-gradient-to-br via-transparent to-transparent', art.glow)} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_85%_10%,rgb(255_255_255/0.07),transparent_60%)]" />
      <Motif kind={art.motif} className="pointer-events-none absolute -end-10 top-1/2 -z-10 hidden h-[130%] -translate-y-1/2 text-white/[0.09] md:block rtl:-scale-x-100" />
      <div className={cx('container-page relative', size === 'large' ? 'pb-20 pt-10 md:pb-28 md:pt-14' : 'pb-14 pt-8 md:pb-20 md:pt-10')}>
        {/* Above the fold: CSS entrance (globals.css), so nothing waits for JavaScript. */}
        <div className="fade-in">
          <Breadcrumbs items={crumbs} label={breadcrumbLabel} dark siteUrl={siteUrl} />
        </div>
        <div className="mt-10 max-w-3xl md:mt-14">
          <p className="rise-in flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold-400">
            <span aria-hidden="true" className="h-px w-8 bg-gold-500" />
            {eyebrow}
          </p>
          <MaskText
            as="h1"
            id="page-title"
            immediate
            delay={0.1}
            lines={[title]}
            className={cx('mt-5 font-extrabold leading-[1.06] tracking-tight', size === 'large' ? 'text-[2.5rem] sm:text-5xl lg:text-[4rem]' : 'text-[2.1rem] sm:text-[2.75rem] lg:text-[3.25rem]')}
          />
          {description && (
            <p className="rise-in mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-[17px]" style={{ animationDelay: '0.3s' }}>
              {description}
            </p>
          )}
          {meta && (
            <div className="rise-in mt-6 text-[13px] text-white/60" style={{ animationDelay: '0.4s' }}>
              {meta}
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
