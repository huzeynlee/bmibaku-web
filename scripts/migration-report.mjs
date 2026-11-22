#!/usr/bin/env node
/**
 * Route-by-route migration report.
 *
 * Inputs (all local, no network):
 *   content/manifest.json, content/pages/{az,en}/*.json   (from `npm run content:sync`)
 *   src/content/routes.ts                                (route table)
 *   src/data/discrepancies.ts                            (open source inconsistencies)
 *   reports/qa-results.json                              (from `npm run qa`, optional)
 *
 * Output: docs/MIGRATION-REPORT.md
 *
 * Usage: node scripts/migration-report.mjs [--qa=reports/qa-results.json] [--out=docs/MIGRATION-REPORT.md]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const QA_PATH = path.resolve(ROOT, arg('qa', 'reports/qa-results.json'));
const OUT_PATH = path.resolve(ROOT, arg('out', 'docs/MIGRATION-REPORT.md'));

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const manifest = readJson(path.join(ROOT, 'content/manifest.json'));

function loadPage(locale, slug) {
  const p = path.join(ROOT, 'content/pages', locale, `${slug}.json`);
  return fs.existsSync(p) ? readJson(p) : null;
}

/* Route table: parsed from routes.ts so the report never drifts from the app. */
const routesSrc = fs.readFileSync(path.join(ROOT, 'src/content/routes.ts'), 'utf8');
const ROUTES = [...routesSrc.matchAll(/\{ slug: '([^']+)', section: '([^']+)', template: '([^']+)'(?:, parent: '([^']+)')?(?:, group: '([^']+)')?/g)].map(
  (m) => ({ slug: m[1], section: m[2], template: m[3], parent: m[4] ?? null, group: m[5] ?? null }),
);
const EXCLUDED = [...routesSrc.matchAll(/\{ slug: '([^']+)', reason: '([^']+)' \}/g)].map((m) => ({ slug: m[1], reason: m[2] }));

/* Discrepancies: id, topic and the pages they mention. */
const discSrc = fs.readFileSync(path.join(ROOT, 'src/data/discrepancies.ts'), 'utf8');
const DISCREPANCIES = discSrc
  .split(/\n  \{\n/)
  .slice(1)
  .map((chunk) => ({
    id: chunk.match(/id: '([^']+)'/)?.[1],
    topic: chunk.match(/topic: '([^']+)'/)?.[1],
    handling: chunk.match(/handling: '([^']+)'/)?.[1],
    values: [...chunk.matchAll(/\{ where: '([^']+)', value: '([^']+)' \}/g)].map((m) => ({ where: m[1], value: m[2] })),
  }))
  .filter((d) => d.id);
const DISCREPANCY_ROUTES = {
  'cash-loan-rate': ['', 'kreditler-ferdi', 'kredit-kalkulatoru'],
  'business-loan-rate': ['', 'kreditler-ferdi', 'kreditler-korporativ', 'kredit-kalkulatoru'],
  'heritage-years': [''],
  'residential-listing-hidden': ['yasayis-evleri-menziller'],
  'en-content-age': ['balans', 'menfeet-zerer', 'kapitalda-deyisiklikler-haqqinda-hesabat', 'pul-vesaitlerinin-hereketi'],
};

const EN_ONLY_NOTES = {
  '/photo-gallery/': 'Same 9 photos as the AZ gallery. Redirects to `/en/foto-qalereya/`.',
  '/exchange-rate-api/': 'Empty page. Redirects to `/en/valyuta-tarixcesi/`.',
  '/valyuta-mezenne-api/': 'Header-less rates widget made for iframe embedding. Redirects to `/en/valyuta-tarixcesi/`. ⚠ If partner sites embed it, the bank must decide on a replacement widget (this site sends X-Frame-Options: DENY).',
};

const qa = fs.existsSync(QA_PATH) ? readJson(QA_PATH) : null;

