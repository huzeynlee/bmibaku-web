# Yerləşdirmə

## Mühit dəyişənləri

`.env.example` faylını `.env.local` adı ilə kopyalayın. Bütün dəyərlər istəyə bağlıdır.

| Dəyişən | Boş olanda |
| --- | --- |
| `VITE_LOAN_APPLICATION_API_URL` | Demo rejim: forma yoxlanılır, heç nə göndərilmir və bu açıq yazılır |
| `VITE_RATES_API_URL` | 22.11.2026 tarixli rəsmi məzənnə "canlı deyil" qeydi ilə göstərilir |
| `VITE_RATES_HISTORY_API_URL` | Tarixçə paneli "qoşulmayıb" yazır və rəsmi səhifəyə link verir |

- Production build yalnız `https://` və ya eyni mənbəli nisbi ünvanı (`/api/...`) qəbul edir. Başqa ünvan boş sayılır.
- Bu dəyişənlər build zamanı koda yazılır. Ona görə gizli açar **heç vaxt** `VITE_` dəyişəninə qoyulmamalıdır.

API müqavilələri [Məlumat və inteqrasiya](melumat-ve-inteqrasiya.md#api-müqavilələri) sənədindədir.

## Build

```powershell
npm ci
```

```powershell
npm run build
```

Build əvvəlcə `tsc --noEmit` ilə tipləri yoxlayır, sonra `dist/` qovluğunu yaradır:

| Fayl | Ölçü (gzip) | Nə vaxt yüklənir |
| --- | --- | --- |
| `index-*.js` | ~83 KB | Həmişə (React daxil) |
| `index-*.css` | ~8 KB | Həmişə |
| `RateHistoryChart-*.js` | ~125 KB | Yalnız tarixçə məlumatı olanda |

`public/` qovluğundakı fayllar — favicon-lar, `brand/` (rəsmi emblem və loqo), `og-image.png`, `robots.txt`, `sitemap.xml` — `dist/` qovluğuna kopyalanır. Server tərəfində Node.js lazım deyil.

## Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name bmibaku.az www.bmibaku.az;
    root /var/www/bmibaku/dist;
    index index.html;

    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    location = / {
        try_files /index.html =404;
    }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml application/json;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Frame-Options "DENY" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;
}
```

- `script-src 'unsafe-inline'` yalnız `index.html`-dəki JSON-LD üçündür. Bundan qaçmaq üçün JSON-LD-ni xarici fayla çıxarın və ya hash istifadə edin.
- `style-src 'unsafe-inline'` slayderin `--fill` dəyişəni və kart qradiyenti üçün lazımdır.
- API başqa domendədirsə, onu `connect-src`-ə əlavə edin.
- **Köhnə WordPress səhifələri:** saytdakı xidmət linkləri `/ferdi-bankciliq/` kimi rəsmi səhifələrə aparır. Yeni SPA kökdə (`/`) yerləşəndə bu yolları WordPress-ə ötürməyə davam edin (proxy və ya ayrı `location` blokları). Əks halda linklər 404 verəcək.

## Buraxılışdan əvvəl yoxlama siyahısı

### Məzmun

- [x] Rəsmi loqo: bmibaku.az saytından götürülüb (`public/brand/`, favicon-lar, `og-image.png`). Baş ofisin brend qaydası varsa, emblem + mətn birləşməsini onunla tutuşdurun.
- [ ] "94 illik": `data/banking.ts` → `METRICS`. 1928-ci ildən 2026-ya 98 il keçir.
- [ ] 3,500+ filial və 43,000+ əməkdaş baş ofislə təsdiqlənib.
- [ ] Avto kredit faizi: dərc olunsa, `data/loanProducts.ts` faylında `annualRate` yazın. Kalkulyator onu avtomatik götürəcək.
- [ ] EN və FA mətnləri doğma danışanlar tərəfindən yoxlanılıb.
- [ ] Hüquq şöbəsi razılıq mətnini təsdiqləyib.

### İnteqrasiya

- [ ] `VITE_LOAN_APPLICATION_API_URL` qoşulub və backend 2xx + `reference` qaytarır.
- [ ] `VITE_RATES_API_URL` qoşulub. Rəsmi saytda IRR, AED və RUB üçün 0.0000 göstərilir; bu valyutalar dərc ediləcəksə, API real dəyər verməlidir.
- [ ] `VITE_RATES_HISTORY_API_URL` qoşulub və ya rəsmi tarixçə linki saxlanılıb.
- [ ] Köhnə WordPress yolları server səviyyəsində işləyir.

### Texniki (22.11.2026 ölçüləri)

- [x] `npm run build`: tip xətası yoxdur.
- [x] Brauzer konsolunda xəta və xəbərdarlıq yoxdur.
- [x] Yan sürüşmə yoxdur: 360, 390, 430, 768, 1024, 1440, 1920 px (AZ və FA).
- [x] Alt panel footer-i örtmür (360–430 px).
- [x] Lighthouse mobil: Performance 91, Accessibility 100, Best Practices 100, SEO 100.
- [x] Lighthouse iş masası: hamısı 100.
- [ ] Real serverdə HTTPS və təhlükəsizlik başlıqları aktivdir.
- [ ] Lighthouse real domendə təkrar ölçülüb.

## Yeniləmə

1. Dəyişikliyi edin və `npm run dev` ilə yoxlayın.
2. `npm run build` əmrini işə salın.
3. `dist/` qovluğunu serverə köçürün.

Məzənnə, faiz və əlaqə məlumatı dəyişəndə yalnız `src/data/` faylları dəyişir; API qoşulandan sonra isə kod dəyişməyə ehtiyac qalmır.
