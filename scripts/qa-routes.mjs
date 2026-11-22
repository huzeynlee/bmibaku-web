#!/usr/bin/env node
/**
 * Automated route QA against a running build (`npm run build && npm start`).
 *
 * For every route (AZ) and a sample of EN/FA routes, at 1440px and 390px:
 *   HTTP status, <h1> present, html lang/dir, horizontal overflow, console errors.
 * Then every internal link found on those pages is requested once.
 *
 * Usage: node scripts/qa-routes.mjs [baseUrl] [--shots]   (default http://localhost:3000)
 *        --shots also saves a full-page screenshot per page
 * Env:   CHROME_PATH  path to Chrome/Chromium (puppeteer-core does not download one)
 * Out:   reports/qa-results.json, reports/screenshots/*.jpg (git-ignored)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const positional = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const SHOTS_ON = process.argv.includes('--shots');
const BASE = (positional[0] || 'http://localhost:3000').replace(/\/$/, '');
const OUT = path.join(ROOT, 'reports');
const SHOTS = path.join(OUT, 'screenshots');
fs.mkdirSync(SHOTS, { recursive: true });

const CHROME =
  process.env.CHROME_PATH ||
  [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find((p) => fs.existsSync(p));
if (!CHROME) {
  console.error('Chrome not found. Set CHROME_PATH.');
  process.exit(1);
}

const routesSrc = fs.readFileSync(path.join(ROOT, 'src/content/routes.ts'), 'utf8');
const slugs = [...routesSrc.matchAll(/\{ slug: '([^']+)', section:/g)].map((m) => m[1]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const EN_SAMPLE = ['', 'ferdi-bankciliq', 'kreditler-ferdi', 'haqqimizda', 'maliyye-hesabatlari', 'foto-qalereya', 'contact', 'kredit-kalkulatoru', 'valyuta-tarixcesi'];
const FA_SAMPLE = ['', 'korporativ-bankciliq', 'balans', 'kredit-kalkulatoru', 'online-kredit-sifarisi', 'contact'];
const targets = [
  ...['', ...slugs].map((s) => ({ locale: 'az', path: s ? `/${s}/` : '/' })),
  ...EN_SAMPLE.map((s) => ({ locale: 'en', path: s ? `/en/${s}/` : '/en/' })),
  ...FA_SAMPLE.map((s) => ({ locale: 'fa', path: s ? `/fa/${s}/` : '/fa/' })),
];
const VIEWPORTS = [
  [1440, 900],
  [390, 844],
];

// Pages run in parallel tabs; stop Chrome from throttling the ones in the background.
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  protocolTimeout: 120000,
  args: ['--hide-scrollbars', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'],
});
const results = [];
const internalLinks = new Map(); // href -> first page it was found on
const jobs = targets.flatMap((target) => VIEWPORTS.map(([width, height]) => ({ target, width, height })));
// Each page gets its own browser context: tabs in one context are "hidden" and throttled,
// which stops in-view animations and screenshots.
const CONCURRENCY = 4;

async function check({ target, width, height }) {
  {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    const errors = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text().slice(0, 200));
    });
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message.slice(0, 200)}`));
    page.on('requestfailed', (r) => {
      // Third-party embeds (maps, fonts) are out of scope.
      if (r.url().startsWith(BASE)) errors.push(`requestfailed: ${r.url().slice(0, 160)}`);
    });
    await page.setCacheEnabled(false);
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
    let status = 0;
    try {
      // Not networkidle: next/link prefetching keeps the network busy.
      const res = await page.goto(BASE + target.path, { waitUntil: 'load', timeout: 45000 });
      status = res ? res.status() : 0;
    } catch (e) {
      errors.push(`navigation: ${e.message.slice(0, 120)}`);
    }
    // Scroll through the page so in-view reveals and lazy images run.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * 0.5) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 200));
      }
      window.scrollTo(0, 0);
    });
    await sleep(1200);
    const m = await page.evaluate(() => {
      const main = document.querySelector('main');
      const hidden = [...document.querySelectorAll('main [data-reveal]')].filter((el) => getComputedStyle(el).opacity === '0').length;
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        h1: [...document.querySelectorAll('h1')].map((x) => x.textContent.trim()),
        lang: document.documentElement.lang,
        dir: document.documentElement.dir,
        words: (main?.innerText || '').split(/\s+/).filter(Boolean).length,
        links: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')),
        title: document.title,
        hiddenAfterScroll: hidden,
      };
    });
    for (const l of m.links) {
      const href = l.split('#')[0].split('?')[0];
      if (!internalLinks.has(href)) internalLinks.set(href, `${target.path} @${width}`);
    }
    const expectedDir = target.locale === 'fa' ? 'rtl' : 'ltr';
    if (m.lang !== target.locale) errors.push(`lang="${m.lang}", expected "${target.locale}"`);
    if (m.dir !== expectedDir) errors.push(`dir="${m.dir}", expected "${expectedDir}"`);
    if (m.h1.length !== 1) errors.push(`${m.h1.length} <h1> elements`);
    if (m.hiddenAfterScroll) errors.push(`${m.hiddenAfterScroll} reveal element(s) still invisible after scroll`);
    const name = `${target.path.replace(/\//g, '_') || '_'}-${width}`;
    if (SHOTS_ON) try {
      await page.screenshot({ path: path.join(SHOTS, `${name}.jpg`), type: 'jpeg', quality: 65, fullPage: true });
    } catch (e) {
      console.warn(`\nscreenshot failed for ${target.path} @${width}: ${e.message.slice(0, 80)}`);
    }
    results.push({ path: target.path, locale: target.locale, width, status, overflow: m.overflow, h1: m.h1[0] ?? '', words: m.words, title: m.title, errors });
    await context.close();
    process.stdout.write('.');
  }
}

let next = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (next < jobs.length) await check(jobs[next++]);
  }),
);
results.sort((a, b) => targets.findIndex((t) => t.path === a.path) - targets.findIndex((t) => t.path === b.path) || b.width - a.width);
process.stdout.write('\n');

const broken = [];
for (const [href, foundOn] of internalLinks) {
  try {
    const res = await fetch(BASE + href, { redirect: 'manual' });
    if (res.status >= 400) broken.push(`${href} -> ${res.status} (linked from ${foundOn})`);
  } catch (e) {
    broken.push(`${href} -> ${e.message}`);
  }
}

/* ---------- Functional checks ---------- */
const functional = [];
const record = (name, pass, detail = '') => functional.push({ name, pass, detail });

