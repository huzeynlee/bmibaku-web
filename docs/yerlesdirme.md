# Yerləşdirmə

## Server tələbi

Sayt **Node.js serveri** tələb edir (Node 20+). Statik fayl kimi (`next export`) yerləşdirilə bilməz, çünki:

- `src/middleware.ts` dil marşrutlarını idarə edir (`/` → AZ, `/en/`, `/fa/`);
- `/api/*` marşrutları serverdə işləyir (məzənnə tarixçəsi, formalar);
- səhifələr hər 10 dəqiqədən bir arxa planda yenilənir (ISR, `revalidate = 600`), məsələn ana səhifədəki məzənnə.

Uyğun variantlar: öz serverdə `npm start` + Nginx reverse proxy, Docker, və ya Node dəstəkləyən platforma (Vercel və s.).

## Mühit dəyişənləri

`.env.example` faylını `.env.local` (və ya serverin mühit dəyişənləri) kimi doldurun. Hamısı **yalnız serverdə** oxunur, brauzerə getmir.

| Dəyişən | Boş olanda |
| --- | --- |
| `RATES_SOURCE_URL` | Defolt: `https://bmibaku.az/wp-admin/admin-ajax.php` (köhnə saytın məzənnə plagini) |
| `CREDIT_APPLICATION_ENDPOINT`, `CREDIT_APPLICATION_TOKEN` | Onlayn kredit müraciəti qəbul edilmir (`503`); səhifə telefon və filialı göstərir |
| `CONTACT_ENDPOINT`, `CONTACT_TOKEN` | Əlaqə / şikayət forması qəbul edilmir (`503`); səhifə e-poçt və telefonu göstərir |
| `SITE_URL` | Defolt: `https://bmibaku.az` (canonical, sitemap, Open Graph) |

- Production-da endpoint ünvanları yalnız `https://` ola bilər.
- `CREDIT_APPLICATION_ENDPOINT` yalnız hüquq, məlumatların qorunması və təhlükəsizlik təsdiqindən sonra doldurulmalıdır (forma FİN toplayır).
- Gizli tokenlər git-ə yazılmır (`.env*` `.gitignore`-dadır, yalnız `.env.example` saxlanılır).

## Build və işə salma

```powershell
npm ci
```

```powershell
npm run build
```

```powershell
npm start -- -p 3000
```

Build 173 səhifə yaradır: 3 dil × (ana səhifə + 54 marşrut) = 165 səhifə, üstəlik `404`, `sitemap.xml`, `robots.txt`. İlk yükləmədə paylaşılan JavaScript ~103 KB (gzip), səhifə başına ~185–192 KB. Recharts yalnız tarixçədə tək valyuta seçiləndə yüklənir.

`NEXT_DIST_DIR` dəyişəni build qovluğunu dəyişir (defolt `.next`). Bu, eyni qovluqda `npm run dev` işləyərkən ayrıca test build-i yığmaq üçündür:

```powershell
$env:NEXT_DIST_DIR = '.next-qa'; npm run build; npm start -- -p 3100
```

## Nginx (reverse proxy)

```nginx
server {
    listen 443 ssl http2;
    server_name bmibaku.az www.bmibaku.az;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}

# Köhnə ingilis saytı: en.bmibaku.az/<slug>/ → bmibaku.az/en/<az-slug>/
server {
    listen 443 ssl http2;
    server_name en.bmibaku.az;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
    }
}
```

- **`X-Real-IP` mütləqdir.** Formaların sorğu limiti IP-ni bu başlıqdan götürür. Proxy onu təyin etməsə, müştəri saxta dəyər göndərə bilər.
- `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy` başlıqlarını tətbiq özü göndərir (`next.config.mjs`). HSTS proxy-də əlavə olunur.
- `en.bmibaku.az` bu serverə yönələndə köhnə EN ünvanları `next.config.mjs`-dəki 301 yönləndirmələrlə yeni `/en/...` səhifələrinə gedir.
- Bir neçə server nüsxəsi işləyəcəksə, sorğu limiti üçün ortaq yaddaş (Redis) lazımdır; indiki limit hər prosesin öz yaddaşındadır.

