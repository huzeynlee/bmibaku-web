# Arxitektura

## Texnologiyalar

| Texnologiya | Versiya | Qeyd |
| --- | --- | --- |
| React | 18.3 | Komponent əsaslı interfeys |
| TypeScript | 5.6 | `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals` |
| Vite | 5.4 | İnkişaf serveri və build |
| Tailwind CSS | 3.4 | Tokenlər `tailwind.config.js`-də |
| lucide-react | 0.460 | İkonlar |
| Recharts | 3.x | Yalnız tarixçə qrafiki üçün. Ayrıca chunk-dadır və yalnız tarixçə məlumatı olanda yüklənir |

Router, vəziyyət kitabxanası və UI kitabxanası istifadə olunmur.

## Qovluqlar

```text
src/
├── app/           App.tsx — bölmələrin sırası və ortaq vəziyyət; main.tsx — giriş nöqtəsi
├── components/
│   ├── layout/    UtilityBar, Navbar, MobileMenu, Footer, MobileActionBar, serviceLinks
│   ├── sections/  Hero, TrustMetrics, CurrencyExchange, LoanCalculator, IndividualBanking,
│   │              CorporateBanking, QuickServices, InstitutionalInfo
│   ├── banking/   BankCard, ProductShowcase, ExchangeTable, CurrencyConverter,
│   │              RateHistoryDrawer, RateHistoryChart, LoanSummary, LoanApplicationModal
│   └── ui/        Button (+ButtonLink, ExternalLink), Modal, Drawer, Input (+Field), Select,
│                  Slider (SliderField), Segmented, SectionHeader, Logo
├── data/          Bütün məzmun məlumatı və mənbələri (bax: Məlumat və inteqrasiya)
├── hooks/         useLoanCalculator, useCurrencyConverter, useRates, useActiveSection (+useScrolled)
├── i18n/          az.ts (mənbə lüğət və tip), en.ts, fa.ts, index.tsx (kontekst)
├── services/      config.ts (mühit dəyişənləri), currencyService.ts, applicationService.ts
├── utils/         decimal.ts, currency.ts (format), calculations.ts, validation.ts, cx.ts
├── styles/        globals.css
└── types/         banking.ts
```

Qayda: komponentlərdə nə mətn, nə də məlumat birbaşa yazılır. Mətn `i18n/`, rəqəm və linklər `data/` qovluğundan gəlir.

## Vəziyyət axını

Bölmələr arasında paylaşılan vəziyyət yalnız `App.tsx`-dədir:

```text
App
├── loan        { productId, amount, termMonths }   kalkulyator seçimləri
└── application { open, prefill }                   müraciət pəncərəsi
```

| Hərəkət | Nəticə |
| --- | --- |
| Hero-da "Ödənişi hesabla" | `loan.productId` dəyişir, səhifə `#calculator` bölməsinə sürüşür |
| "Müraciət et" / "Onlayn Müraciət Et" | Pəncərə açılır. Forma məhsul, məbləğ və müddətlə doldurulur |

Dil `I18nProvider` kontekstindədir. Məzənnələr `useRates()` ilə yüklənir.

## Hesablamalar

**Kredit** (`utils/calculations.ts`):

```text
r = illik faiz / 100 / 12,  n = ay
M = P · r · (1 + r)^n / ((1 + r)^n − 1)      r = 0 olduqda: M = P / n
```

Aylıq ödəniş 2 onluğa yuvarlaqlaşdırılır. Ümumi ödəniş aylıq ödəniş × n-dir, faiz isə ümumi ödəniş − P. Nümunə: 10,000 AZN, 8%, 24 ay → 452.27 AZN aylıq ödəniş, 10,854.48 AZN ümumi ödəniş.

**Valyuta** (`hooks/useCurrencyConverter.ts`, `utils/decimal.ts`):

- BigInt üzərində 8 onluqlu sabit nöqtəli hesab aparılır, float istifadə olunmur.
- AZN → valyuta hesablanır: `AZN × vahid / satış`. Valyuta → AZN hesablanır: `məbləğ × alış / vahid`.
- Nəticə 2 onluğa yuvarlaqlaşdırılır (half-up).
- Boş, mənfi və sıfır məbləğ, həmçinin 1 milyarddan böyük məbləğ və olmayan məzənnə ayrıca vəziyyət kimi qaytarılır. Sıfıra bölmə baş vermir.

## Komponentlər

| Komponent | Parametrlər | Qeyd |
| --- | --- | --- |
| `Hero` | `onApply(id?)`, `onCalculate(id)` | `BankCard` + `ProductShowcase` |
| `ProductShowcase` | `onApply`, `onCalculate`, `className?` | WAI-ARIA tablar: ← →, Home, End (RTL-də oxlar əksinə) |
| `BankCard` | `label`, `flat?`, `className?` | CSS/SVG kart, ISO ID-1 nisbəti, `cqw` ilə ölçülənir. Real nömrə yoxdur |
| `CurrencyExchange` | — | `useRates`, cədvəl, çevirici, tarixçə |
| `ExchangeTable` | `items`, `caption` | ≥768px cədvəl, kiçik ekranda valyuta kartları |
| `CurrencyConverter` | `items`, `asOf` | Yalnız məzənnəsi olan valyutalar |
| `RateHistoryDrawer` | `open`, `onClose` | Vəziyyətlər: loading / unavailable / empty / error / ok |
| `RateHistoryChart` | `points`, `mode`, `lang`, `labels` | `React.lazy` ilə yüklənir |
| `LoanCalculator` | `loan`, `setLoan`, `onApply` | `SliderField` × 2, məhsul radioları |
| `LoanSummary` | `summary`, `termsUrl`, `onApply` | Tünd panel |
| `LoanApplicationModal` | `open`, `prefill`, `onClose` | Vəziyyətlər: idle → submitting → success / demo / error |
| `Navbar` | — | Açılan siyahılar (Esc, kənara klik, fokus itəndə bağlanır), aktiv bölmə |
| `Modal` / `Drawer` | `open`, `onClose`, `labelledBy`, `closeLabel` | Doğma `<dialog>`. Telefonda alt vərəq kimi açılır |

## Yeni bölmə əlavə etmək

1. `components/sections/` qovluğunda komponent yaradın. Kök element `<section id aria-labelledby className="section-y">` olsun, başlıq üçün `SectionHeader` istifadə edin.
2. Mətni `i18n/az.ts`-ə əlavə edin. TypeScript `en.ts` və `fa.ts`-də çatışmayan açarı xəta kimi göstərəcək.
3. Məlumatı `data/` qovluğuna mənbəyi ilə birlikdə qoyun.
4. Bölməni `App.tsx`-də `<main>` içinə əlavə edin. Menyuda görünməlidirsə, `data/navigation.ts`-ə də əlavə edin.
