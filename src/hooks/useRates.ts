import { useEffect, useState } from 'react';
import type { RatesSnapshot } from '../types/banking';
import { config } from '../services/config';
import { RATES_SNAPSHOT } from '../data/currencies';
import { getCurrentRates } from '../services/currencyService';

export type RatesState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; data: RatesSnapshot };

/** Current rates. Without a rates API the dated snapshot is available immediately. */
export function useRates(): RatesState {
  const [state, setState] = useState<RatesState>(() =>
    config.ratesUrl ? { status: 'loading' } : { status: 'ready', data: RATES_SNAPSHOT },
  );

  useEffect(() => {
    if (!config.ratesUrl) return;
    const controller = new AbortController();
    getCurrentRates(controller.signal)
      .then((data) => setState({ status: 'ready', data }))
      .catch((err: unknown) => {
        if (!(err instanceof DOMException && err.name === 'AbortError')) setState({ status: 'error' });
      });
    return () => controller.abort();
  }, []);

  return state;
}
