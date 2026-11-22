import type { Provenance } from '../types/banking';

// Institutional content. Every value below was read from bmibaku.az on 2026-11-22
// unless its provenance says otherwise. Update here; components never hardcode it.

const OFFICIAL: Provenance = { status: 'official-site', source: 'https://bmibaku.az/haqqimizda/', checkedOn: '2026-11-22' };

export const OFFICIAL_SITE = 'https://bmibaku.az';

export const INSTITUTION = {
  fullName: 'Bank Melli İran Bakı filialı',
  founded: '1993-01-29',
  license: { number: '124', issuer: 'AR Mərkəzi Bankı', date: '1993-01-29' },
  requisites: {
    taxId: '1300036291', // VÖEN
    bankCode: '509761',
    swift: 'MELIAZ22',
    correspondentAccount: 'AZ74NABZ01350100000000037944',
  },
  provenance: OFFICIAL,
} as const;

export const CONTACT = {
  phones: [
    { display: '(+994 12) 598 90 05', href: 'tel:+994125989005' },
    { display: '(+994 12) 598 90 06', href: 'tel:+994125989006' },
  ],
  email: 'bank@bmibaku.az',
  hours: { open: '09:30', close: '16:30' },
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=8+Noyabr+prospekti+23%2C+Baku+AZ1025',
  provenance: OFFICIAL,
} as const;

/** Links verified on bmibaku.az. Pages on the current site open in the same tab. */
export const LINKS = {
  internetBanking: 'https://ib.bmibaku.az',
  concessionCalculator: 'https://pk.cbar.az/az/calculator',
  creditRegistry: 'https://accr.e-cbar.az/home',
  gallery: `${OFFICIAL_SITE}/foto-qalereya/`,
  about: `${OFFICIAL_SITE}/haqqimizda/`,
  officialLoanForm: `${OFFICIAL_SITE}/online-kredit-sifarisi/`,
  rateHistory: `${OFFICIAL_SITE}/valyuta-tarixcesi/`,
  individual: {
    overview: `${OFFICIAL_SITE}/ferdi-bankciliq/`,
    currentAccount: `${OFFICIAL_SITE}/cari-hesablar-ferdi/`,
    cards: `${OFFICIAL_SITE}/plastik-kartlar-ferdi/`,
    deposits: `${OFFICIAL_SITE}/emanetler-ferdi/`,
    loans: `${OFFICIAL_SITE}/kreditler-ferdi/`,
    tariffs: `${OFFICIAL_SITE}/bank-tarifleri-ferdi/`,
  },
  corporate: {
    overview: `${OFFICIAL_SITE}/korporativ-bankciliq/`,
    currentAccount: `${OFFICIAL_SITE}/cari-hesablar-korporativ/`,
    noncash: `${OFFICIAL_SITE}/nagdsiz-emeliyyatlar-korporativ/`,
    deposits: `${OFFICIAL_SITE}/depozitler-korporativ/`,
    loans: `${OFFICIAL_SITE}/kreditler-korporativ/`,
    // The official site links corporate transfers to the same page as individual transfers.
    transfers: `${OFFICIAL_SITE}/pul-kocurmeleri-ferdi/`,
  },
  services: {
    cards: `${OFFICIAL_SITE}/plastik-kartlar-ferdi/`,
    transfers: `${OFFICIAL_SITE}/pul-kocurmeleri-ferdi/`,
    // The official site routes "ATM və POS Terminallar" to the plastic cards page.
    atm: `${OFFICIAL_SITE}/plastik-kartlar-ferdi/`,
    property: `${OFFICIAL_SITE}/emlak-satisi/`,
  },
  references: {
    cbar: 'https://www.cbar.az/',
    cbi: 'https://cbi.ir/',
    // As linked on the official site. https://bmi.ir/ failed certificate validation on 2026-11-22.
    bmi: 'http://bmi.ir/',
    adif: 'https://adif.az/',
  },
} as const;

export type MetricId = 'since' | 'history' | 'branches' | 'staff';

export interface Metric {
  id: MetricId;
  value: number;
  /** Shown after the number: "+" for "more than". */
  suffix?: '+';
  provenance: Provenance;
}

export const METRICS: Metric[] = [
  { id: 'since', value: 1993, provenance: OFFICIAL },
  {
    id: 'history',
    value: 94,
    provenance: {
      status: 'needs-verification',
      source: 'https://bmibaku.az/ (home page: "94 illik TARİXİMİZ")',
      checkedOn: '2026-11-22',
      note: 'Published on the official site, but Bank Melli Iran was founded in 1928, which gives 98 years in 2026. Confirm with the bank before launch.',
    },
  },
  {
    id: 'branches',
    value: 3500,
    suffix: '+',
    provenance: {
      status: 'needs-verification',
      source: 'https://bmibaku.az/ (home page: "3500-dən artıq FİLİALIMIZ")',
      checkedOn: '2026-11-22',
      note: 'Group-wide figure published by the branch site. Confirm against current BMI head office data.',
    },
  },
  {
    id: 'staff',
    value: 43000,
    suffix: '+',
    provenance: {
      status: 'needs-verification',
      source: 'https://bmibaku.az/ (home page: "43 000-dən artıq ƏMƏKDAŞIMIZ")',
      checkedOn: '2026-11-22',
      note: 'Group-wide figure published by the branch site. Confirm against current BMI head office data.',
    },
  },
];

export const HERITAGE_YEARS = METRICS.find((m) => m.id === 'history')?.value ?? 94;
