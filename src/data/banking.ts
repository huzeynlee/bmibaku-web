import type { Provenance } from '@/types/banking';

// Institutional content read from bmibaku.az on 2026-11-22 unless provenance says otherwise.

const OFFICIAL: Provenance = { status: 'official-site', source: 'https://bmibaku.az/haqqimizda/', checkedOn: '2026-11-22' };

export const OFFICIAL_SITE = 'https://bmibaku.az';

export const INSTITUTION = {
  fullName: 'Bank Melli İran Bakı filialı',
  founded: '1993-01-29',
  license: { number: '124', issuer: 'AR Mərkəzi Bankı', date: '1993-01-29' },
  requisites: {
    taxId: '1300036291',
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
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=8+Noyabr+prospekti+23%2C+Baku+AZ1025',
  provenance: OFFICIAL,
} as const;

/** External destinations, verified on bmibaku.az (header, sidebars, footer). */
export const LINKS = {
  internetBanking: 'https://ib.bmibaku.az',
  concessionCalculator: 'https://pk.cbar.az/az/calculator',
  creditRegistry: 'https://accr.e-cbar.az/home',
  legacyCalculator: 'https://api.bmibaku.az/bmi/credit-calc/calc-az.html',
  cbarComplaints: 'https://www.cbar.az/',
  // "Bankomatlarımız" in the individual-banking sidebar opens this Google Maps search.
  atms:
    'https://www.google.com/search?rlz=1C1GCEU_enAZ907AZ907&tbm=lcl&sxsrf=ALeKk00C9zp958m5cS9e7Qr6EE_pq15h9g:1624614382176&q=ATM+of+Bank+Melli+Iran&rflfq=1&num=20&stick=H4sIAAAAAAAAAB2QPUpEQRCE2UAxf2IwILwjTP93h5oZbOYFNlAQFwVPoIGRhxA8gYk_0XqF2Wt4CuuZ1kxVf1VHh21iphCXVMqqEKvUNqmykkpKejdylog2UVeKcCXxcA_KRWRTJmLl3pcH6-ztmFyiWFU7i6ZAZGuTu8EVQkh2rirqbcqoSENAhWmWh-rid9dk6wJveQrS21RAJAorZjeWEpM2BWlEV-lluGnVHWISA4F6WHL9J3mbJDhRVLpEpqZHFS4lI6mCC2Z84wAp7sNolurkiWKGNaCqoUH3cq_QngFcrEJBHYsYGEXBXYyqgtmEDMEE-EDKAhAOBLVg_Me0iwh8XBKpRIGMJfl9tfpdnY7Xsds_j934HN_jYx5f43387B8hPu1f3g5Ozi7X8_31fL65u53XV9vtzXzxsLn7A6q-jM7SAQAA&ved=2ahUKEwjxn5WZwLLxAhXIhP0HHRdRAqEQjHIwHnoECBYQBQ&rldimm=2217363841899735984#rlfi=hd:;si:2217363841899735984,l,ChZBVE0gb2YgQmFuayBNZWxsaSBJcmFukgEDYXRt;mv:%5B%5B40.39070979611417,49.80924312861941%5D,%5B40.380347477388845,49.78392307551882%5D,null,%5B40.385528836021834,49.796583102069114%5D,16%5D',
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
      source: 'https://bmibaku.az/ (home page counter "94 illik TARİXİMİZ")',
      checkedOn: '2026-11-22',
      note: 'Published on the official site. Bank Melli Iran was founded in 1928 (98 years in 2026); the source does not state the founding year. Confirm before launch.',
    },
  },
  {
    id: 'branches',
    value: 3500,
    suffix: '+',
    provenance: { status: 'needs-verification', source: 'https://bmibaku.az/ ("3500-dən artıq FİLİALIMIZ")', checkedOn: '2026-11-22', note: 'Group-wide figure.' },
  },
  {
    id: 'staff',
    value: 43000,
    suffix: '+',
    provenance: { status: 'needs-verification', source: 'https://bmibaku.az/ ("43 000-dən artıq ƏMƏKDAŞIMIZ")', checkedOn: '2026-11-22', note: 'Group-wide figure.' },
  },
];

export const HERITAGE_YEARS = METRICS.find((m) => m.id === 'history')?.value ?? 94;
