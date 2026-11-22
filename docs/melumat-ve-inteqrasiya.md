# Məlumat və inteqrasiya

## Mənbə prinsipi

Bank saytında dəqiqlik boş yeri doldurmaqdan vacibdir. Ona görə:

- Hər fakt `src/data/` qovluğunda mənbəyi ilə (`provenance`) saxlanılır.
- Mənbəyi olmayan rəqəm (məzənnə, faiz, tarixçə) uydurulmur. İnterfeys belə hallarda "təqdim edilmir" və ya "qoşulmayıb" vəziyyətini göstərir.
- Statik məlumat heç vaxt "canlı" kimi təqdim olunmur.

Mənbə vəziyyətləri (`types/banking.ts` → `VerificationStatus`):

| Vəziyyət | Mənası |
| --- | --- |
| `official-site` | bmibaku.az saytından `checkedOn` tarixində götürülüb |
| `needs-verification` | Rəsmi saytda var, amma ziddiyyətli və ya qrup səviyyəlidir; buraxılışdan əvvəl bankla təsdiqlənməlidir |

## Fayllar

| Fayl | Məzmun | Mənbə (22.11.2026) |
| --- | --- | --- |
| `data/banking.ts` → `INSTITUTION` | Tam ad, yaranma tarixi, lisenziya, VÖEN, bank kodu, SWIFT, müxbir hesab | bmibaku.az/haqqimizda |
| `data/banking.ts` → `CONTACT` | Telefonlar, e-poçt, iş saatları | bmibaku.az footer |
| `data/banking.ts` → `LINKS` | İnternet Bankçılıq, daxili səhifələr, xarici istinadlar | bmibaku.az menyu və footer linkləri |
| `data/banking.ts` → `METRICS` | 1993, 94, 3500, 43000 | Ana səhifə; 94, 3500, 43000 → `needs-verification` |
| `data/loanProducts.ts` | 8%, 10%, 12%; avto → `null` | Ana səhifə slayderi |
| `data/currencies.ts` | 22.11.2026 məzənnələri | Ana səhifə "Valyuta Məzənnəsi" |
| `data/navigation.ts` | Menyu və xidmət siyahıları | — |

### Daxili səhifə linkləri

Bütün xidmət linkləri mövcud rəsmi səhifələrə aparır və eyni pəncərədə açılır. Məsələn:

- `/ferdi-bankciliq/`, `/korporativ-bankciliq/`, `/haqqimizda/`, `/foto-qalereya/`
- `/cari-hesablar-ferdi/`, `/plastik-kartlar-ferdi/`, `/emanetler-ferdi/`, `/kreditler-ferdi/`, `/bank-tarifleri-ferdi/`
- `/cari-hesablar-korporativ/`, `/nagdsiz-emeliyyatlar-korporativ/`, `/depozitler-korporativ/`, `/kreditler-korporativ/`
- `/pul-kocurmeleri-ferdi/`, `/emlak-satisi/`, `/online-kredit-sifarisi/`, `/valyuta-tarixcesi/`

Rəsmi sayt "ATM və POS Terminallar" linkini də plastik kartlar səhifəsinə yönləndirir; bu saytda da elə saxlanılıb. Yeni sayt WordPress-i əvəz edəndə bu səhifələr ya köçürülməli, ya da köhnə ünvanlarda qalmalıdır.

Xarici linklər yeni pəncərədə `rel="noopener noreferrer"` ilə açılır:

- cbar.az, cbi.ir, adif.az, pk.cbar.az (Güzəşt Kalkulyatoru), accr.e-cbar.az (Kredit Reyestri)
- bmi.ir — rəsmi saytdakı kimi `http://` ilə, çünki `https://bmi.ir` sertifikat yoxlamasından keçmədi

## Məzənnə obyekti

```ts
{
  code: 'USD',                               // USD | EUR | IRR | AED | RUB
  unit: 1,                                   // IRR üçün 100
  cash:    { buy: '1.6970', sell: '1.7000' } | null,
  noncash: { buy: '1.6900', sell: '1.7070' } | null,
}
```

Qiymətlər AZN ilə, `unit` vahid üçündür. Dəyişməsinlər deyə onluq **sətir** kimi saxlanılır. `null` "təqdim edilmir" deməkdir. Rəsmi saytda IRR, AED və RUB üçün 0.0000 dərc olunub; burada bu `null` kimi saxlanılır.

## API müqavilələri

Ünvanlar `.env.local` faylında verilir (bax [Yerləşdirmə](yerlesdirme.md)). Bütün sorğular `credentials: 'omit'` ilə göndərilir.