## Yönləndirmələr (`next.config.mjs`)

| Köhnə ünvan | Yeni ünvan |
| --- | --- |
| `/index/` | `/` |
| `/maliyye-veziyyeti-haqqinda-hesabat-13-04-2018/` (boş) | `/maliyye-hesabatlari/` |
| `en.bmibaku.az/<en-slug>/` | `bmibaku.az/en/<az-slug>/` (manifestdən avtomatik) |
| `en.bmibaku.az/photo-gallery/` | `/en/foto-qalereya/` |
| `en.bmibaku.az/exchange-rate-api/`, `/valyuta-mezenne-api/` | `/en/valyuta-tarixcesi/` |

AZ slug-ları dəyişmədiyi üçün `bmibaku.az/<slug>/` ünvanları yönləndirmə olmadan işləyir.

## Buraxılışdan əvvəl yoxlama siyahısı

### Məzmun

- [x] 58 AZ və 60 EN mənbə səhifəsi yoxlanılıb; hər biri köçürülüb və ya hesabatda qeyd olunub.
- [ ] 5 uyğunsuzluq bankla həll olunub (`src/data/discrepancies.ts`).
- [ ] 3,500+ filial və 43,000+ əməkdaş baş ofislə təsdiqlənib.
- [ ] EN və FA interfeys mətnləri doğma danışanlar tərəfindən yoxlanılıb; sonra `src/i18n/config.ts` → `UI_TRANSLATION_REVIEW` `false` edilir.
- [ ] Rəsmi FA məzmunu hazırlanıb (indi FA səhifələri AZ mətnini qeydlə göstərir).
- [ ] Şəkil və sənədlər (`/wp-content/uploads/`) yeni serverə köçürülüb.

### İnteqrasiya

- [ ] `CREDIT_APPLICATION_ENDPOINT` təsdiqlənib, qoşulub və `200 { reference }` qaytarır.
- [ ] `CONTACT_ENDPOINT` qoşulub.
- [ ] Məzənnə mənbəyi (`RATES_SOURCE_URL`) köhnə WordPress söndürüləndən sonra da işləyir — əks halda yeni mənbə lazımdır.
- [ ] `en.bmibaku.az` DNS-i bu serverə yönəldilib.

### Texniki (22.11.2026, production build, `npm run qa`)

- [x] `npm run build` və `npm run typecheck`: xəta yoxdur.
- [x] 140 səhifə yükləməsi (bütün AZ marşrutları + EN/FA nümunələri, 1440 və 390 px): HTTP 200, bir `<h1>`, düzgün `lang`/`dir`, yan sürüşmə yoxdur, konsol xətası yoxdur, hydration xətası yoxdur.
- [x] 165 daxili link: sınıq link yoxdur.
- [x] 15 funksional test: forma API-ləri (503/422/403/400/413/429), məzənnə tarixçəsi API-si, qalereya (klaviatura), kalkulyator, çevirici, JavaScript olmadan məzmun görünür.
- [x] Lighthouse iş masası (4 səhifə): Performance 99–100, Accessibility 100, Best Practices 100, SEO 100.
- [x] Lighthouse mobil (4 səhifə): Performance 86–92, Accessibility 100, Best Practices 100, SEO 100. LCP 3.0–3.5 s (Lighthouse-un yavaş 4G simulyasiyası), CLS 0.
- [ ] Real serverdə HTTPS, HSTS və `X-Real-IP` yoxlanılıb.
- [ ] Ekran oxuyucu ilə əl testi və real iPhone / Android cihazda yoxlama.

## Yeniləmə

1. Məzmun köhnə WordPress-də dəyişibsə: `npm run content:sync`.
2. Kod dəyişikliyi: `npm run dev` ilə yoxlayın.
3. `npm run build`, `npm start`, sonra `npm run qa -- http://localhost:3000`.
4. `npm run report` — köçürmə hesabatı yenilənir.
5. Serverə yerləşdirin və prosesi yenidən başladın.

Məzənnələr kod dəyişmədən 10 dəqiqədən bir yenilənir.
