# Məlumat və inteqrasiya

## Mənbə prinsipi

Bank saytında dəqiqlik boş yeri doldurmaqdan vacibdir. Ona görə:

- Məzmun köhnə saytdan avtomatik çəkilir, əl ilə yenidən yazılmır.
- Mənbəyi olmayan rəqəm (məzənnə, faiz, tarixçə, əmlak elanı) uydurulmur. İnterfeys belə hallarda "təqdim edilmir", "elan yoxdur" və ya "qoşulmayıb" vəziyyətini göstərir.
- Statik məlumat heç vaxt "canlı" kimi təqdim olunmur.
- Mənbədəki ziddiyyətlər səssizcə düzəldilmir: `src/data/discrepancies.ts` siyahısına yazılır və köçürmə hesabatında göstərilir.

Hər maliyyə faktı mənbəyi ilə saxlanılır (`types/banking.ts` → `Provenance`): mənbə ünvanı, yoxlama tarixi və vəziyyət.

| Vəziyyət | Mənası |
| --- | --- |
| `official-site` | bmibaku.az saytından `checkedOn` tarixində götürülüb |
| `needs-verification` | Rəsmi saytda var, amma ziddiyyətli və ya qrup səviyyəlidir; buraxılışdan əvvəl bankla təsdiqlənməlidir |
| `unavailable` | Mənbə cavab vermədi; ehtiyat (tarixli) məlumat göstərilir |

## Məzmunun köçürülməsi (`npm run content:sync`)

`scripts/content-sync.mjs`:

1. WordPress REST API-dən bütün səhifələri çəkir: `https://bmibaku.az/wp-json/wp/v2/pages` və `https://en.bmibaku.az/...`. `--cache=<qovluq>` ilə əvvəl çəkilmiş JSON yenidən istifadə olunur.
2. Elementor HTML-ini tipli bloklara çevirir: başlıq, paraqraf, siyahı, cədvəl, şəkil, qalereya, sənədlər, linklər, akkordeon, xəritə, forma, məzənnə.
3. Elementor dublikatlarını (yalnız telefonda görünən nüsxələr) atır. Bütün cihazlarda gizlədilmiş bloklar dərc olunmur, `hiddenContent` kimi qeydə alınır.
4. Sənədlər üçün metadata çıxarır: fayl tipi, hesabat ili, tarixlər. Hesabat ili başlıqdakı ilk tarixdən götürülür (`31/12/2012` → 2012). Yükləmə qovluğu (`/uploads/2020/04/`) yalnız son variantdır, çünki köhnə hesabatların çoxu 2020-də birlikdə yüklənib.
5. Yazır: `content/pages/{az,en}/<az-slug>.json` və `content/manifest.json` (səhifə statusu, statistika, xarici linklər, `crawledAt`).

| Status | Mənası |
| --- | --- |
| `migrated` | Məzmun köçürülüb |
| `no-content-in-source` | Səhifə var, amma görünən məzmun yoxdur |
| `empty-in-source` | Səhifə boşdur |
| `no-az-counterpart` | Yalnız EN saytında var |

Daxili linklər yeni marşrutlara çevrilir; EN və FA səhifələrində dil prefiksi avtomatik əlavə olunur (`content/load.ts`).

## Statik məlumat faylları

| Fayl | Məzmun | Mənbə (22.11.2026) |
| --- | --- | --- |
| `data/banking.ts` → `INSTITUTION` | Ad, lisenziya, VÖEN, bank kodu, SWIFT, müxbir hesab | bmibaku.az/haqqimizda, /contact |
| `data/banking.ts` → `CONTACT`, `LINKS` | Telefonlar, e-poçt, xəritə, xarici istinadlar, bankomat linki | Footer, yan menyu |
| `data/banking.ts` → `METRICS` | 1993, 94, 3500, 43000 | Ana səhifə; 94, 3500, 43000 → `needs-verification` |
| `data/loanProducts.ts` → `PROMO_PRODUCTS` | Ana səhifə aksiyası: 8%, 10%, 12%; avto → `null` | Ana səhifə slayderi |
| `data/loanProducts.ts` → `CREDIT_PRODUCTS` | 8 məhsulun rəsmi şərtləri (faiz, müddət, hədd) | /kreditler-ferdi/, /kredit-kalkulatoru/ |
| `data/currencies.ts` | 22.11.2026 məzənnələri (ehtiyat) | Ana səhifə |
| `data/discrepancies.ts` | 5 açıq uyğunsuzluq | Köçürmə zamanı tapılıb |

## Məzənnələr

Mənbə: bmibaku.az saytının öz məzənnə plagini (WordPress "currency-rate-manager"): `admin-ajax.php?action=mv_cr_read`. Ünvan `RATES_SOURCE_URL` ilə dəyişdirilə bilər.

