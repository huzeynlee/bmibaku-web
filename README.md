# Bank Melli Iran – Baku Branch website

Multi-page site for bmibaku.az built with Next.js 15 (App Router), React 19, strict TypeScript, Tailwind CSS 3, Motion and Lucide. Recharts draws the rate-history chart and loads only when a single currency is selected.

All 54 content pages of the old WordPress site are migrated under their original slugs, plus a new home page, loan calculator, online credit application and currency history. Every page exists in Azerbaijani (`/`), English (`/en/`) and Persian (`/fa/`, right-to-left).

- Full documentation, in Azerbaijani: [docs/](docs/README.md)
- Route-by-route migration report: [docs/MIGRATION-REPORT.md](docs/MIGRATION-REPORT.md)

## Run

Requires Node.js 20 or newer.

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # production build (.next/), 173 pages
npm start              # serve the production build
npm run typecheck      # tsc --noEmit
npm run content:sync   # re-import content from bmibaku.az / en.bmibaku.az into content/
npm run qa -- http://localhost:3000   # automated QA against a running build
npm run report         # regenerate docs/MIGRATION-REPORT.md
```

`npm run qa` needs Chrome (set `CHROME_PATH` if it is not in the default location). Add `--shots` to save full-page screenshots to `reports/screenshots/`.

Hosting needs a Node.js server (middleware for locale routing, API routes, incremental regeneration). A static export does not work. See [docs/yerlesdirme.md](docs/yerlesdirme.md).

## Configuration

Copy `.env.example` to `.env.local`. All values are optional and read on the server only.

| Variable | When empty |
| --- | --- |
| `RATES_SOURCE_URL` | Uses the existing bmibaku.az rates endpoint (`admin-ajax.php?action=mv_cr_read`). If it fails, a dated snapshot is shown, labelled "not live". |
| `CREDIT_APPLICATION_ENDPOINT` / `_TOKEN` | Online credit applications are not accepted (HTTP 503); the page gives phone and branch contacts. **The form collects FİN: enable only after legal, data-protection and security approval.** |
| `CONTACT_ENDPOINT` / `_TOKEN` | The contact / complaint form is not accepted (HTTP 503); the page gives e-mail and phone. |
| `SITE_URL` | `https://bmibaku.az` (canonical URLs, sitemap, Open Graph). |

## Structure

```text
content/          migrated page content (JSON) + manifest.json
scripts/          content-sync.mjs, qa-routes.mjs, migration-report.mjs
src/
├── middleware.ts       locale routing (AZ unprefixed, /en, /fa)
├── app/[locale]/       layout, home page, [slug] pages (template switch), page transition
├── app/api/            rates/history, credit-application, contact
├── content/            routes.ts (route table), load.ts, nav.ts, types.ts
├── components/         layout, templates, blocks, banking, home, motion, ui
├── data/               banking.ts, loanProducts.ts, currencies.ts, discrepancies.ts
├── i18n/               az.ts (source + type), en.ts, fa.ts, config.ts, client.tsx
├── lib/                rates.ts, forms.ts (server-only)
└── utils/              decimal.ts, currency.ts, calculations.ts, validation.ts
```

## Data accuracy

Content is imported from the official sites, never rewritten by hand. Nothing without a source is invented: no property listings, no rates, no translations. Pages without an official translation show the Azerbaijani text with a notice.

Five inconsistencies found in the source wait for the bank's decision. They are listed in `src/data/discrepancies.ts` and in the migration report: loan rates on the home page vs. the product pages, "94 years", a hidden residential listing, and outdated English financial pages.

## Brand assets

The official files were taken from bmibaku.az on 2026-11-22 (`/wp-content/uploads/2019/12/`).

| File | Source | Used in |
| --- | --- | --- |
| `public/brand/bmi-emblem.png` (128 px) | `cropped-Logo-azeri-…-192x192.png`, trimmed | Header, footer, MİLLİ KART visual |
| `public/brand/bmi-logo-lockup.png` | `Logo-english.png`, unchanged | JSON-LD `logo`, social image |
| `public/favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png` | The site's own favicon crops, unchanged | Browser tab and home-screen icons |
| `public/og-image.png` (1200×630) | The lockup centered on white | `og:image` |

Page images and PDF documents still load from bmibaku.az `/wp-content/uploads/`; mirror them before the old site is retired.

## Quality (production build, 2026-11-22)

- **Automated QA (`npm run qa`):**
  - 140 page loads: every AZ route plus EN/FA samples, at 1440 and 390 px.
  - Each load: HTTP 200, one `<h1>`, correct `lang`/`dir`, no horizontal overflow, no console or hydration errors.
  - 165 internal links, none broken.
  - 15 functional checks: form API guards, rates history API, gallery keyboard navigation, calculator, converter, content visible without JavaScript.
- **Lighthouse desktop** (home, financial reports, calculator, FA home): Performance 99–100, Accessibility 100, Best Practices 100, SEO 100.
- **Lighthouse mobile** (same pages):
  - Performance 86–92, Accessibility 100, Best Practices 100, SEO 100.
  - LCP 3.0–3.5 s under Lighthouse's simulated slow 4G; CLS 0.
- **Not covered:** screen-reader walkthrough, real iOS/Android devices, form submission to a live endpoint.
