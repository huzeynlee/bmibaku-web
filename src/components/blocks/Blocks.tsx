import Link from 'next/link';
import {
  ArrowUpRight,
  CircleDot,
  ExternalLink as ExternalIcon,
  HandCoins,
  HeartHandshake,
  Phone,
  ShieldCheck,
  Smartphone,
  Tv,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { Block, LinkItem } from '@/content/types';
import type { Dictionary } from '@/i18n/az';
import { cx } from '@/utils/cx';
import { Reveal } from '../motion/Reveal';
import { buttonClass } from '../ui/buttonClass';
import { NewTabHint } from '../ui/NewTabHint';
import { Accordion } from './Accordion';
import { DataTable } from './DataTable';
import { DocumentArchive } from './DocumentArchive';
import { Gallery } from './Gallery';

const isExternal = (href: string) => /^https?:\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');

/** Icon for an external service tile, chosen from its (source) title. */
function serviceIcon(title: string): LucideIcon {
  const t = title.toLocaleLowerCase('az');
  if (/mobil|mobile/.test(t)) return Smartphone;
  if (/komunal|utilit/.test(t)) return Zap;
  if (/telefon|phone/.test(t)) return Phone;
  if (/internet/.test(t)) return Wifi;
  if (/tv|kabel|cable/.test(t)) return Tv;
  if (/sığorta|insur/.test(t)) return ShieldCheck;
  if (/kredit|credit|loan/.test(t)) return HandCoins;
  if (/xeyriyy|charit/.test(t)) return HeartHandshake;
  return ArrowUpRight;
}

function Prose({ html, className }: { html: string; className?: string }) {
  return <div className={cx('prose-bank', className)} dangerouslySetInnerHTML={{ __html: html }} />;
}

function LinkTiles({ title, items, t }: { title: string | null; items: LinkItem[]; t: Dictionary }) {
  const valid = items.filter((i) => i.href);
  if (!valid.length) return null;
  return (
    <div>
      {title && <h3 className="mb-4 text-lg font-bold text-navy-900">{title}</h3>}
      <ul className="grid gap-3 sm:grid-cols-2">
        {valid.map((item, i) => {
          const external = isExternal(item.href!);
          const Icon = external ? serviceIcon(item.title) : ArrowUpRight;
          const body = (
            <>
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-navy-900 text-gold-400 transition-transform duration-300 ease-out group-hover:-rotate-3 group-hover:scale-105">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-navy-900">{item.title}</span>
                {item.description && <span className="mt-0.5 block text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: item.description }} />}
              </span>
              {external ? (
                <ExternalIcon className="size-4 shrink-0 text-slate-400 transition-colors group-hover:text-navy-900" aria-hidden="true" />
              ) : (
                <ArrowUpRight className="size-4 shrink-0 text-slate-400 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy-900 rtl:-scale-x-100" aria-hidden="true" />
              )}
            </>
          );
          const cls =
            'focus-ring group flex h-full items-center gap-4 rounded-xl border border-line bg-white p-4 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-navy-900/25 hover:shadow-[0_14px_30px_-20px_rgb(11_31_58/0.45)]';
          return (
            <Reveal as="li" key={`${item.href}-${i}`} delay={Math.min(i, 6) * 0.05}>
              {external ? (
                <a href={item.href!} target="_blank" rel="noopener noreferrer" className={cls}>
                  {body}
                  <NewTabHint text={t.common.newTab} />
                </a>
              ) : (
                <Link href={item.href!} className={cls}>
                  {body}
                </Link>
              )}
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}

interface BlocksProps {
  blocks: Block[];
  t: Dictionary;
  /** Skip block types a template renders itself. */
  skip?: Block['type'][];
}

/** A heading widget holding a whole paragraph (over 20 words) is rendered as a paragraph. */
const isRealHeading = (b: Block): boolean => b.type === 'heading' && b.text.split(/\s+/).length <= 20;

/** Renders migrated content in the site's design system. */
export function Blocks({ blocks, t, skip = [] }: BlocksProps) {
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => {
        if (skip.includes(b.type)) return null;
        switch (b.type) {
          case 'heading':
            // Some source pages use a heading widget for a whole paragraph: same text, paragraph semantics.
            if (!isRealHeading(b)) return <p key={i} className="prose-bank">{b.text}</p>;
            // Source pages sometimes start with an h3: the first heading is always an h2 (it follows the page h1).
            if (b.level > 2 && !blocks.slice(0, i).some(isRealHeading)) {
              return (
                <h2 key={i} className="pt-2 text-lg font-bold text-navy-900">
                  {b.text}
                </h2>
              );
            }
            return b.level <= 2 ? (
              <Reveal key={i}>
                <h2 className="pt-6 text-2xl font-bold tracking-tight text-navy-900 first:pt-0 md:text-[1.75rem]">{b.text}</h2>
              </Reveal>
            ) : (
              <h3 key={i} className="pt-2 text-lg font-bold text-navy-900">
                {b.text}
              </h3>
            );
          case 'paragraph':
            return <Prose key={i} html={`<p>${b.html}</p>`} />;
          case 'list':
            return <Prose key={i} html={`<${b.ordered ? 'ol' : 'ul'}>${b.items.map((it) => `<li>${it}</li>`).join('')}</${b.ordered ? 'ol' : 'ul'}>`} />;
          case 'table':
            return (
              <Reveal key={i} variant="fade">
                <DataTable rows={b.rows} label={t.common.table} />
              </Reveal>
            );
          case 'image':
            return (
              <Reveal key={i} variant="mask" className="overflow-hidden rounded-xl border border-line bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.src} alt={b.alt} width={b.width ?? undefined} height={b.height ?? undefined} loading="lazy" decoding="async" className="h-auto w-full" />
              </Reveal>
            );
          case 'gallery':
            return <Gallery key={i} images={b.images} title={b.title} />;
          case 'documents':
            return <DocumentArchive key={i} title={b.title} items={b.items} />;
          case 'links':
            return <LinkTiles key={i} title={b.title} items={b.items} t={t} />;
          case 'features':
            return (
              <ul key={i} className="grid gap-3 sm:grid-cols-2">
                {b.items.map((f, j) => (
                  <Reveal as="li" key={j} delay={j * 0.05} className="rounded-xl border border-line bg-white p-5">
                    <CircleDot className="size-5 text-gold-700" aria-hidden="true" />
                    {f.title && <p className="mt-3 font-semibold text-navy-900">{f.title}</p>}
                    {f.description && <Prose className="mt-1 text-sm" html={f.description} />}
                  </Reveal>
                ))}
              </ul>
            );
          case 'accordion':
            return (
              <Accordion
                key={i}
                items={b.items.map((it) => ({ title: it.title, content: <Blocks blocks={it.blocks} t={t} /> }))}
              />
            );
          case 'button':
            return isExternal(b.href) ? (
              <a key={i} href={b.href} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary', 'md')}>
                {b.text}
                <ExternalIcon className="size-4" aria-hidden="true" />
                <NewTabHint text={t.common.newTab} />
              </a>
            ) : (
              <Link key={i} href={b.href} className={buttonClass('secondary', 'md')}>
                {b.text}
                <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </Link>
            );
          case 'embed':
            return (
              <a key={i} href={b.src} target="_blank" rel="noopener noreferrer" className="focus-ring group flex items-center justify-between gap-4 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600 hover:border-navy-900/30">
                <span>
                  <span className="block font-semibold text-navy-900">{b.title || new URL(b.src).hostname}</span>
                  <span className="break-all text-[13px]">{b.src}</span>
                </span>
                <ExternalIcon className="size-4 shrink-0" aria-hidden="true" />
                <NewTabHint text={t.common.newTab} />
              </a>
            );
          case 'map':
            return (
              <Reveal key={i} variant="mask" className="overflow-hidden rounded-xl border border-line">
                <iframe src={b.src} title={b.title || t.contact.map} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="aspect-[16/9] w-full border-0 md:aspect-[21/9]" />
              </Reveal>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
