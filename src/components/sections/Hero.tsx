import { ArrowRight, ShieldCheck } from 'lucide-react';
import type { LoanProductId } from '../../types/banking';
import { useI18n } from '../../i18n';
import { HERITAGE_YEARS, LINKS } from '../../data/banking';
import { fmt } from '../../utils/cx';
import { Button, ButtonLink } from '../ui/Button';
import { BankCard } from '../banking/BankCard';
import { ProductShowcase } from '../banking/ProductShowcase';

interface HeroProps {
  onApply: (id?: LoanProductId) => void;
  onCalculate: (id: LoanProductId) => void;
}

export function Hero({ onApply, onCalculate }: HeroProps) {
  const { t } = useI18n();
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-page grid items-center gap-12 pb-14 pt-10 sm:pb-16 md:pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-16">
        <div className="lg:col-span-7 lg:pe-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-700">{t.hero.eyebrow}</p>
          <h1
            id="hero-title"
            className="mt-5 text-[2.5rem] font-extrabold leading-[1.04] tracking-tight text-navy-900 sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]"
          >
            {fmt(t.hero.title, { years: HERITAGE_YEARS })}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-[17px]">{t.hero.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="gold" size="lg" onClick={() => onApply()} className="w-full sm:w-auto">
              {t.hero.apply}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Button>
            <ButtonLink href={LINKS.individual.tariffs} variant="secondary" size="lg" className="w-full sm:w-auto">
              {t.hero.tariffs}
            </ButtonLink>
          </div>
          <p className="mt-10 flex items-center gap-2.5 text-sm font-semibold tracking-wide text-navy-900">
            <ShieldCheck className="size-4 shrink-0 text-gold-700" aria-hidden="true" />
            {t.hero.statement}
          </p>
        </div>

        <div className="lg:col-span-5">
          {/* The card overlaps the panel's top padding only, never its tabs. */}
          <BankCard label={t.hero.card} className="relative z-10 mx-auto -mb-12 w-[min(82%,21rem)]" />
          <ProductShowcase onApply={(id) => onApply(id)} onCalculate={onCalculate} className="pt-16" />
        </div>
      </div>
    </section>
  );
}
