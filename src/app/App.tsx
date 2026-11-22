import { useCallback, useState } from 'react';
import type { LoanInput, LoanProductId } from '../types/banking';
import { useI18n } from '../i18n';
import { CALCULATOR_PRODUCTS, DEFAULT_LOAN } from '../data/loanProducts';
import { UtilityBar } from '../components/layout/UtilityBar';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { MobileActionBar } from '../components/layout/MobileActionBar';
import { Hero } from '../components/sections/Hero';
import { TrustMetrics } from '../components/sections/TrustMetrics';
import { CurrencyExchange } from '../components/sections/CurrencyExchange';
import { LoanCalculator } from '../components/sections/LoanCalculator';
import { IndividualBanking } from '../components/sections/IndividualBanking';
import { CorporateBanking } from '../components/sections/CorporateBanking';
import { QuickServices } from '../components/sections/QuickServices';
import { InstitutionalInfo } from '../components/sections/InstitutionalInfo';
import { LoanApplicationModal, type ApplicationPrefill } from '../components/banking/LoanApplicationModal';

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export function App() {
  const { t } = useI18n();
  const [loan, setLoan] = useState<LoanInput>(DEFAULT_LOAN);
  const [application, setApplication] = useState<{ open: boolean; prefill: ApplicationPrefill }>({
    open: false,
    prefill: DEFAULT_LOAN,
  });

  const openApplication = useCallback(
    (productId?: LoanProductId) =>
      setApplication({ open: true, prefill: { ...loan, productId: productId ?? loan.productId } }),
    [loan],
  );
  const closeApplication = useCallback(() => setApplication((a) => ({ ...a, open: false })), []);

  const calculate = useCallback((productId: LoanProductId) => {
    if (CALCULATOR_PRODUCTS.some((p) => p.id === productId)) setLoan((l) => ({ ...l, productId }));
    scrollToSection('calculator');
  }, []);

  return (
    // Bottom padding on phones keeps the fixed action bar from covering content.
    <div className="pb-[calc(5.25rem+env(safe-area-inset-bottom))] md:pb-0">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-navy-900 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
      >
        {t.nav.skip}
      </a>
      <UtilityBar />
      <Navbar />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero onApply={openApplication} onCalculate={calculate} />
        <TrustMetrics />
        <CurrencyExchange />
        <LoanCalculator loan={loan} setLoan={setLoan} onApply={() => openApplication()} />
        <IndividualBanking />
        <CorporateBanking />
        <QuickServices />
        <InstitutionalInfo />
      </main>
      <Footer />
      <MobileActionBar />
      <LoanApplicationModal open={application.open} prefill={application.prefill} onClose={closeApplication} />
    </div>
  );
}