### 1. Cari məzənnələr — `VITE_RATES_API_URL`

`GET {url}` sorğusu aşağıdakı cavabı qaytarmalıdır:

```json
{
  "asOf": "2026-11-23",
  "source": { "label": "Bank Melli İran Bakı filialı", "url": "https://bmibaku.az/" },
  "items": [
    { "code": "USD", "unit": 1, "cash": { "buy": "1.6970", "sell": "1.7000" }, "noncash": { "buy": "1.6900", "sell": "1.7070" } },
    { "code": "IRR", "unit": 100, "cash": null, "noncash": null }
  ]
}
```

- Tanınmayan valyuta atılır.
- Müsbət olmayan və ya sətir olmayan qiymət `null` sayılır.
- Format səhvdirsə, xəta mesajı göstərilir; nümunə rəqəm göstərilmir.
- Belə məlumat "Canlı məlumat" kimi işarələnir.

### 2. Məzənnə tarixçəsi — `VITE_RATES_HISTORY_API_URL`

`GET {url}?currency=USD&from=2026-10-23&to=2026-11-22` sorğusu aşağıdakı cavabı qaytarmalıdır:

```json
{ "points": [ { "date": "2026-11-20", "cash": { "buy": "1.6970", "sell": "1.7000" }, "noncash": null } ] }
```

- Tarixi səhv olan və ya hər iki cütü `null` olan nöqtə atılır.
- Nöqtələr tarixə görə sıralanır.
- Panel nöqtələri cədvəldə göstərir, 2 və daha çox nöqtə olduqda qrafik də çəkir.
- Ünvan verilməyibsə, panel "qoşulmayıb" mesajını və rəsmi tarixçə səhifəsinin linkini göstərir.

### 3. Kredit müraciəti — `VITE_LOAN_APPLICATION_API_URL`

`POST {url}` sorğusu `Content-Type: application/json` ilə göndərilir:

```json
{
  "firstName": "Aysel",
  "lastName": "Məmmədova",
  "phone": "+994501234567",
  "productId": "cash",
  "amount": 10000,
  "termMonths": 24,
  "consent": true,
  "consentAt": "2026-11-22T10:15:00.000Z",
  "locale": "az"
}
```

Uğurlu cavab 2xx statusu ilə gəlməlidir:

```json
{ "reference": "BMI-4F2K9A" }
```

- "Müraciətiniz qəbul edildi" yalnız 2xx cavab və `reference` sahəsi olduqda göstərilir. Əks halda xəta mesajı və bankın telefonu göstərilir; daxil edilmiş məlumat qalır.
- Ünvan verilməyibsə, **demo rejim** işləyir. Formada xəbərdarlıq var, nəticə ekranında "Müraciət göndərilmədi" yazılır və rəsmi formanın linki verilir.
- Forma məlumatı heç yerdə saxlanılmır (localStorage və cookie istifadə olunmur). Pasport, kart və şifrə soruşulmur.

**Backend tələbləri:**

- Bütün yoxlamaları serverdə təkrarlayın.
- Sürət limiti və bot qorunması qoyun.
- CORS-da yalnız saytın domeninə icazə verin.
- Razılığı (`consentAt`) qeydə alın.

## Forma yoxlaması

Yoxlama `LoanApplicationModal.tsx` və `utils/validation.ts` fayllarındadır.

| Sahə | Qayda |
| --- | --- |
| Ad, Soyad | 2–50 simvol: hərflər, boşluq, defis, apostrof. İdarəedici simvollar silinir |
| Mobil telefon | `+994 / 994 / 0` prefiksindən sonra 9 rəqəm. Operator kodu 10, 50, 51, 55, 60, 70, 77 və ya 99 olmalıdır. Nömrə `+994XXXXXXXXX` formatına salınır |
| Məbləğ | Tam ədəd, 500–50,000 |
| Müddət | Tam ədəd, 3–48 |
| Razılıq | Məcburidir |

Göndərəndə xətaların xülasəsi göstərilir və fokus birinci səhv sahəyə keçir. Xəta mesajı ikon və mətnlə verilir, yalnız rənglə yox.

## Formatlama

`utils/currency.ts` faylında:

- Maliyyə rəqəmləri bütün dillərdə latın rəqəmləri və `.` onluq ayırıcısı ilə yazılır, bank məzənnələri belə dərc edir. Chrome-da Azərbaycan rəqəm formatı olmadığından `az` dili `en-US` formatına bağlanıb.
- Tarix: AZ `22.11.2026`, EN `22 Nov 2026`, FA İran təqvimi ilə.
