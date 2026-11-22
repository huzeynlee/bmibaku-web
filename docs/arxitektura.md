# Arxitektura

## Texnologiyalar

| Texnologiya | Versiya | Niyə |
| --- | --- | --- |
| Next.js (App Router) | 15.5 | Çoxsəhifəli sayt, statik səhifələr + ISR, server tərəfində API-lər |
| React | 19 | Server və klient komponentləri |
| TypeScript | 5, `strict`, `noUncheckedIndexedAccess` | Tip təhlükəsizliyi; lüğətlərdə açar çatışmazlığı build-i dayandırır |
| Tailwind CSS | 3.4 | Dizayn tokenləri `tailwind.config.js`-də |
| Motion (`motion/react`) | 14 | Səhifə keçidləri, görünəndə açılma, 3D kart, say animasiyası |
| Lucide | 1.x | İkonlar |
| Recharts | 3 | Yalnız məzənnə tarixçəsi qrafiki; tək valyuta seçiləndə tənbəl yüklənir |

GSAP istifadə olunmur: bütün animasiyalar Motion ilə edilir.

## Qovluqlar

```text
content/                  köhnə saytdan çəkilmiş məzmun (npm run content:sync)
├── manifest.json         bütün mənbə səhifələri, statusları, statistikası
└── pages/{az,en}/*.json  hər səhifənin bloklara çevrilmiş məzmunu
scripts/
├── content-sync.mjs      WordPress REST API → content/
├── qa-routes.mjs         avtomatik test (puppeteer-core)
└── migration-report.mjs  docs/MIGRATION-REPORT.md
src/
├── middleware.ts         dil marşrutları (/az gizli, /en, /fa)
├── app/
│   ├── [locale]/layout.tsx    <html lang dir>, şriftlər, header/footer, JSON-LD
│   ├── [locale]/template.tsx  səhifə keçidi
│   ├── [locale]/page.tsx      ana səhifə
│   ├── [locale]/[slug]/page.tsx  bütün daxili səhifələr (şablon seçimi)
│   ├── api/                   rates/history, credit-application, contact
│   ├── sitemap.ts, robots.ts
├── content/              routes.ts (marşrut cədvəli), load.ts, nav.ts, types.ts, icons.ts
├── components/
│   ├── layout/           Header (mega menyu), MobileMenu, UtilityBar, Footer, Breadcrumbs, PageHero, SectionNav…
│   ├── templates/        ContentTemplate, SpecialTemplates (overview, hub, gallery, contact, calculator…), shared
│   ├── blocks/           Blocks (məzmun blokları), DataTable, DocumentArchive, Accordion, Gallery
│   ├── banking/          BankCard, ProductShowcase, LoanCalculator, RatesPanel, ExchangeTable,
│   │                     CurrencyConverter, RateHistory, RateHistoryChart, CreditApplicationForm, ContactForm
│   ├── home/             HomeHero, HomeSections
│   ├── motion/           MotionProvider, Reveal, MaskText, CountUp, AnimatedNumber, Motif
│   └── ui/               Button, buttonClass, Input, Select, Slider, Segmented, Modal, Drawer, CopyValue, Logo…
├── data/                 banking.ts, loanProducts.ts, currencies.ts, discrepancies.ts
├── i18n/                 config.ts, az.ts (mənbə tip), en.ts, fa.ts, dictionaries.ts, client.tsx
├── lib/                  rates.ts, forms.ts (server-only), site.ts
├── utils/                decimal.ts, currency.ts, calculations.ts, validation.ts, cx.ts
└── styles/globals.css
```

## Marşrutlar

- `src/content/routes.ts` saytın bütün 54 daxili marşrutunu saxlayır: `slug`, `section`, `template`, `parent`, `group`, `icon`. Menyular, breadcrumb, yan naviqasiya, sitemap və test skripti bu cədvəldən oxuyur.
- Slug-lar köhnə saytdakı ilə eynidir, ona görə AZ ünvanları dəyişmir.
- `[slug]/page.tsx`: `generateStaticParams` 54 × 3 dil = 162 səhifə yaradır, `dynamicParams = false` (cədvəldə olmayan ünvan 404 olur), `revalidate = 600`.
- Mənbədə olub dərc edilməyən səhifələr (`test`, `portmanat`, boş 2018 hesabatı, `index`) `EXCLUDED_SOURCE_PAGES` siyahısındadır.