const az = new Map(manifest.pages.filter((p) => p.locale === 'az').map((p) => [p.slug, p]));
const en = new Map(manifest.pages.filter((p) => p.locale === 'en' && p.slug).map((p) => [p.slug, p]));
const enOnly = manifest.pages.filter((p) => p.locale === 'en' && p.status === 'no-az-counterpart');

const date = (iso) => (iso ? iso.slice(0, 10) : '—');
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const newRoute = (slug, locale) => (locale === 'az' ? '' : `/${locale}`) + (slug ? `/${slug}/` : '/');

/* What a reader can do on the page, beyond reading. */
const TEMPLATE_FEATURES = {
  overview: ['Section overview with service tiles'],
  hub: ['Grouped institutional index', 'Requisites with copy buttons', 'Heritage timeline'],
  content: [],
  gallery: ['Masonry gallery', 'Lightbox (keyboard: ←/→/Esc, RTL-aware)'],
  contact: ['General / complaint form (POST /api/contact)', 'Map', 'SWIFT & requisites', 'Consumer-rights links'],
  calculator: ['Loan calculator (annuity, 8 products)', 'Official terms accordion', 'Link to legacy calculator'],
  application: ['Multi-step credit application (POST /api/credit-application)', 'Consent checkboxes'],
  rates: ['Latest official rates', 'Converter', 'History filter + pagination (GET /api/rates/history)', 'Line chart for single currency'],
  property: ['Listings split by gallery', 'Empty state when source has none', 'Inquiry CTA'],
  home: ['Hero with 3D card (pointer tilt)', 'Promo loan tabs', 'Live rates + converter', 'Calculator preview', 'Metrics count-up', 'News'],
};

function blockFeatures(page) {
  if (!page) return [];
  const types = new Set(page.blocks.map((b) => b.type));
  const out = [];
  if (page.documents?.length) out.push(page.documents.length > 6 ? 'Document archive (search + year filter)' : 'Document list');
  if (types.has('table')) out.push(`${page.blocks.filter((b) => b.type === 'table').length} table(s)`);
  if (types.has('accordion')) out.push('Accordion');
  if (types.has('gallery')) out.push('Gallery');
  if (types.has('map')) out.push('Embedded map');
  if (types.has('links')) out.push('Link tiles');
  return out;
}

function contentCell(src, page) {
  if (!src) return 'Not in source';
  if (src.status === 'empty-in-source') return 'Empty in source';
  if (src.status === 'no-content-in-source') {
    const hidden = page?.hiddenContent?.length;
    return hidden ? `No visible content (${hidden} block(s) hidden on all devices in source; not published)` : 'No content in source';
  }
  const s = src.stats;
  const parts = [`${s.words} words`];
  if (s.tables) parts.push(`${s.tables} table(s)`);
  if (s.images) parts.push(`${s.images} image(s)`);
  if (s.forms) parts.push(`${s.forms} form(s)`);
  return `Migrated: ${parts.join(', ')}`;
}

function documentsCell(page) {
  const docs = page?.documents ?? [];
  if (!docs.length) return '0';
  const years = docs.map((d) => d.year).filter(Boolean);
  const [lo, hi] = [Math.min(...years), Math.max(...years)];
  const range = years.length ? ` (${lo === hi ? lo : `${lo}–${hi}`})` : '';
  const exts = [...new Set(docs.map((d) => d.ext).filter(Boolean))].join('/');
  return `${docs.length} ${exts}${range}`;
}

function enCell(slug) {
  const p = en.get(slug || 'index');
  if (!p) return 'No EN page → AZ fallback';
  if (p.status !== 'migrated') return `${p.status} → AZ fallback`;
  return `Official EN (${date(p.modified)})`;
}

function qaFor(pathname) {
  if (!qa) return null;
  return qa.results.filter((r) => r.path === pathname);
}

