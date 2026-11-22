# Dizayn sistemi

Tokenlər `tailwind.config.js`, baza üslublar `src/styles/globals.css`, düymələr `src/components/ui/Button.tsx` faylındadır.

## İstiqamət

> "Zəngin bank tarixi olan qurum, müasir fintech aydınlığı ilə."

Sayt bahalı görünüşü bəzəkdən yox, dəqiqlikdən alır. Hər elementin işi var.

İstifadə olunmur:

- stok foto və emoji
- dekorativ qradiyent ləkələr
- həddən artıq "glass" effekti
- eyni tipli kart şəbəkələrinin təkrarı

Şüşə və qradiyent yalnız MİLLİ KART vizualındadır. Header-də sürüşmədən sonra yüngül şəffaflıq var.

Rəng payı: **~70% neytral səth, ~25% navy, ~5% qızılı**. Qızılı yalnız dəqiq vurğudur: əsas CTA, `%` işarəsi, aktiv menyu göstəricisi. Bütöv bölmə fonu qızılı olmur.

## Brend

- **Emblem:** rəsmi Bank Melli İran emblemi (`public/brand/bmi-emblem.png`). Bu, bmibaku.az saytının öz favicon kəsimidir. Header-də və footer-də 44 px ölçüdə, mətn wordmark ilə yanaşı göstərilir; MİLLİ KART vizualında da var.
- **Tam loqo:** EN + FA yazılı tam loqo (`public/brand/bmi-logo-lockup.png`) dəyişdirilmədən saxlanılıb. JSON-LD-də və sosial önizləmə şəklində (`og-image.png`) istifadə olunur.
- **Qayda:** emblem rəngi dəyişdirilmir, kəsilmir və üzərinə element qoyulmur. Emblem dekorativ şəkil kimi verilir (`alt=""`), çünki bankın adı yanındakı mətndə yazılıb.

## Rənglər

| Token | HEX | İstifadə |
| --- | --- | --- |
| `navy-900` | `#0B1F3A` | Brend, başlıqlar, əsas düymə, Korporativ bölmə fonu |
| `navy-950` | `#071629` | Üst zolaq |
| `navy-800` | `#142E4C` | Hover, kart qradiyenti |
| `gold-400` | `#D4AF37` | Tünd fonda vurğu |
| `gold-500` | `#C59B27` | Əsas CTA fonu, `%` |
| `gold-700` | `#7A5C0E` | Açıq fonda qızılı **mətn və ikon** |
| `gold-50` | `#FBF5E5` | Yumşaq qızılı səth |
| `surface` | `#F8FAFC` | Səhifə fonu |
| `white` | `#FFFFFF` | Kartlar, ağ bölmələr |
| `ink` | `#0F172A` | Mətn, footer |
| `slate-500/600` | `#64748B` / `#475569` | İkinci dərəcəli mətn |
| `slate-400` | `#94A3B8` | Yalnız dekorativ ikon və ayırıcı (mətn üçün yox) |
| `line` | `#E2E8F0` | Haşiyələr |
| `success` / `warning` / `danger` | `#15803D` / `#B45309` / `#DC2626` | Vəziyyətlər, həmişə ikon + mətnlə |

**Kontrast (WCAG AA):**

- `gold-500` ağ fonda 2.6:1 verir. Mətn üçün istifadə olunmaz, açıq fonda qızılı mətn həmişə `gold-700` (6.2:1) olur.
- Gold düymədə mətn `navy-950` rəngindədir (≈6.9:1).
- `slate-400` ağ fonda 2.6:1 verir, ona görə mətn üçün istifadə olunmur.

**Qrafik palitrası** (tarixçə): alış `#2B5C9E`, satış `#A87A12`. Palitra dataviz yoxlamasından keçib (lightness, chroma, rəng korluğu ΔE ≥ 22, 3:1 kontrast). Brend navy və qızılı bu yoxlamadan keçmədiyi üçün qrafikdə istifadə olunmur.

## Tipoqrafiya

Şriftlər: Plus Jakarta Sans (latın, latin-ext — ə Ə ü Ü ö Ö ğ Ğ ı İ ç Ç ş Ş yoxlanılıb), FA üçün Vazirmatn.