## Şablonlar

| Şablon | Səhifələr | Nə edir |
| --- | --- | --- |
| `overview` | Fərdi, Korporativ | Bölmə girişi, xidmət kartları |
| `hub` | Haqqımızda | Qruplaşdırılmış institusional indeks, rekvizitlər (kopyalama), tarix xətti |
| `content` | Əksər səhifələr | Hero, yan naviqasiya (telefonda açılan siyahı), məzmun blokları, alt səhifələr, əlaqəli xidmətlər |
| `gallery` | Foto qalereya | Mozaika + lightbox (←/→/Esc, RTL-də çevrilir) |
| `contact` | Əlaqə | Ümumi müraciət / şikayət forması, xəritə, SWIFT, istehlakçı hüquqları |
| `calculator` | Kredit kalkulyatoru | 8 məhsul, rəsmi şərtlər, köhnə kalkulyatora link |
| `application` | Onlayn kredit sifarişi | Addımlı forma, razılıq qutuları |
| `rates` | Məzənnə tarixçəsi | Cari məzənnə, çevirici, filtr, səhifələmə, qrafik |
| `property` | Əmlak satışı və alt səhifələr | Elanlar qalereyaya görə bölünür; elan yoxdursa boş vəziyyət — uydurma elan yoxdur |

Hər bölmənin hero-su fərqlidir (`PageHero` — `ART` xəritəsi: motiv, fon, parıltı).

## Server və klient

- Səhifələr və şablonlar server komponentləridir. Məzmun JSON faylları yalnız serverdə oxunur (`content/load.ts` → `server-only`).
- Klient komponentləri yalnız interaktiv hissələrdir: Header, kalkulyator, çevirici, formalar, qalereya, sənəd arxivi, animasiyalar.
- Server komponentindən klientə funksiya ötürülmür (Next.js qadağası). Məsələn `CountUp` formatlayıcı funksiya yox, `locale` alır.
- `buttonClass` ayrıca faylda (`ui/buttonClass.ts`), çünki həm server, həm klient komponentləri istifadə edir.
- `stripLocale` `/az` prefiksini də silir: AZ səhifələri middleware rewrite ilə açılır və `usePathname()` serverdə `/az/...`, brauzerdə isə `/...` qaytara bilər. Bu fərq hydration xətası yaradırdı.

## Hesablamalar

**Kredit** (`utils/calculations.ts`):

```text
r = illik faiz / 100 / 12,  n = ay
M = P · r · (1 + r)^n / ((1 + r)^n − 1)      r = 0 olduqda: M = P / n
```

Aylıq ödəniş 2 onluğa yuvarlaqlaşdırılır. Ümumi ödəniş aylıq ödəniş × n-dir, faiz isə ümumi ödəniş − P. Nümunə: 10,000 AZN, 12%, 24 ay → 470.73 AZN aylıq ödəniş, 11,297.52 AZN ümumi ödəniş.

Məbləğ həddi məhsulun rəsmi həddindən gəlir (`data/loanProducts.ts`); USD ilə verilən hədd cari USD satış məzənnəsi ilə AZN-ə çevrilir.

**Valyuta** (`hooks/useCurrencyConverter.ts`, `utils/decimal.ts`):

- BigInt üzərində 8 onluqlu sabit nöqtəli hesab aparılır, float istifadə olunmur.
- AZN → valyuta: `AZN × vahid / satış`. Valyuta → AZN: `məbləğ × alış / vahid`.
- Nəticə 2 onluğa yuvarlaqlaşdırılır (half-up).
- Boş, mənfi, sıfır, 1 milyarddan böyük məbləğ və olmayan məzənnə ayrıca vəziyyətdir. Sıfıra bölmə baş vermir.

## Yeni səhifə əlavə etmək

1. Səhifəni köhnə saytda (WordPress) yaradın və `npm run content:sync` işlədin, ya da `content/pages/az/<slug>.json` faylını əl ilə yazın.
2. `src/content/routes.ts` cədvəlinə sətir əlavə edin: `slug`, `section`, `template`, `parent`, ikon.
3. `npm run build`, sonra `npm start` və `npm run qa -- http://localhost:3000`.
4. `npm run report` ilə köçürmə hesabatını yeniləyin.
