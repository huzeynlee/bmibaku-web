import type { CurrencyCode, RatesSnapshot } from '../types/banking';

export const CURRENCY_ORDER: CurrencyCode[] = ['USD', 'EUR', 'IRR', 'AED', 'RUB'];

/**
 * Rates published on https://bmibaku.az/ ("Valyuta Məzənnəsi - 22.11.2026").
 * IRR, AED and RUB were published as 0.0000, meaning no quote; they stay null
 * so the interface shows them as unavailable instead of inventing values.
 *
 * This is a dated snapshot, not live data. Set VITE_RATES_API_URL to load
 * current rates; the interface then labels them as live.
 */
export const RATES_SNAPSHOT: RatesSnapshot = {
  asOf: '2026-11-22',
  live: false,
  source: { label: 'bmibaku.az', url: 'https://bmibaku.az/' },
  items: [
    { code: 'USD', unit: 1, cash: { buy: '1.6970', sell: '1.7000' }, noncash: { buy: '1.6900', sell: '1.7070' } },
    { code: 'EUR', unit: 1, cash: { buy: '1.8620', sell: '1.8820' }, noncash: { buy: '1.8520', sell: '1.8920' } },
    { code: 'IRR', unit: 100, cash: null, noncash: null },
    { code: 'AED', unit: 1, cash: null, noncash: null },
    { code: 'RUB', unit: 1, cash: null, noncash: null },
  ],
};

export const RATE_DECIMALS = 4;