| Səviyyə | Ölçü | Çəki |
| --- | --- | --- |
| Display (H1) | 40 → 48 → 56 → 64 px | 800 |
| Bölmə başlığı (H2) | 32 → 36 → 40 px | 700 |
| Alt başlıq | 18–24 px | 700 |
| Əsas mətn | 15–17 px | 400–500 |
| Köməkçi mətn | 13–14 px | 400–500 |
| Meta / eyebrow | 12 px, böyük hərf, `tracking 0.14em` | 600 |

Bütün maliyyə rəqəmləri `tabular-nums` ilə yazılır. Başlıqlarda `text-wrap: balance`, abzaslarda `text-wrap: pretty` var.

## Ölçü sistemi

- **Konteyner:** maksimum 1240 px (`max-w-page`). Yan boşluq: 16 → 24 → 32 px.
- **Şəbəkə:** iş masasında 12 sütun (`lg:grid-cols-12`). Hero 7/5, məzənnə 7/5, kalkulyator 7/5.
- **Boşluq:** 8 px addımı (Tailwind 2/4/6/8…).
- **Bölmə hündürlüyü** (`.section-y`): 48 → 64 → 80 → 96 px.
- **Radius:** 8 px (düymə, sahə), 12 px (kiçik kart), 16 px (panel, dialoq, bank kartı). 24 px və daha böyük radius istifadə olunmur.

## Komponentlər

| Komponent | Qayda |
| --- | --- |
| Düymə `gold` | Bölmədə ən çox bir dənə: əsas konversiya hərəkəti |
| Düymə `primary` (navy) | İnternet Bankçılıq, formanı göndərmək |
| Düymə `secondary` | İkinci dərəcəli hərəkət |
| Düymə `onDark` | Tünd panellərdə ikinci hərəkət |
| Sahə | 48 px, etiket üstdə, xəta ikonla, `*` ilə vacib sahə |
| Slayder | 44 px toxunma sahəsi, rəqəm sahəsi ilə sinxron |
| Segmented | Doğma radio qrupu — oxlar özü işləyir |
| Dialoq | 640 px-dən böyük ekranda mərkəzdə, kiçik ekranda alt vərəq; Drawer kənardan açılır |

## Hərəkət

- **Keçidlər:** 200 ms `ease-out`. Yalnız rəng, kölgə, `transform` və `opacity` animasiya olunur; `transition: all` istifadə olunmur.
- **Düymə:** fon dəyişir və yüngül kölgə çıxır. Kart haşiyə rəngini dəyişir və 2 px qalxır.
- **Dialoq:** fade + scale (0.98 → 1). Drawer yandan 24 px sürüşür. Açılan siyahı `opacity` və `translate` ilə açılır.
- **Bank kartı:** 3D əyilmə hover-də yumşalır (yalnız siçan olan cihazlarda).
- **`prefers-reduced-motion`:** bütün animasiyalar və hamar sürüşmə söndürülür.

## Əlçatanlıq (WCAG 2.2 AA)

- "Əsas məzmuna keç" linki var. Bir `h1`, bölmələrdə `h2`, bloklarda `h3` istifadə olunur.
- Hər interaktiv elementdə görünən `focus-visible` halqası var (qızılı; tünd fonda offset navy).
- Toxunma hədəfləri ən azı 24×24 px (2.5.8), əsas idarəetmələr 44 px-dir.
- Dialoqlar doğma `<dialog>` əsasındadır: fokus tələsi, Esc ilə bağlanma və fokusun geri qayıtması brauzerdən gəlir.
- Dəyişən nəticələr `aria-live="polite"` ilə elan olunur: aylıq ödəniş, çevirici, xəta xülasəsi, kopyalama.
- Xəta mesajı rəng + ikon + mətnlə verilir; sahələrdə `aria-invalid` və `aria-describedby` var.
- Görünən etiket əlçatan adın içindədir (Lighthouse `label-content-name-mismatch` yoxlamasından keçir).
- Xarici linklər ekran oxuyucuya "(yeni pəncərədə açılır)" kimi oxunur.

Ölçülüb (22.11.2026, production build): Lighthouse Accessibility **100** (mobil və iş masası).
