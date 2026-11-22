// Shapes produced by scripts/content-sync.mjs (content/pages/<locale>/<slug>.json).

export interface TableCell {
  html: string;
  colspan?: number;
  rowspan?: number;
  header?: boolean;
}

export interface DocItem {
  title: string;
  url: string;
  ext: string;
  year: number | null;
  dates: string[];
}

export interface LinkItem {
  title: string;
  description: string | null;
  href: string | null;
}

export interface ImageItem {
  src: string;
  alt: string;
  width: number | null;
  height: number | null;
}

export type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; html: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'table'; rows: TableCell[][] }
  | ({ type: 'image' } & ImageItem)
  | { type: 'gallery'; title: string | null; images: ImageItem[] }
  | { type: 'documents'; title: string | null; items: DocItem[] }
  | { type: 'links'; title: string | null; items: LinkItem[] }
  | { type: 'features'; title: string | null; items: { title: string; description: string | null }[] }
  | { type: 'accordion'; items: { title: string; blocks: Block[] }[] }
  | { type: 'button'; text: string; href: string }
  | { type: 'embed'; src: string; title: string | null }
  | { type: 'map'; src: string; title: string | null }
  | { type: 'form'; index: number }
  | { type: 'rates'; mode: string }
  | { type: 'slides'; slides: { heading: string; description: string; button: string | null; href: string | null }[] };

export interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  consentText?: string;
}

export interface PageContent {
  id: number;
  slug: string;
  locale: 'az' | 'en';
  title: string;
  heroTitle: string | null;
  sectionLabel: string | null;
  sourceUrl: string;
  published: string;
  modified: string;
  sidebar: { title: string | null; items: { label: string; href: string }[] }[];
  hiddenContent: { widget: string; text: string; images: number }[];
  blocks: Block[];
  forms: { kind: string; fields: FormField[] }[];
  documents: (DocItem & { group: string | null })[];
  links: string[];
  stats: { words: number; tables: number; documents: number; images: number; forms: number };
}

/** A page as served in a given locale, with fallback information. */
export interface ResolvedPage {
  content: PageContent;
  /** Locale the content is actually written in. */
  contentLocale: 'az' | 'en';
  /** True when the requested locale had no official content and AZ was used. */
  fallback: boolean;
}
