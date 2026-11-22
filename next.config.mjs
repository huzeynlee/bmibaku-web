import fs from 'node:fs';

/**
 * Redirects
 * - Empty source pages point to their nearest real page.
 * - Old English site (en.bmibaku.az/<slug>/) → /en/<az-slug>/ on this site.
 */
const manifest = JSON.parse(fs.readFileSync(new URL('./content/manifest.json', import.meta.url), 'utf8'));

const enHostRedirects = manifest.pages
  .filter((p) => p.locale === 'en' && p.slug && p.status !== 'empty-in-source')
  .map((p) => {
    const source = new URL(p.sourceUrl).pathname;
    return {
      source: source === '/' ? '/' : source,
      has: [{ type: 'host', value: 'en.bmibaku.az' }],
      destination: `https://bmibaku.az/en/${p.slug === 'index' ? '' : `${p.slug}/`}`,
      permanent: true,
    };
  });

/** EN-only source pages without an AZ counterpart: closest equivalent route. */
const EN_ONLY_REDIRECTS = {
  '/photo-gallery/': '/en/foto-qalereya/', // same 9 photos as the AZ gallery
  '/exchange-rate-api/': '/en/valyuta-tarixcesi/', // empty page
  '/valyuta-mezenne-api/': '/en/valyuta-tarixcesi/', // header-less rates widget (iframe use)
};
enHostRedirects.push(
  ...Object.entries(EN_ONLY_REDIRECTS).map(([source, destination]) => ({
    source,
    has: [{ type: 'host', value: 'en.bmibaku.az' }],
    destination: `https://bmibaku.az${destination}`,
    permanent: true,
  })),
);

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // A separate build folder (e.g. NEXT_DIST_DIR=.next-qa) lets a QA build run beside `next dev`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // No floating Next.js "N" badge in `npm run dev` (production never shows it).
  devIndicators: false,
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'bmibaku.az', pathname: '/wp-content/uploads/**' },
      { protocol: 'https', hostname: 'en.bmibaku.az', pathname: '/wp-content/uploads/**' },
    ],
  },
  async redirects() {
    return [
      { source: '/maliyye-veziyyeti-haqqinda-hesabat-13-04-2018/', destination: '/maliyye-hesabatlari/', permanent: true },
      { source: '/index/', destination: '/', permanent: true },
      ...enHostRedirects,
    ];
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