function qaCell(slug) {
  if (!qa) return 'Not run';
  const cells = [];
  for (const locale of ['az', 'en', 'fa']) {
    const rows = qaFor(newRoute(slug, locale));
    if (!rows.length) continue;
    const fails = rows.filter((r) => r.status !== 200 || r.overflow > 0 || r.errors.length || !r.h1);
    const label = locale.toUpperCase();
    if (!fails.length) cells.push(`${label} ✓ (${rows.map((r) => r.width).join('/')})`);
    else
      cells.push(
        `${label} ✗ ${fails
          .map((r) => `@${r.width}: ${[r.status !== 200 && `HTTP ${r.status}`, r.overflow > 0 && `overflow ${r.overflow}px`, r.errors.length && `${r.errors.length} console error(s)`, !r.h1 && 'no h1'].filter(Boolean).join(', ')}`)
          .join('; ')}`,
      );
  }
  return cells.join('<br>') || 'Not run';
}

function verificationCell(slug, src) {
  const bits = [];
  if (src?.modified) bits.push(`Source updated ${date(src.modified)}`);
  bits.push('Crawled ' + date(manifest.crawledAt?.az ?? manifest.generatedAt));
  const disc = Object.entries(DISCREPANCY_ROUTES)
    .filter(([, routes]) => routes.includes(slug))
    .map(([id]) => `⚠ ${id}`);
  bits.push(...disc);
  return bits.join('<br>');
}

/* ---------- Build rows ---------- */
const rows = [];
const home = az.get('index');
rows.push({
  slug: '',
  original: `[bmibaku.az/](${manifest.sources.az}/)`,
  originalEn: `[en.bmibaku.az/](${manifest.sources.en}/)`,
  newRoutes: ['/', '/en/', '/fa/'],
  content: contentCell(home, loadPage('az', 'index')),
  features: TEMPLATE_FEATURES.home,
  external: home?.externalLinks ?? [],
  documents: '0',
  en: enCell(''),
  verification: verificationCell('', home),
  testing: qaCell(''),
});
for (const r of ROUTES) {
  const src = az.get(r.slug);
  const page = loadPage('az', r.slug);
  const enPage = en.get(r.slug);
  rows.push({
    slug: r.slug,
    template: r.template,
    original: src ? `[/${r.slug}/](${src.sourceUrl})` : '— (new route)',
    originalEn: enPage ? `[${new URL(enPage.sourceUrl).pathname}](${enPage.sourceUrl})` : '—',
    newRoutes: ['az', 'en', 'fa'].map((l) => newRoute(r.slug, l)),
    content: contentCell(src, page),
    features: [...TEMPLATE_FEATURES[r.template], ...blockFeatures(page)],
    external: src?.externalLinks ?? [],
    documents: documentsCell(page),
    en: enCell(r.slug),
    verification: verificationCell(r.slug, src),
    testing: qaCell(r.slug),
  });
}

/* ---------- Summary numbers ---------- */
const count = (list, status) => list.filter((p) => p.status === status).length;
const azPages = [...az.values()];
const enPages = manifest.pages.filter((p) => p.locale === 'en');
const qaRows = qa?.results ?? [];
const qaFails = qaRows.filter((r) => r.status !== 200 || r.overflow > 0 || r.errors.length || !r.h1);
const totalDocs = rows.reduce((n, r) => n + (parseInt(r.documents, 10) || 0), 0);
const totalExternal = new Set(rows.flatMap((r) => r.external)).size;
const uninspected = ROUTES.filter((r) => !az.has(r.slug));

