# Çoxdillilik (AZ / EN / FA)

## Marşrutlar

| Dil | Ünvan | Necə işləyir |
| --- | --- | --- |
| AZ | `/ferdi-bankciliq/` | `middleware.ts` ünvanı daxildə `/az/...`-a yönəldir (rewrite). Köhnə saytla eyni URL |
| EN | `/en/ferdi-bankciliq/` | Prefiksli |
| FA | `/fa/ferdi-bankciliq/` | Prefiksli, `<html dir="rtl">` |

- `/az/...` ilə açılan ünvan prefikssiz kanonik ünvana yönləndirilir.
- Hər səhifənin metadata-sında `alternates` (hreflang) üç dili göstərir.
- Dil dəyişdirici (`LanguageSwitcher`) eyni səhifənin digər dildəki ünvanına aparır. Brauzerdə heç nə saxlanılmır.
- `stripLocale()` `/az`, `/en`, `/fa` prefikslərini silir. `/az`-ı da silmək vacibdir: `usePathname()` AZ səhifələrində serverdə `/az/...`, brauzerdə `/...` qaytara bilər.

## İki növ mətn

| Növ | Harada | Mənbə |
| --- | --- | --- |
| **İnterfeys mətni** (menyu, düymə, forma, xəta) | `src/i18n/az.ts`, `en.ts`, `fa.ts` | Bu layihədə yazılıb |
| **Səhifə məzmunu** (bank haqqında, tariflər, hesabatlar…) | `content/pages/{az,en}/*.json` | Köhnə saytdan köçürülüb |

### İnterfeys mətni

- `az.ts` mənbə lüğətdir; `Dictionary` tipi ondan çıxır. `en.ts` və `fa.ts` bu tipdədir: açar çatışsa, build dayanır.
- Server komponentlərində: `getDictionary(locale)`. Klientdə: `const { t, locale, dir } = useI18n();`.
- `fmt(template, vars)` `{ad}` yer tutucularını doldurur; `splitTemplate` dəyəri ayrıca üslubla göstərmək üçündür (məs. böyük "8%").
- `src/i18n/config.ts` → `UI_TRANSLATION_REVIEW = { az: false, en: true, fa: true }`. `true` olan dildə səhifənin yuxarısında "tərcümə yoxlanılır" zolağı görünür. Doğma danışan yoxlayandan sonra `false` edin.

### Səhifə məzmunu

`content/load.ts` → `loadPage(slug, locale)`:

| Dil | Göstərilən |
| --- | --- |
| AZ | Rəsmi AZ məzmunu |
| EN | en.bmibaku.az-dakı rəsmi EN məzmunu varsa — o; yoxdursa və ya boşdursa — AZ məzmunu + "bu səhifənin ingiliscə versiyası yoxdur" qeydi |
| FA | Həmişə AZ məzmunu + qeyd. Mənbə saytda fars dilində məzmun yoxdur |

**Maşın tərcüməsi göstərilmir.** Rəsmi tərcümə olmayan yerdə orijinal mətn qeydlə göstərilir.

## Yeni interfeys mətni əlavə etmək

1. `az.ts` faylına açar əlavə edin.
2. `npm run typecheck` — `en.ts` və `fa.ts` çatışmayan açarı göstərəcək.
3. Hər iki faylı tamamlayın.
4. Üç dildə yoxlayın: `/`, `/en/`, `/fa/`.

## Yazı qaydaları

| Qayda | Nümunə |
| --- | --- |
| Faizdən sonra şəkilçi "faiz" sözünə uyğunlaşır | `8%-dən başlayaraq` ("8 faizdən") |
| İl və şəkilçi sətir sonunda ayrılmasın | `1993-⁠cü` (defisdən sonra U+2060 word joiner) |
| Üç nöqtə əvəzinə `…` | `Göndərilir…` |
| Xəta mesajı həll yolunu da desin | "Nömrəni +994 XX XXX XX XX formatında daxil edin…" |
| Brend adları tərcümə olunmur | `MİLLİ KART`, `Bank Melli Iran` — kodda `translate="no"` |

## Fars dili (RTL)

- `fa` səhifələrində `<html lang="fa" dir="rtl">` və Vazirmatn şrifti (`--font-fa`).
- Kodda yalnız məntiqi xüsusiyyətlər: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`.
- İstiqamət göstərən ikonlar çevrilir: `rtl:rotate-180` və ya `rtl:-scale-x-100`. Dekorativ motivlər də güzgü kimi çevrilir.
- Telefon, e-poçt, SWIFT, hesab nömrəsi `dir="ltr"` ilə yazılır.
- Qalereyada RTL-də ← növbəti şəkildir.
- FA mətnlərini doğma danışan yoxlamalıdır.
