# Bank Melli Iran – Baku Branch website

A single-page banking site built with React 18, Vite 5, strict TypeScript, Tailwind CSS 3 and Lucide icons. Recharts draws the rate-history chart and loads only when history data exists.

Full documentation, in Azerbaijani, is in [docs/](docs/README.md).

## Run

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck, then production build to dist/
npm run preview    # serve dist/ locally
npm run typecheck  # tsc --noEmit
```

## Configuration

Copy `.env.example` to `.env.local`. Every value is optional.

| Variable | When empty |
| --- | --- |
| `VITE_LOAN_APPLICATION_API_URL` | Demo mode. The form validates input, sends nothing and says so. It also links to the official form. |
| `VITE_RATES_API_URL` | Shows the dated snapshot in `src/data/currencies.ts`, labelled "not live". |
| `VITE_RATES_HISTORY_API_URL` | The history drawer says history isn't connected and links to the official history page. |

Production builds accept only HTTPS or same-origin URLs. The API contracts are in [docs/melumat-ve-inteqrasiya.md](docs/melumat-ve-inteqrasiya.md).

## Structure

```text
src/
├── app/            App.tsx (section order, shared state), main.tsx
├── components/
│   ├── layout/     UtilityBar, Navbar (dropdowns), MobileMenu, Footer, MobileActionBar
│   ├── sections/   Hero, TrustMetrics, CurrencyExchange, LoanCalculator,
│   │               IndividualBanking, CorporateBanking, QuickServices, InstitutionalInfo
│   ├── banking/    BankCard, ProductShowcase, ExchangeTable, CurrencyConverter,
│   │               RateHistoryDrawer, RateHistoryChart, LoanSummary, LoanApplicationModal
│   └── ui/         Button, Modal, Drawer, Input, Select, Slider, Segmented, SectionHeader, Logo
├── data/           banking.ts, currencies.ts, loanProducts.ts, navigation.ts
├── hooks/          useLoanCalculator, useCurrencyConverter, useRates, useActiveSection
├── i18n/           az.ts (source and type), en.ts, fa.ts, index.tsx
├── services/       config.ts, currencyService.ts, applicationService.ts
├── utils/          decimal.ts, currency.ts, calculations.ts, validation.ts, cx.ts
├── styles/         globals.css
└── types/          banking.ts
```

## Data accuracy

All institutional data comes from bmibaku.az, checked on 2026-11-22: contacts, bank details, license, links, loan rates and the published exchange rates. Each item records where it came from in `src/data/`. Items still to confirm:

- **"94 years":** the official site publishes 94. Bank Melli Iran was founded in 1928, which gives 98 in 2026.
- **3,500+ branches and 43,000+ employees:** group-wide figures published by the branch site.
- **Exchange rates:** a snapshot of 22.11.2026. IRR, AED and RUB were published as 0.0000, so they show as "not quoted".
- **Car loan:** no published rate, so it isn't included in the calculator.

## Brand assets

The official files were taken from bmibaku.az on 2026-11-22 (`/wp-content/uploads/2019/12/`).

| File | Source | Used in |
| --- | --- | --- |
| `public/brand/bmi-emblem.png` (128 px) | `cropped-Logo-azeri-…-192x192.png`, trimmed | Header, footer, MİLLİ KART visual |
| `public/brand/bmi-logo-lockup.png` | `Logo-english.png`, unchanged | JSON-LD `logo`, social image |
| `public/favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png` | The site's own favicon crops, unchanged | Browser tab and home-screen icons |
| `public/og-image.png` (1200×630) | The lockup centered on white | `og:image` |

## Quality (measured on the production build, 2026-11-22)

- **Lighthouse mobile:** Performance 91, Accessibility 100, Best Practices 100, SEO 100.
- **Lighthouse desktop:** 100 in all four categories.
- **Viewports:** no horizontal overflow at 360, 390, 430, 768, 1024, 1440 or 1920 px, in AZ and FA.
- **Console:** no errors or warnings.