/* ---------- Markdown ---------- */
const L = [];
L.push('# Migration report — bmibaku.az → Next.js');
L.push('');
L.push(`Generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC by \`npm run report\`. Source crawl: ${(manifest.crawledAt?.az ?? manifest.generatedAt).slice(0, 16).replace('T', ' ')} UTC (WordPress REST API, ${manifest.sources.az} and ${manifest.sources.en}); parsed ${manifest.generatedAt.slice(0, 16).replace('T', ' ')} UTC.`);
L.push('');
L.push('## Summary');
L.push('');
L.push('| Item | Value |');
L.push('|---|---|');
L.push(`| AZ source pages inspected | ${azPages.length} (${count(azPages, 'migrated')} migrated, ${count(azPages, 'no-content-in-source')} without visible content, ${count(azPages, 'empty-in-source')} empty) |`);
L.push(`| EN source pages inspected | ${enPages.length} (${count(enPages, 'migrated')} migrated, ${count(enPages, 'no-content-in-source')} without visible content, ${count(enPages, 'empty-in-source')} empty, ${enOnly.length} without AZ counterpart) |`);
L.push(`| Routes published | ${ROUTES.length + 1} per locale (home + ${ROUTES.length}), × 3 locales (AZ, EN, FA) = ${(ROUTES.length + 1) * 3} pages |`);
L.push(`| Source pages not published | ${EXCLUDED.length} (see “Excluded source pages”) |`);
L.push(`| Routes without an inspected source page | ${uninspected.length ? uninspected.map((r) => r.slug).join(', ') : 'none'} |`);
L.push(`| Documents linked (AZ) | ${totalDocs} (served from original bmibaku.az URLs, not mirrored) |`);
L.push(`| Distinct external links in AZ page content | ${totalExternal} |`);
L.push(`| Open discrepancies | ${DISCREPANCIES.length} |`);
L.push(
  `| Automated QA | ${qa ? `${qaRows.length} page loads (${new Set(qaRows.map((r) => r.path)).size} URLs × desktop 1440 / mobile 390), ${qaFails.length} with issues; ${qa.linkCount} internal links checked, ${qa.broken.length} broken` : 'not run'} |`,
);
if (qa?.functional) {
  L.push(`| Functional checks | ${qa.functional.length} run, ${qa.functional.filter((f) => !f.pass).length} failed (see “Functional checks”) |`);
}
if (qa?.ranAt) L.push(`| QA run | ${qa.ranAt.slice(0, 16).replace('T', ' ')} UTC against \`${qa.base}\` |`);
L.push('');
L.push('**Migration status:** content for every inspected page is migrated or explicitly flagged below. The site is **not production-ready** until the open items at the end of this report are closed.');
L.push('');
L.push('### How to read the table');
L.push('');
L.push('- **Content migrated** — counts from the source page after removing Elementor duplicates (desktop-hidden mobile copies). “No visible content” means the source page exists but shows nothing; its hidden blocks were recorded, not published.');
L.push('- **EN** — official English text from en.bmibaku.az is used when it exists. Otherwise the page shows the Azerbaijani text with a visible notice. **FA** always shows Azerbaijani content with a notice: the source site has no Persian content, and no machine translation is shown.');
L.push('- **Testing** — automated checks on the production build: HTTP 200, one `<h1>`, no horizontal overflow, no console errors. ✓ lists the viewport widths tested.');
L.push('');
L.push('## Route-by-route');
L.push('');
L.push('| # | Original route | New route (AZ · EN · FA) | Content migrated | Functional elements | External links | Documents | EN content | Verification | Testing |');
L.push('|---|---|---|---|---|---|---|---|---|---|');
rows.forEach((r, i) => {
  L.push(
    `| ${i + 1} | ${r.original}${r.originalEn !== '—' ? `<br>EN: ${r.originalEn}` : ''} | ${r.newRoutes.map((p) => `\`${p}\``).join('<br>')} | ${esc(r.content)} | ${esc(r.features.join('; ') || 'Text content')} | ${r.external.length} | ${esc(r.documents)} | ${esc(r.en)} | ${r.verification} | ${r.testing} |`,
  );
});
L.push('');

L.push('## Excluded source pages and redirects');
L.push('');
L.push('| Source page | Status in source | Handling |');
L.push('|---|---|---|');
for (const e of EXCLUDED) {
  const src = az.get(e.slug);
  L.push(`| ${src ? `[/${e.slug}/](${src.sourceUrl})` : `/${e.slug}/`} | ${src?.status ?? '—'} | ${esc(e.reason)} |`);
}
for (const p of enOnly) {
  L.push(`| [${new URL(p.sourceUrl).pathname}](${p.sourceUrl}) (EN only) | ${p.status} | ${EN_ONLY_NOTES[new URL(p.sourceUrl).pathname] ?? 'Not migrated as a separate page.'} |`);
}
L.push('');
L.push('Old English URLs (`en.bmibaku.az/<slug>/`) redirect permanently to `/en/<az-slug>/` when that host points to this app (see `next.config.mjs`).');
L.push('');

L.push('## Discrepancies found in the source');
L.push('');
L.push('None was resolved silently. Each needs a decision by the bank.');
L.push('');
for (const d of DISCREPANCIES) {
  L.push(`### ${d.topic} (\`${d.id}\`)`);
  L.push('');
  for (const v of d.values) L.push(`- ${v.where}: **${v.value}**`);
  if (d.handling) L.push(`- Current handling: ${d.handling}`);
  L.push('');
}