// Form APIs: each test uses its own X-Real-IP so the rate limiter does not interfere.
let ipSeq = 0;
const post = (url, body, headers = {}) =>
  fetch(BASE + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: BASE, 'X-Real-IP': `10.0.0.${++ipSeq}`, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
const validApplication = {
  fullName: 'Test Testov Testoviç',
  fin: '1AB2C3D',
  amount: '5000',
  currency: 'AZN',
  term: 24,
  workplace: 'Test MMC',
  salary: '1500',
  phone: '+994501234567',
  purpose: 'Test',
  consentRegistry: true,
  consentAsan: true,
};
const endpointConfigured = Boolean(process.env.CREDIT_APPLICATION_ENDPOINT);
{
  let r = await post('/api/credit-application', validApplication);
  record('credit-application: valid payload without endpoint → 503 not_configured', endpointConfigured || r.status === 503, `HTTP ${r.status}`);
  r = await post('/api/credit-application', { ...validApplication, fin: '', consentAsan: false });
  const j = await r.json().catch(() => ({}));
  record('credit-application: invalid payload → 422 with field list', r.status === 422 && j.fields?.includes('fin') && j.fields?.includes('consentAsan'), `HTTP ${r.status} ${JSON.stringify(j.fields)}`);
  r = await post('/api/credit-application', validApplication, { Origin: 'https://evil.example' });
  record('credit-application: foreign Origin → 403', r.status === 403, `HTTP ${r.status}`);
  r = await post('/api/credit-application', { ...validApplication, website: 'bot' });
  record('credit-application: honeypot filled → 400', r.status === 400, `HTTP ${r.status}`);
  r = await post('/api/credit-application', JSON.stringify({ ...validApplication, purpose: 'x'.repeat(20000) }));
  record('credit-application: body over 16 KB → 413', r.status === 413, `HTTP ${r.status}`);
  const ip = { 'X-Real-IP': '10.9.9.9' };
  const statuses = [];
  for (let i = 0; i < 6; i++) statuses.push((await post('/api/credit-application', validApplication, ip)).status);
  record('credit-application: 6th request in 10 min from one IP → 429', statuses[5] === 429, statuses.join(','));
  r = await post('/api/contact', { kind: 'complaint', name: 'Test Testov', email: 'test@example.com', topic: 'Test', message: 'Test message body' });
  record('contact: valid payload without endpoint → 503 not_configured', Boolean(process.env.CONTACT_ENDPOINT) || r.status === 503, `HTTP ${r.status}`);
  r = await post('/api/contact', { name: 'x', email: 'bad', message: 'short' });
  record('contact: invalid payload → 422', r.status === 422, `HTTP ${r.status}`);
}

// Rates history API (needs bmibaku.az to be reachable).
{
  let r = await fetch(`${BASE}/api/rates/history?currency=USD&page=1`);
  const j = await r.json().catch(() => ({}));
  record('rates history: USD page 1 → points from official archive', r.status === 200 && Array.isArray(j.points) && j.points.length > 0, `HTTP ${r.status}, ${j.points?.length ?? 0} points`);
  r = await fetch(`${BASE}/api/rates/history?from=2026-12-01&to=2026-01-01`);
  record('rates history: reversed range → 400', r.status === 400, `HTTP ${r.status}`);
  r = await fetch(`${BASE}/api/rates/history?currency=XXX`);
  record('rates history: unknown currency → 400', r.status === 400, `HTTP ${r.status}`);
}

// Browser interactions.
{
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Gallery lightbox with keyboard.
  await page.goto(`${BASE}/foto-qalereya/`, { waitUntil: 'load' });
  await page.waitForSelector('main button img');
  await page.evaluate(() => document.querySelector('main button img').closest('button').click());
  await page.waitForSelector('dialog[open]', { timeout: 5000 }).catch(() => null);
  const counter = () => page.evaluate(() => document.querySelector('dialog[open] [aria-live]')?.textContent.trim() ?? null);
  const c1 = await counter();
  await page.keyboard.press('ArrowRight');
  await sleep(300);
  const c2 = await counter();
  await page.keyboard.press('Escape');
  await sleep(400);
  const closed = await page.evaluate(() => !document.querySelector('dialog[open]'));
  record('gallery: click opens lightbox, → moves to next photo, Esc closes', Boolean(c1) && c1 !== c2 && closed, `${c1} → ${c2}, closed=${closed}`);

  // Loan calculator reacts to the amount slider.
  await page.goto(`${BASE}/kredit-kalkulatoru/`, { waitUntil: 'load' });
  await page.waitForSelector('#calc-summary');
  await sleep(1500);
  const summary = () => page.evaluate(() => document.getElementById('calc-summary').parentElement.innerText.replace(/\s+/g, ' '));
  const s1 = await summary();
  await page.focus('main input[type="range"]');
  await page.keyboard.press('End');
  await sleep(1500);
  const s2 = await summary();
  record('calculator: moving the amount slider changes the result', s1 !== s2, `${s1.slice(0, 60)} → ${s2.slice(0, 60)}`);

  // Converter on the home page.
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  await page.waitForSelector('#rates input[inputmode="decimal"]');
  const out = () => page.evaluate(() => document.querySelector('#rates output')?.textContent.trim());
  const o1 = await out();
  await page.click('#rates input[inputmode="decimal"]', { count: 3 });
  await page.keyboard.type('250');
  await sleep(700);
  const o2 = await out();
  record('converter: typing an amount updates the result', Boolean(o2) && o1 !== o2, `${o1} → ${o2}`);
  await context.close();
}

// Content is never left hidden: if JavaScript fails to download, the CSS failsafe shows it.
{
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setRequestInterception(true);
  page.on('request', (r) => (r.resourceType() === 'script' ? r.abort() : r.continue()));
  await page.goto(`${BASE}/haqqimizda/`, { waitUntil: 'load' });
  const hiddenNow = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter((el) => getComputedStyle(el).opacity === '0').length);
  await sleep(5500);
  const hiddenLater = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter((el) => getComputedStyle(el).opacity === '0').length);
  const h1Visible = await page.evaluate(() => {
    const line = document.querySelector('h1 .mask-line');
    return line ? getComputedStyle(line).transform === 'none' || getComputedStyle(line).transform === 'matrix(1, 0, 0, 1, 0, 0)' : false;
  });
  record('no JavaScript: hero headline renders, hidden reveal blocks appear after 5 s', h1Visible && hiddenLater === 0, `h1=${h1Visible}, hidden ${hiddenNow} → ${hiddenLater}`);
  await context.close();
}
await browser.close();

fs.writeFileSync(
  path.join(OUT, 'qa-results.json'),
  JSON.stringify({ base: BASE, ranAt: new Date().toISOString(), results, broken, linkCount: internalLinks.size, functional }, null, 1),
);
const bad = results.filter((r) => r.status !== 200 || r.overflow > 0 || r.errors.length || !r.h1);
const failedChecks = functional.filter((f) => !f.pass);
console.log(`${results.length} page loads, ${bad.length} with issues; ${internalLinks.size} internal links, ${broken.length} broken; ${functional.length} functional checks, ${failedChecks.length} failed.`);
for (const r of bad) console.log(`  ${r.path} @${r.width}: HTTP ${r.status}, overflow ${r.overflow}px, ${r.errors.join(' | ')}`);
for (const b of broken) console.log(`  broken: ${b}`);
for (const f of functional) console.log(`  ${f.pass ? 'PASS' : 'FAIL'} ${f.name} (${f.detail})`);
process.exit(bad.length || broken.length || failedChecks.length ? 1 : 0);
