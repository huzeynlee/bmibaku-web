#!/usr/bin/env node
/**
 * Content migration: bmibaku.az (AZ) + en.bmibaku.az (EN) → content/*.json
 *
 * Reads every page through the WordPress REST API, converts Elementor markup
 * into typed content blocks, and writes:
 *   content/pages/<locale>/<az-slug>.json   one file per page
 *   content/manifest.json                   inventory of every source page
 *
 * Usage: npm run content:sync            (fetches live)
 *        npm run content:sync -- --cache=<dir>   (reuse <dir>/<lang>-pages.json)
 *
 * Nothing is invented: blocks only contain text, tables, links and media
 * present in the source. Files and images keep their original URLs.
 */
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const OUT = path.join(ROOT, 'content');
const SOURCES = { az: 'https://bmibaku.az', en: 'https://en.bmibaku.az' };
const FILE_RE = /\.(pdf|docx?|xlsx?|pptx?|zip|rar)(\?|#|$)/i;
const cacheArg = process.argv.find((a) => a.startsWith('--cache='));
const CACHE = cacheArg ? cacheArg.slice(8) : null;

// ---------------------------------------------------------------- fetching
/** When the source pages were fetched: now, or the cache file's time with --cache. */
const crawledAt = {};

async function fetchPages(lang) {
  if (CACHE) {
    const file = path.join(CACHE, `${lang}-pages.json`);
    if (fs.existsSync(file)) {
      crawledAt[lang] = fs.statSync(file).mtime.toISOString();
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  }
  crawledAt[lang] = new Date().toISOString();
  const pages = [];
  for (let page = 1; ; page++) {
    const url = `${SOURCES[lang]}/wp-json/wp/v2/pages?per_page=100&page=${page}&_fields=id,slug,link,title,parent,date,modified,content`;
    const res = await fetch(url, { headers: { 'User-Agent': 'bmibaku-content-sync/1.0' } });
    if (res.status === 400) break;
    if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
    pages.push(...(await res.json()));
    if (page >= Number(res.headers.get('x-wp-totalpages') || 1)) break;
  }
  return pages;
}

// ---------------------------------------------------------------- helpers
const clean = (s) => (s || '').replace(/[​‎‏﻿]/g, '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

function absUrl(href, lang) {
  if (!href) return null;
  href = href.trim();
  if (href.startsWith('#') || href.startsWith('javascript:')) return null;
  if (href.startsWith('mailto:') || href.startsWith('tel:')) return href;
  try {
    const u = new URL(href, SOURCES[lang] + '/');
    if (/(^|\.)bmibaku\.az$/.test(u.hostname)) u.protocol = 'https:';
    u.pathname = u.pathname.replace(/\/{2,}/g, '/');
    return u.toString();
  } catch {
    return null;
  }
}

/** Maps an absolute URL to a route of the new site when it points to a page. */
function toRoute(url, slugById, slugBySlug, lang) {
  if (!url || !/^https?:/.test(url)) return url;
  const u = new URL(url);
  const host = u.hostname.replace(/^www\./, '');
  if (host !== 'bmibaku.az' && host !== 'en.bmibaku.az') return url;
  if (u.pathname.startsWith('/wp-content/') || FILE_RE.test(u.pathname)) return url;
  const seg = u.pathname.split('/').filter(Boolean);
  if (seg.length === 0) return '/';
  const pageLang = host === 'en.bmibaku.az' ? 'en' : 'az';
  const slug = slugBySlug[pageLang]?.[seg[seg.length - 1]];
  if (slug) return slug === 'index' ? '/' : `/${slug}/`;
  if (u.searchParams.get('page_id')) {
    const s = slugById[Number(u.searchParams.get('page_id'))];
    if (s) return `/${s}/`;
  }
  return url;
}

/**
 * Document metadata. `year` is the reporting period: the first date in the title
 * ("31/12/2012", also the source's "31/12//2022" typo), else a year in the title or
 * file name. The upload folder (/uploads/2020/04/) is only the last resort: many
 * older reports were uploaded together in 2020.
 */
function docMeta(title, url) {
  const ext = (url.match(FILE_RE)?.[1] || '').toLowerCase();
  const dates = [...title.matchAll(/(\d{1,2})\s*[./-]+\s*(\d{1,2})\s*[./-]+\s*((?:19|20)\d{2})/g)].map(
    (m) => `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`,
  );
  const yearsIn = (s) => [...s.matchAll(/(?:^|\D)((?:19|20)\d{2})(?!\d)/g)].map((m) => Number(m[1]));
  const fileName = decodeURIComponent(url.split('/').pop() || '');
  const uploadYear = Number(url.match(/\/uploads\/((?:19|20)\d{2})\//)?.[1]) || null;
  const year = dates.length ? Number(dates[0].slice(0, 4)) : yearsIn(title)[0] ?? yearsIn(fileName)[0] ?? uploadYear;
  return { ext, year, dates };
}

// ---------------------------------------------------------------- converter
function createConverter($, ctx) {
  const ALLOWED = new Set(['a', 'strong', 'em', 'br', 'sup', 'sub', 'u']);

  function inline(el) {
    let html = '';
    $(el)
      .contents()
      .each((_, n) => {
        if (n.type === 'text') {
          html += escapeHtml(n.data.replace(/ /g, ' '));
          return;
        }
        if (n.type !== 'tag') return;
        let tag = n.tagName.toLowerCase();
        if (tag === 'b') tag = 'strong';
        if (tag === 'i') tag = 'em';
        if (tag === 'img' || tag === 'script' || tag === 'style') return;
        const inner = inline(n);
        if (tag === 'a') {
          const href = toRoute(absUrl($(n).attr('href'), ctx.lang), ctx.slugById, ctx.slugBySlug, ctx.lang);
          if (href && FILE_RE.test(href)) ctx.addDoc(clean($(n).text()) || ctx.currentHeading || 'Sənəd', href);
          if (href) ctx.addLink(href);
          html += href ? `<a href="${escapeAttr(href)}">${inner}</a>` : inner;
        } else if (ALLOWED.has(tag)) {
          html += tag === 'br' ? '<br>' : `<${tag}>${inner}</${tag}>`;
        } else {
          html += inner + (['p', 'div', 'li'].includes(tag) ? ' ' : '');
        }
      });
    return html.replace(/\s+/g, ' ').replace(/(<br>\s*)+$/g, '').trim();
  }

  function image(img) {
    const $i = $(img);
    const srcset = ($i.attr('srcset') || '').split(',').map((s) => s.trim().split(/\s+/)).filter((p) => p[0]);
    const best = srcset.sort((a, b) => parseInt(b[1] || '0') - parseInt(a[1] || '0'))[0]?.[0];
    const src = absUrl($i.attr('data-src') || best || $i.attr('src'), ctx.lang);
    if (!src) return null;
    ctx.images.add(src);
    return { src, alt: clean($i.attr('alt')), width: Number($i.attr('width')) || null, height: Number($i.attr('height')) || null };
  }

  function table(t) {
    const rows = [];
    $(t)
      .find('tr')
      .each((_, tr) => {
        const cells = [];
        $(tr)
          .children('td, th')
          .each((_, c) => {
            const cell = { html: inline(c) };
            const cs = Number($(c).attr('colspan'));
            const rs = Number($(c).attr('rowspan'));
            if (cs > 1) cell.colspan = cs;
            if (rs > 1) cell.rowspan = rs;
            if (c.tagName === 'th' || $(c).closest('thead').length) cell.header = true;
            cells.push(cell);
          });
        if (cells.some((c) => clean(c.html.replace(/<[^>]+>/g, '')) !== '') || cells.length > 1) rows.push(cells);
      });
    if (!rows.length) return null;
    ctx.stats.tables++;
    return { type: 'table', rows };
  }

  /** Generic HTML → blocks for rich-text containers. */
  function html(el, blocks = []) {
    $(el)
      .contents()
      .each((_, n) => {
        if (n.type === 'text') {
          const t = clean(n.data);
          if (t) pushParagraph(blocks, escapeHtml(t));
          return;
        }
        if (n.type !== 'tag') return;
        const tag = n.tagName.toLowerCase();
        if (['script', 'style', 'svg', 'noscript', 'form'].includes(tag)) return;
        if (/^h[1-6]$/.test(tag)) {
          const text = clean($(n).text());
          if (text) {
            ctx.currentHeading = text;
            blocks.push({ type: 'heading', level: Math.min(4, Math.max(2, Number(tag[1]))), text });
          }
        } else if (tag === 'p' || tag === 'blockquote') {
          $(n).find('img').each((_, i) => {
            const im = image(i);
            if (im) blocks.push({ type: 'image', ...im });
          });
          const h = inline(n);
          if (clean(h.replace(/<[^>]+>/g, ''))) pushParagraph(blocks, h);
        } else if (tag === 'ul' || tag === 'ol') {
          const items = $(n).children('li').map((_, li) => inline(li)).get().filter((x) => clean(x.replace(/<[^>]+>/g, '')));
          if (items.length) blocks.push({ type: 'list', ordered: tag === 'ol', items });
        } else if (tag === 'table') {
          const t = table(n);
          if (t) blocks.push(t);
        } else if (tag === 'img') {
          const im = image(n);
          if (im) blocks.push({ type: 'image', ...im });
        } else if (tag === 'iframe') {
          const src = absUrl($(n).attr('src') || $(n).attr('data-src'), ctx.lang);
          if (src) blocks.push({ type: 'embed', src, title: clean($(n).attr('title')) || null });
        } else if (tag === 'a') {
          const h = inline($('<p>').append($(n).clone()));
          if (clean(h.replace(/<[^>]+>/g, ''))) pushParagraph(blocks, h);
        } else {
          html(n, blocks);
        }
      });
    return blocks;
  }

  function pushParagraph(blocks, h) {
    blocks.push({ type: 'paragraph', html: h });
  }

  return { inline, image, table, html };
}

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = (s) => escapeHtml(s).replace(/"/g, '&quot;');

// ---------------------------------------------------------------- page parser
function parsePage(page, lang, slugById, slugBySlug, azSlug) {
  const $ = cheerio.load(page.content?.rendered || '');
  $('script, style, noscript').remove();
  // Content hidden on every device is withdrawn on the live site: record it, do not publish it.
  const hiddenContent = [];
  $('.elementor-hidden-desktop.elementor-hidden-tablet.elementor-hidden-mobile').each((_, el) => {
    hiddenContent.push({
      widget: ($(el).attr('data-widget_type') || '').split('.')[0] || 'section',
      text: clean($(el).text()).slice(0, 240),
      images: $(el).find('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], img').length,
    });
  });
  // Responsive duplicates: keep the desktop version only.
  $('.elementor-hidden-desktop').remove();

  const docs = new Map();
  const links = new Set();
  const ctx = {
    lang,
    slugById,
    slugBySlug,
    currentHeading: null,
    images: new Set(),
    stats: { tables: 0 },
    addDoc(title, href) {
      if (!docs.has(href)) docs.set(href, { title: clean(title), url: href, ...docMeta(title, href), group: ctx.currentHeading });
    },
    addLink(href) {
      links.add(href);
    },
  };
  const conv = createConverter($, ctx);

  // Sidebar: columns containing a nav-menu widget.
  const sidebar = [];
  $('.elementor-widget-nav-menu').each((_, nav) => {
    const col = $(nav).closest('.elementor-column, .e-con');
    const title = clean(col.find('.elementor-widget-heading').first().text()) || null;
    const items = $(nav)
      .find('nav')
      .first()
      .find('a')
      .map((_, a) => ({ label: clean($(a).text()), href: toRoute(absUrl($(a).attr('href'), lang), slugById, slugBySlug, lang) }))
      .get()
      .filter((x) => x.label && x.href);
    const seen = new Set();
    sidebar.push({ title, items: items.filter((x) => (seen.has(x.href) ? false : seen.add(x.href))) });
    col.length ? col.remove() : $(nav).remove();
  });

  const blocks = [];
  const forms = [];
  let group = null; // consecutive icon-boxes

  const flushGroup = () => {
    if (group && group.items.length) blocks.push(group);
    group = null;
  };

  const widgets = $('.elementor-widget').filter((_, el) => $(el).parents('.elementor-widget').length === 0);
  widgets.each((_, w) => {
    const $w = $(w);
    const type = ($w.attr('data-widget_type') || '').split('.')[0] || (($w.attr('class') || '').match(/elementor-widget-([\w-]+)/) || [])[1];
    if (type !== 'icon-box') flushGroup();
    switch (type) {
      case 'heading': {
        const text = clean($w.text());
        if (text) {
          ctx.currentHeading = text;
          blocks.push({ type: 'heading', level: 2, text });
        }
        break;
      }
      case 'text-editor':
      case 'theme-post-content':
        conv.html($w.find('.elementor-widget-container').length ? $w.find('.elementor-widget-container').first() : $w, blocks);
        break;
      case 'icon-box': {
        const title = clean($w.find('.elementor-icon-box-title').text());
        const description = conv.inline($w.find('.elementor-icon-box-description').first());
        const href = toRoute(absUrl($w.find('a[href]').first().attr('href'), lang), slugById, slugBySlug, lang);
        const kind = href && FILE_RE.test(href) ? 'documents' : href ? 'links' : 'features';
        if (!group || group.type !== kind) {
          flushGroup();
          group = { type: kind, title: ctx.currentHeading, items: [] };
        }
        if (kind === 'documents') {
          ctx.addDoc(title || ctx.currentHeading || 'Sənəd', href);
          group.items.push({ title: title || ctx.currentHeading || 'Sənəd', url: href, ...docMeta(title, href) });
        } else if (kind === 'links') {
          links.add(href);
          group.items.push({ title, description: description || null, href });
        } else if (title || description) {
          group.items.push({ title, description: description || null });
        }
        break;
      }
      case 'icon-list': {
        const items = $w
          .find('.elementor-icon-list-item')
          .map((_, li) => {
            const href = toRoute(absUrl($(li).find('a[href]').attr('href'), lang), slugById, slugBySlug, lang);
            if (href) links.add(href);
            return { title: clean($(li).text()), href: href || null };
          })
          .get()
          .filter((x) => x.title);
        if (items.some((i) => i.href)) blocks.push({ type: 'links', title: ctx.currentHeading, items: items.map((i) => ({ title: i.title, description: null, href: i.href })) });
        else if (items.length) blocks.push({ type: 'list', ordered: false, items: items.map((i) => escapeHtml(i.title)) });
        break;
      }
      case 'button': {
        const a = $w.find('a[href]').first();
        const href = toRoute(absUrl(a.attr('href'), lang), slugById, slugBySlug, lang);
        const text = clean($w.text());
        if (href && text) {
          if (FILE_RE.test(href)) {
            ctx.addDoc(text, href);
            blocks.push({ type: 'documents', title: ctx.currentHeading, items: [{ title: text, url: href, ...docMeta(text, href) }] });
          } else {
            links.add(href);
            blocks.push({ type: 'button', text, href });
          }
        }
        break;
      }
      case 'image': {
        $w.find('img').each((_, i) => {
          const im = conv.image(i);
          if (im) blocks.push({ type: 'image', ...im });
        });
        break;
      }
      case 'image-gallery':
      case 'gallery':
      case 'image-carousel': {
        const images = [];
        $w.find('a[href]').each((_, a) => {
          const href = absUrl($(a).attr('href'), lang);
          if (href && /\.(jpe?g|png|webp|gif)(\?|$)/i.test(href)) images.push({ src: href, alt: clean($(a).attr('data-elementor-lightbox-title') || $(a).find('img').attr('alt')), width: null, height: null });
        });
        if (!images.length) {
          $w.find('img').each((_, i) => {
            const im = conv.image(i);
            if (im) images.push(im);
          });
        }
        const unique = [...new Map(images.map((i) => [i.src, i])).values()];
        unique.forEach((i) => ctx.images.add(i.src));
        if (unique.length) blocks.push({ type: 'gallery', title: ctx.currentHeading, images: unique });
        break;
      }
      case 'accordion':
      case 'toggle':
      case 'tabs': {
        const items = [];
        $w.find('.elementor-accordion-item, .elementor-toggle-item, .elementor-tab-title.elementor-tab-desktop-title').each((_, it) => {
          const $it = $(it);
          const title = clean($it.find('.elementor-accordion-title, .elementor-toggle-title').text() || $it.text());
          const content = $it.is('.elementor-tab-title') ? $w.find(`#${$it.attr('aria-controls')}`) : $it.find('.elementor-tab-content');
          items.push({ title, blocks: conv.html(content, []) });
        });
        if (items.length) blocks.push({ type: 'accordion', items });
        break;
      }
      case 'html': {
        conv.html($w.find('.elementor-widget-container').first(), blocks);
        break;
      }
      case 'google_maps': {
        const src = absUrl($w.find('iframe').attr('src'), lang);
        if (src) blocks.push({ type: 'map', src, title: clean($w.find('iframe').attr('title')) || null });
        break;
      }
      case 'form': {
        const fields = [];
        $w.find('.elementor-field-group').each((_, g) => {
          const $g = $(g);
          const input = $g.find('input:not([type=hidden]), select, textarea').first();
          if (!input.length) return;
          fields.push({
            name: input.attr('name'),
            type: input.is('select') ? 'select' : input.is('textarea') ? 'textarea' : input.attr('type') || 'text',
            label: clean($g.find('label').first().text()) || clean(input.attr('placeholder')),
            required: input.attr('required') !== undefined || $g.hasClass('elementor-field-required'),
            options: input.is('select') ? input.find('option').map((_, o) => clean($(o).text())).get().filter(Boolean) : undefined,
            consentText: $g.hasClass('elementor-field-type-acceptance') ? clean($g.text()) : undefined,
          });
        });
        forms.push({ kind: 'elementor-form', fields });
        blocks.push({ type: 'form', index: forms.length - 1 });
        break;
      }
      case 'shortcode': {
        const mv = $w.find('.mv-cr');
        if (mv.length) {
          blocks.push({ type: 'rates', mode: mv.attr('data-mode') || 'history' });
          if ($w.find('form').length) forms.push({ kind: 'currency-history-filter', fields: [{ name: 'from', type: 'date' }, { name: 'to', type: 'date' }, { name: 'currency', type: 'select' }] });
        } else {
          conv.html($w, blocks);
        }
        break;
      }
      case 'slides': {
        const slides = $w
          .find('.swiper-slide:not(.swiper-slide-duplicate)')
          .map((_, s) => ({
            heading: clean($(s).find('.elementor-slide-heading').text()),
            description: clean($(s).find('.elementor-slide-description').text()),
            button: clean($(s).find('.elementor-slide-button').text()) || null,
            href: toRoute(absUrl($(s).find('a[href]').attr('href'), lang), slugById, slugBySlug, lang),
          }))
          .get();
        const unique = [...new Map(slides.map((s) => [s.heading + s.description, s])).values()];
        blocks.push({ type: 'slides', slides: unique });
        break;
      }
      case 'divider':
      case 'spacer':
      case 'nav-menu':
        break;
      default:
        conv.html($w, blocks);
    }
  });
  flushGroup();

  // Drop empty paragraphs and collapse duplicate consecutive headings.
  const tidy = blocks.filter((b, i) => {
    if (b.type === 'paragraph' && !clean(b.html.replace(/<[^>]+>/g, ''))) return false;
    if (b.type === 'heading' && blocks[i - 1]?.type === 'heading' && blocks[i - 1].text === b.text) return false;
    return true;
  });

  const title = clean(cheerio.load(page.title.rendered).text());

  // Leading headings: a section label ("Bank Haqqında") and the page title.
  // Both are rendered by the page hero, so they leave the block list.
  const norm = (s) => clean(s).toLocaleLowerCase('az').replace(/[^\p{L}\p{N}]+/gu, '');
  let sectionLabel = null;
  let heroTitle = null;
  const LABELS = new Set(['bankhaqqında', 'abouttheбank', 'aboutthebank', 'aboutus']);
  if (tidy[0]?.type === 'heading' && LABELS.has(norm(tidy[0].text))) sectionLabel = tidy.shift().text;
  for (let i = 0; i < 2 && tidy[0]?.type === 'heading'; i++) {
    const h = tidy[0].text;
    const looksLikeTitle = norm(h) === norm(title) || norm(h).startsWith(norm(title)) || norm(title).startsWith(norm(h));
    if (looksLikeTitle && !heroTitle) heroTitle = h;
    else if (!sectionLabel && tidy[1]?.type === 'heading') sectionLabel = h;
    else break;
    tidy.shift();
  }

  const text = tidy
    .map((b) => (b.text || b.html || (b.items || []).map((x) => (typeof x === 'string' ? x : x.title || '')).join(' ') || ''))
    .join(' ')
    .replace(/<[^>]+>/g, ' ');
  const documents = [...docs.values()];
  return {
    id: page.id,
    slug: azSlug,
    sourceSlug: page.slug,
    locale: lang,
    title,
    heroTitle: heroTitle && heroTitle !== title ? heroTitle : null,
    sectionLabel,
    sourceUrl: page.link,
    published: page.date,
    modified: page.modified,
    sidebar,
    hiddenContent,
    blocks: tidy,
    forms,
    documents,
    links: [...links].filter((l) => l !== null),
    stats: {
      words: clean(text).split(' ').filter(Boolean).length,
      tables: tidy.filter((b) => b.type === 'table').length + tidy.flatMap((b) => (b.type === 'accordion' ? b.items.flatMap((i) => i.blocks) : [])).filter((b) => b.type === 'table').length,
      documents: documents.length,
      images: ctx.images.size,
      forms: forms.length,
    },
  };
}

// ---------------------------------------------------------------- main
const all = {};
for (const lang of Object.keys(SOURCES)) all[lang] = await fetchPages(lang);

const azById = Object.fromEntries(all.az.map((p) => [p.id, p.slug]));
const slugBySlug = {
  az: Object.fromEntries(all.az.map((p) => [p.slug, p.slug])),
  en: Object.fromEntries(all.en.map((p) => [p.slug, azById[p.id] || null]).filter(([, v]) => v)),
};

fs.rmSync(path.join(OUT, 'pages'), { recursive: true, force: true });
const manifest = { generatedAt: new Date().toISOString(), crawledAt, sources: SOURCES, pages: [] };

for (const lang of Object.keys(SOURCES)) {
  const dir = path.join(OUT, 'pages', lang);
  fs.mkdirSync(dir, { recursive: true });
  for (const page of all[lang]) {
    const azSlug = lang === 'az' ? page.slug : azById[page.id];
    if (!azSlug) {
      manifest.pages.push({ locale: lang, id: page.id, title: clean(cheerio.load(page.title.rendered).text()), sourceUrl: page.link, status: 'no-az-counterpart' });
      continue;
    }
    const parsed = parsePage(page, lang, azById, slugBySlug, azSlug);
    const empty = parsed.blocks.length === 0 && parsed.sidebar.length === 0;
    fs.writeFileSync(path.join(dir, `${azSlug}.json`), JSON.stringify(parsed, null, 1));
    manifest.pages.push({
      locale: lang,
      id: page.id,
      slug: azSlug,
      title: parsed.title,
      sourceUrl: parsed.sourceUrl,
      modified: parsed.modified,
      status: empty ? 'empty-in-source' : parsed.blocks.length === 0 ? 'no-content-in-source' : 'migrated',
      stats: parsed.stats,
      hiddenInSource: parsed.hiddenContent.length ? parsed.hiddenContent : undefined,
      externalLinks: parsed.links.filter((l) => /^https?:/.test(l) && !/bmibaku\.az\/wp-content/.test(l)),
      documents: parsed.documents.length,
      sidebarGroups: parsed.sidebar.map((s) => s.title),
    });
  }
}

manifest.pages.sort((a, b) => (a.locale + (a.slug || '')).localeCompare(b.locale + (b.slug || '')));
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1));
const count = (l, s) => manifest.pages.filter((p) => p.locale === l && (!s || p.status === s)).length;
console.log(`az: ${count('az')} pages (${count('az', 'migrated')} migrated, ${count('az', 'empty-in-source')} empty)`);
console.log(`en: ${count('en')} pages (${count('en', 'migrated')} migrated, ${count('en', 'empty-in-source')} empty, ${count('en', 'no-az-counterpart')} without AZ page)`);
