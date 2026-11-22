# Bank Melli İran Bakı filialı — texniki sənədlər

Bu qovluq bmibaku.az saytının yeni versiyasının texniki sənədləridir (v2). Sayt tək səhifəlik React + TypeScript tətbiqidir. Daxilində kredit kalkulyatoru, valyuta çeviricisi, məzənnə tarixçəsi və onlayn kredit müraciəti formu var.

## Sənədlər

| Sənəd | Kimin üçün | Nə var |
| --- | --- | --- |
| [Arxitektura](arxitektura.md) | Frontend tərtibatçı | Texnologiyalar, qovluqlar, vəziyyət axını, komponentlər |
| [Məlumat və inteqrasiya](melumat-ve-inteqrasiya.md) | Backend / inteqrasiya | Məlumat faylları, mənbələr, 3 API müqaviləsi, yoxlama qaydaları |
| [Çoxdillilik](coxdillilik.md) | Tərtibatçı, redaktor | AZ / EN / FA lüğətləri, yeni mətn, RTL qaydaları |
| [Dizayn sistemi](dizayn-sistemi.md) | Dizayner, tərtibatçı | Rənglər, şrift, ölçülər, komponentlər, hərəkət, əlçatanlıq |
| [Yerləşdirmə](yerlesdirme.md) | DevOps | Build, mühit dəyişənləri, server, buraxılış siyahısı |

## Tez başlanğıc

Node.js 18 və ya daha yeni versiya lazımdır.

```powershell
npm install
```

```powershell
npm run dev
```

Brauzerdə `http://localhost:5173` ünvanını açın.

| Əmr | Nə edir |
| --- | --- |
| `npm run dev` | İnkişaf serveri |
| `npm run build` | Tip yoxlaması, sonra `dist/` qovluğuna build |
| `npm run preview` | `dist/` versiyasını yerli göstərir |
| `npm run typecheck` | Yalnız TypeScript yoxlaması |

## Səhifənin bölmələri

1. Üst zolaq — iş vaxtı, Güzəşt Kalkulyatoru, Kredit Reyestri, AZ | EN | FA
2. Menyu — rəsmi BMİ emblemi, bölmələr (Fərdi və Korporativ üçün açılan siyahı), aktiv bölmə göstəricisi, İnternet Bankçılıq
3. Hero — başlıq, 2 düymə, MİLLİ KART vizualı, 4 kredit məhsulu tabları
4. Haqqımızda — 1993, 94 il, 3,500+, 43,000+
5. Valyuta Məzənnəsi — cədvəl, çevirici, tarixçə paneli
6. Kredit Kalkulyatoru — növ, məbləğ, müddət, ödəniş xülasəsi
7. Fərdi Bankçılıq — 5 xidmət, MİLLİ KART bloku
8. Korporativ Bankçılıq — 5 xidmət, biznes kredit faizi (tünd fon)
9. Xidmətlər və Alətlər — 4 xidmət
10. Rekvizitlər və istinadlar — bank rekvizitləri (kopyalama düyməsi ilə), rəsmi qurumlar
11. Footer — brend, naviqasiya, istinadlar, əlaqə, hüquqi qeyd
12. Telefonda alt panel — İnternet Bankçılıq, Valyuta Məzənnəsi

## Açıq qalan işlər

Ətraflı siyahı [Yerləşdirmə](yerlesdirme.md#buraxılışdan-əvvəl-yoxlama-siyahısı) sənədindədir. Ən vacibləri:

- **Kredit müraciəti göndərilmir.** API qoşulmayıb, forma demo rejimdədir və bunu açıq göstərir.
- **Məzənnələr canlı deyil.** 22.11.2026 tarixli rəsmi məzənnələr göstərilir və belə də qeyd olunub.
- **"94 illik" ifadəsi təsdiqlənməlidir.** Rəsmi saytda 94 yazılıb, amma 1928-ci ildən 2026-ya 98 il keçir.
