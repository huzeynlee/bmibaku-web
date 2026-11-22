# Bank Melli İran Bakı filialı — texniki sənədlər

Bu qovluq bmibaku.az saytının yeni versiyasının (v3) texniki sənədləridir. Sayt çoxsəhifəli Next.js tətbiqidir: köhnə saytın 54 səhifəsi eyni ünvanlarla (slug) köçürülüb, üstəlik ana səhifə, kredit kalkulyatoru, onlayn kredit müraciəti və məzənnə tarixçəsi var. Hər səhifə 3 dildə açılır: AZ, EN, FA.

## Sənədlər

| Sənəd | Kimin üçün | Nə var |
| --- | --- | --- |
| [Arxitektura](arxitektura.md) | Frontend tərtibatçı | Texnologiyalar, qovluqlar, marşrutlar, şablonlar, server və klient komponentləri |
| [Məlumat və inteqrasiya](melumat-ve-inteqrasiya.md) | Backend / inteqrasiya | Məzmunun köçürülməsi, məzənnə mənbəyi, forma API-ləri, təhlükəsizlik |
| [Çoxdillilik](coxdillilik.md) | Tərtibatçı, redaktor | Dil marşrutları, lüğətlər, rəsmi məzmun və ehtiyat dil, RTL |
| [Dizayn sistemi](dizayn-sistemi.md) | Dizayner, tərtibatçı | Rənglər, şrift, komponentlər, hərəkət (animasiya), əlçatanlıq |
| [Yerləşdirmə](yerlesdirme.md) | DevOps | Node server, mühit dəyişənləri, keşləmə, yönləndirmələr, buraxılış siyahısı |
| [Köçürmə hesabatı](MIGRATION-REPORT.md) | Layihə rəhbəri, bank | Hər marşrut üzrə: köhnə ünvan, yeni ünvan, məzmun, funksiyalar, sənədlər, yoxlama və test nəticəsi (ingiliscə) |

## Tez başlanğıc

Node.js 20 və ya daha yeni versiya lazımdır.

```powershell
npm install
```

```powershell
npm run dev
```

Brauzerdə `http://localhost:3000` ünvanını açın.

| Əmr | Nə edir |
| --- | --- |
| `npm run dev` | İnkişaf serveri (`http://localhost:3000`) |
| `npm run build` | Production build (`.next/`), 173 statik səhifə |
| `npm start` | Production serveri (əvvəlcə `npm run build`) |
| `npm run typecheck` | Yalnız TypeScript yoxlaması |
| `npm run content:sync` | Köhnə saytdan məzmunu yenidən çəkir (`content/`) |
| `npm run qa -- http://localhost:3000` | Avtomatik test: bütün marşrutlar, linklər, formalar, qalereya, kalkulyator |
| `npm run report` | `docs/MIGRATION-REPORT.md` faylını yenidən yaradır |

## Saytın quruluşu

| Bölmə | Marşrutlar |
| --- | --- |
| Ana səhifə | `/` — hero və MİLLİ KART, kredit məhsulları, göstəricilər, məzənnə və çevirici, kalkulyator, xidmətlər, elanlar |
| Fərdi bankçılıq | `/ferdi-bankciliq/` və 7 alt səhifə |
| Korporativ bankçılıq | `/korporativ-bankciliq/` və 8 alt səhifə |
| Haqqımızda | `/haqqimizda/` — bank haqqında, idarəetmə və risklər, maliyyə məlumatları, əmlak satışı, elanlar, vakansiyalar (32 səhifə) |
| Alətlər | `/kredit-kalkulatoru/`, `/online-kredit-sifarisi/`, `/valyuta-tarixcesi/` |
| Digər | `/foto-qalereya/`, `/contact/` |

EN və FA versiyaları eyni slug ilə `/en/...` və `/fa/...` ünvanlarındadır.

## Açıq qalan işlər

Tam siyahı [köçürmə hesabatının](MIGRATION-REPORT.md#open-items-not-done-or-not-verified) sonundadır. Ən vacibləri:

- **Kredit müraciəti qəbul olunmur.** Forma FİN, maaş və telefon toplayır. `CREDIT_APPLICATION_ENDPOINT` hüquq, məlumatların qorunması və təhlükəsizlik bölmələri qəbul edən sistemi təsdiqləyənə qədər boş qalır. Bu vaxt API `503` qaytarır və səhifə bunu açıq deyir.
- **Əlaqə / şikayət forması da göndərmir** — `CONTACT_ENDPOINT` bankın müraciət sisteminə qoşulmalıdır.
- **Mənbədəki 5 uyğunsuzluq** bankın qərarını gözləyir (kredit faizləri, "94 il", gizli əmlak elanı, köhnə EN maliyyə səhifələri). Siyahı: `src/data/discrepancies.ts`.
- **Şəkillər və sənədlər** hələ bmibaku.az `/wp-content/uploads/` ünvanından yüklənir. Köhnə WordPress söndürülməzdən əvvəl köçürülməlidir.
- **FA məzmunu yoxdur.** Mənbə saytda fars dilində mətn yoxdur; FA səhifələri AZ mətnini qeydlə göstərir. EN və FA interfeys mətnləri "yoxlanılır" kimi işarələnib.