if (qa?.functional) {
  L.push('## Functional checks');
  L.push('');
  L.push('| Check | Result | Detail |');
  L.push('|---|---|---|');
  for (const f of qa.functional) L.push(`| ${esc(f.name)} | ${f.pass ? '✓ pass' : '✗ fail'} | ${esc(f.detail)} |`);
  L.push('');
}

if (qa && (qaFails.length || qa.broken.length)) {
  L.push('## QA issues');
  L.push('');
  for (const r of qaFails) L.push(`- \`${r.path}\` @${r.width}px: HTTP ${r.status}, overflow ${r.overflow}px, errors: ${esc(r.errors.join(' / ') || 'none')}`);
  for (const b of qa.broken) L.push(`- Broken internal link: \`${b}\``);
  L.push('');
}

L.push('## External links by route');
L.push('');
for (const r of rows.filter((x) => x.external.length)) {
  L.push(`**${r.newRoutes[0]}**`);
  L.push('');
  for (const href of r.external) L.push(`- <${href}>`);
  L.push('');
}

L.push('## Open items (not done or not verified)');
L.push('');
L.push('1. **Credit application endpoint.** The form collects FİN, salary and phone. `CREDIT_APPLICATION_ENDPOINT` stays unset until legal, data-protection and security teams approve the receiving system. Until then the API answers `503 not_configured` and the form says so.');
L.push('2. **Contact / complaint endpoint.** Same: `CONTACT_ENDPOINT` must point to the bank’s ticketing system.');
L.push('3. **Discrepancies** above need an official answer (loan rates, “94 years”, hidden property listing, outdated EN financial pages).');
L.push('4. **Translations.** EN interface text and all FA text are marked “under review” on the site. FA page content is Azerbaijani until official Persian text exists.');
L.push('5. **Assets.** Images and documents load from bmibaku.az `/wp-content/uploads/`. Mirror them before the old WordPress site is switched off.');
L.push('6. **Rates source.** Current and historical rates are read from the old WordPress plugin (`admin-ajax.php?action=mv_cr_read`). It must stay online, or be replaced, when WordPress is retired. One transient 502 was seen during QA; requests now retry once.');
L.push('7. **Dependency advisory.** `npm audit` reports PostCSS advisories in the copy bundled inside Next.js 15 (build-time only; it processes this project’s own CSS). The fix ships with Next.js 16, a major upgrade to plan separately.');
L.push('8. **Not covered by automated QA:** screen-reader walkthrough, real iOS/Android devices, form submission to a live endpoint, every EN/FA route in a browser (a sample is loaded; all are built and link-checked). Lighthouse was run on 4 pages only (desktop 99–100 / 100 / 100 / 100; mobile performance 86–92, other categories 100).');
L.push('');

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, L.join('\n'));
console.log(`Wrote ${path.relative(ROOT, OUT_PATH)}: ${rows.length} routes, ${qa ? `${qaRows.length} QA rows` : 'no QA data'}.`);