| Funksiya (`lib/rates.ts`) | Nə edir |
| --- | --- |
| `getLatestRates()` | Son rəsmi məzənnələr. 10 dəqiqə keşlənir. Mənbə cavab verməsə, `data/currencies.ts` göstərilir və "canlı deyil" kimi işarələnir |
| `getRateHistory({ from, to, currency, page })` | Rəsmi arxiv, səhifə-səhifə |

`0.0000` dəyəri "kotirovka yoxdur" (`null`) kimi göstərilir, sıfır kimi yox.

### `GET /api/rates/history`

| Parametr | Qayda |
| --- | --- |
| `from`, `to` | `YYYY-MM-DD`, `from ≤ to` |
| `currency` | `USD`, `EUR`, `IRR`, `AED`, `RUB` və ya boş |
| `page` | 1–100 |

Cavab: `{ points: [{ date, code, unit, cash, noncash }], page, hasNext, hasPrev }`. Xəta: `400` (parametr), `502` (mənbə əlçatan deyil). CDN keşi: `s-maxage=600`.

## Forma API-ləri

Hər iki forma brauzerdən birbaşa bankın sisteminə yox, bu saytın server marşrutuna göndərilir. Server yoxlayır, sonra mühit dəyişənindəki ünvana (`Bearer` token ilə, yalnız HTTPS) ötürür. Şəxsi məlumat log-a yazılmır və brauzerdə (`localStorage`) saxlanılmır.

### Ümumi qoruma (`lib/forms.ts`)

| Yoxlama | Cavab |
| --- | --- |
| `Origin` başqa domendir | `403 forbidden_origin` |
| `Content-Type` JSON deyil | `415` |
| Gövdə 16 KB-dan böyükdür (`Content-Length` olmasa da yoxlanılır) | `413` |
| Eyni IP-dən 10 dəqiqədə 5-dən çox sorğu | `429 rate_limited` |
| JSON səhvdir | `400 invalid_json` |
| Gizli `website` sahəsi doludur (bot tələsi) | `400 rejected` |

IP `X-Real-IP` başlığından, yoxdursa `X-Forwarded-For` siyahısının **sonuncu** elementindən götürülür. Birinci element müştəri tərəfindən saxtalaşdırıla bilər. Bu, qarşıda tam bir etibarlı reverse proxy olduğunu fərz edir (bax [Yerləşdirmə](yerlesdirme.md)). Limit yaddaşdadır: bir neçə server nüsxəsi olsa, Redis kimi ortaq yaddaş lazımdır.

### `POST /api/credit-application`

| Sahə | Qayda |
| --- | --- |
| `fullName` | Ən azı 2 söz, yalnız hərflər, boşluq, `'`, `.`, `-` |
| `fin` | 7 simvol, latın hərfi və rəqəm (böyük hərfə çevrilir) |
| `amount`, `salary` | Müsbət ədəd, ən çox 2 onluq |
| `currency` | `AZN`, `USD`, `EUR` |
| `term` | 6, 12, 18, 24, 36, 60 ay |
| `workplace`, `purpose` | Ən azı 2 simvol |
| `phone` | `+994` + 9 rəqəm |
| `consentRegistry`, `consentAsan` | `true` olmalıdır |

Cavablar: `422 validation` (`fields` siyahısı ilə), `503 not_configured` (`CREDIT_APPLICATION_ENDPOINT` boşdur), `502 backend_unavailable`, `200 { reference }`.

> **Diqqət:** forma FİN toplayır. `CREDIT_APPLICATION_ENDPOINT` yalnız hüquq, məlumatların qorunması və təhlükəsizlik bölmələrinin təsdiqindən sonra doldurulmalıdır. Qəbul edən sistem HTTPS, autentifikasiya və saxlama müddəti qaydalarına cavab verməlidir.

### `POST /api/contact`

| Sahə | Qayda |
| --- | --- |
| `kind` | `general` və ya `complaint` |
| `name` | Ad (1+ söz) |
| `email` | Düzgün e-poçt |
| `phone` | İstəyə bağlı, `+994` formatı |
| `topic` | Mövzu |
| `message` | 10–3000 simvol |

Cavablar kredit müraciəti ilə eynidir; endpoint: `CONTACT_ENDPOINT`.

Formalar kart nömrəsi, PIN və internet bankçılıq parolu istəmir.

## Formatlama

`utils/currency.ts`:

- Maliyyə rəqəmləri bütün dillərdə latın rəqəmləri və `.` onluq ayırıcısı ilə yazılır, bank məzənnələri belə dərc edir. Chrome-da Azərbaycan rəqəm formatı olmadığından `az` dili `en-US` formatına bağlanıb.
- Tarix: AZ `22.11.2026`, EN `22 Nov 2026`, FA İran təqvimi ilə.
