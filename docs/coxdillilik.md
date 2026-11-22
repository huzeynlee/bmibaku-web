# Çoxdillilik (AZ / EN / FA)

Mətnlər `src/i18n/` qovluğundadır:

| Fayl | Rolu |
| --- | --- |
| `az.ts` | Mənbə lüğət. `Dictionary` tipi bu fayldan çıxır |
| `en.ts`, `fa.ts` | `Dictionary` tipindədir. Açar çatışmırsa, TypeScript xəta verir |
| `index.tsx` | `I18nProvider`, `useI18n()`, `LANGUAGES` |

Natamam tərcümə build-dən keçmir, ona görə yarımçıq dil səhifəsi yarana bilməz.

## Dil necə seçilir

1. URL: `?lang=en`, `?lang=fa`
2. Əvvəlki seçim: `localStorage` → `lang` (yalnız dil saxlanılır, başqa məlumat yox)
3. Brauzerin dilləri (`navigator.languages`)
4. Heç biri uyğun gəlmirsə: `az`

Dil dəyişəndə `<html lang dir>`, `document.title` və `meta description` yenilənir. URL `history.replaceState` ilə dəyişir, səhifə yenidən yüklənmir.

> Rəsmi saytın ayrıca ingilis versiyası var (en.bmibaku.az). Bu sayt isə üç dili bir ünvanda saxlayır.

## İstifadə

```tsx
const { t, lang, dir, setLang } = useI18n();

<h2>{t.calc.title}</h2>
{fmt(t.rates.updated, { date: formatDate(asOf, lang) })}
```

- `t` tipli obyektdir; avtomatik tamamlama və açar yoxlaması işləyir.
- `fmt(template, vars)` `{ad}` yer tutucularını doldurur (`utils/cx.ts`).
- `splitTemplate(template, 'rate')` dəyəri ayrıca üslubla göstərmək üçündür, məsələn böyük "8%".

## Yeni mətn əlavə etmək

1. `az.ts` faylına açar əlavə edin.
2. `npm run typecheck` — `en.ts` və `fa.ts` faylları çatışmayan açarı göstərəcək.
3. Hər iki faylı tamamlayın.
4. Hər üç dildə yoxlayın: `/?lang=az`, `/?lang=en`, `/?lang=fa`.

## Yazı qaydaları

| Qayda | Nümunə |
| --- | --- |
| Faizdən sonra şəkilçi "faiz" sözünə uyğunlaşır | `8%-dən başlayaraq` ("8 faizdən") |
| İl və şəkilçi sətir sonunda ayrılmasın | `1993-⁠cü` (defisdən sonra U+2060 word joiner) |
| Üç nöqtə əvəzinə `…` | `Göndərilir…` |
| Xəta mesajı həll yolunu da desin | "Nömrəni +994 XX XXX XX XX formatında daxil edin…" |
| Brend adları tərcümə olunmur | `MİLLİ KART`, `Bank Melli Iran` — kodda `translate="no"` |

## Fars dili (RTL)

- `fa` seçiləndə `<html dir="rtl">` olur və Vazirmatn şrifti istifadə olunur.
- Kodda yalnız məntiqi xüsusiyyətlərdən istifadə edin: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`.
- İstiqamət göstərən ikonlar çevrilir: `rtl:rotate-180` və ya `rtl:-scale-x-100`.
- Telefon, e-poçt, SWIFT, hesab nömrəsi və kart nömrəsi `dir="ltr"` ilə yazılır.
- Hero tablarında RTL-də ← növbəti tabdır.
- Slayderin doluluq xətti və tarixçə paneli də güzgü kimi çevrilir.
- FA mətnlərini doğma danışan yoxlamalıdır.
