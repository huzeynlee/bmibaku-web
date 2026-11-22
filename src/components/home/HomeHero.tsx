'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/i18n/client';
import { localePath } from '@/i18n/config';
import { fmt } from '@/utils/cx';
import { BankCard } from '../banking/BankCard';
import { ProductShowcase } from '../banking/ProductShowcase';
import { MaskText } from '../motion/MaskText';
import { Motif } from '../motion/Motif';
import { EASE_OUT } from '../motion/MotionProvider';
import { buttonClass } from '../ui/buttonClass';

/**
 * Choreography (seconds): background 0 → gold lines 0.3 → eyebrow 0.3 →
 * headline lines 0.4/0.51 → lead 0.85 → CTAs 1.0/1.1 → statement 1.25 → card 0.7 → products 1.0.
 * Total ≈ 1.6 s; content is readable throughout and static with reduced motion.
 */
export function HomeHero({ years }: { years: number }) {
  const { t, locale } = useI18n();
  const lines = t.home.titleLines.map((l) => fmt(l, { years }));
  // Text entrance runs in CSS (globals.css → .rise-in) so it never waits for JavaScript.
  const up = (delay: number, className = '') => ({ className: `rise-in ${className}`, style: { animationDelay: `${delay}s` } });

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="fade-in absolute inset-0 -z-20 bg-[radial-gradient(70%_60%_at_80%_20%,rgb(227_233_242/0.9),transparent_70%)]" />
      <Motif kind="colonnade" delay={0.3} className="pointer-events-none absolute -end-24 top-0 -z-10 hidden h-[115%] text-navy-900/[0.06] lg:block rtl:-scale-x-100" />
      <motion.span aria-hidden="true" className="absolute start-0 top-[22%] -z-10 hidden h-px w-[38%] origin-left bg-gradient-to-r from-gold-500/0 via-gold-500/50 to-gold-500/0 lg:block" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, delay: 0.3, ease: EASE_OUT }} />

      <div className="container-page grid items-center gap-12 pb-16 pt-10 md:pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-16">
        <div className="lg:col-span-7 lg:pe-6">
          <p {...up(0.3, 'flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold-700')}>
            <span aria-hidden="true" className="h-px w-8 bg-gold-500" />
            {t.home.eyebrow}
          </p>
          <MaskText
            as="h1"
            id="hero-title"
            immediate
            delay={0.4}
            lines={lines}
            className="mt-5 text-[2.5rem] font-extrabold leading-[1.04] tracking-tight text-navy-900 sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]"
          />
          <p {...up(0.85, 'mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-[17px]')}>{t.home.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div {...up(1)}>
              <Link href={localePath(locale, 'online-kredit-sifarisi')} className={buttonClass('gold', 'lg', 'w-full sm:w-auto')}>
                {t.home.apply}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
            <div {...up(1.1)}>
              <Link href={localePath(locale, 'bank-tarifleri-ferdi')} className={buttonClass('secondary', 'lg', 'w-full sm:w-auto')}>
                {t.home.tariffs}
              </Link>
            </div>
          </div>
          <p {...up(1.25, 'mt-10 flex items-center gap-2.5 text-sm font-semibold tracking-wide text-navy-900')}>
            <ShieldCheck className="size-4 shrink-0 text-gold-700" aria-hidden="true" />
            {t.home.statement}
          </p>
        </div>

        <div className="lg:col-span-5">
          <BankCard label={t.home.card} interactive delay={0.7} className="relative z-10 mx-auto -mb-12 w-[min(82%,21rem)]" />
          <div {...up(1)}>
            <ProductShowcase className="pt-16" />
          </div>
        </div>
      </div>
    </section>
  );
}
