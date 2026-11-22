# Migration report — bmibaku.az → Next.js

Generated 2026-11-22 18:01 UTC by `npm run report`. Source crawl: 2026-11-22 15:37 UTC (WordPress REST API, https://bmibaku.az and https://en.bmibaku.az); parsed 2026-11-22 17:11 UTC.

## Summary

| Item | Value |
|---|---|
| AZ source pages inspected | 58 (52 migrated, 3 without visible content, 3 empty) |
| EN source pages inspected | 60 (50 migrated, 3 without visible content, 4 empty, 3 without AZ counterpart) |
| Routes published | 55 per locale (home + 54), × 3 locales (AZ, EN, FA) = 165 pages |
| Source pages not published | 4 (see “Excluded source pages”) |
| Routes without an inspected source page | none |
| Documents linked (AZ) | 215 (served from original bmibaku.az URLs, not mirrored) |
| Distinct external links in AZ page content | 8 |
| Open discrepancies | 5 |
| Automated QA | 140 page loads (70 URLs × desktop 1440 / mobile 390), 0 with issues; 165 internal links checked, 0 broken |
| Functional checks | 15 run, 0 failed (see “Functional checks”) |
| QA run | 2026-11-22 18:01 UTC against `http://localhost:3100` |

**Migration status:** content for every inspected page is migrated or explicitly flagged below. The site is **not production-ready** until the open items at the end of this report are closed.

### How to read the table

- **Content migrated** — counts from the source page after removing Elementor duplicates (desktop-hidden mobile copies). “No visible content” means the source page exists but shows nothing; its hidden blocks were recorded, not published.
- **EN** — official English text from en.bmibaku.az is used when it exists. Otherwise the page shows the Azerbaijani text with a visible notice. **FA** always shows Azerbaijani content with a notice: the source site has no Persian content, and no machine translation is shown.
- **Testing** — automated checks on the production build: HTTP 200, one `<h1>`, no horizontal overflow, no console errors. ✓ lists the viewport widths tested.

## Route-by-route

| # | Original route | New route (AZ · EN · FA) | Content migrated | Functional elements | External links | Documents | EN content | Verification | Testing |
|---|---|---|---|---|---|---|---|---|---|
| 1 | [bmibaku.az/](https://bmibaku.az/)<br>EN: [en.bmibaku.az/](https://en.bmibaku.az/) | `/`<br>`/en/`<br>`/fa/` | Migrated: 49 words, 1 image(s) | Hero with 3D card (pointer tilt); Promo loan tabs; Live rates + converter; Calculator preview; Metrics count-up; News | 0 | 0 | Official EN (2025-05-22) | Source updated 2026-10-21<br>Crawled 2026-11-22<br>⚠ cash-loan-rate<br>⚠ business-loan-rate<br>⚠ heritage-years | AZ ✓ (1440/390)<br>EN ✓ (1440/390)<br>FA ✓ (1440/390) |
| 2 | [/ferdi-bankciliq/](https://bmibaku.az/ferdi-bankciliq/)<br>EN: [/individual-banking/](https://en.bmibaku.az/individual-banking/) | `/ferdi-bankciliq/`<br>`/en/ferdi-bankciliq/`<br>`/fa/ferdi-bankciliq/` | Migrated: 118 words, 1 image(s) | Section overview with service tiles | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390)<br>EN ✓ (1440/390) |
| 3 | [/cari-hesablar-ferdi/](https://bmibaku.az/cari-hesablar-ferdi/)<br>EN: [/current-accounts-individual/](https://en.bmibaku.az/current-accounts-individual/) | `/cari-hesablar-ferdi/`<br>`/en/cari-hesablar-ferdi/`<br>`/fa/cari-hesablar-ferdi/` | Migrated: 211 words | Link tiles | 0 | 0 | Official EN (2022-10-04) | Source updated 2022-10-04<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 4 | [/plastik-kartlar-ferdi/](https://bmibaku.az/plastik-kartlar-ferdi/)<br>EN: [/plastic-cards-individual/](https://en.bmibaku.az/plastic-cards-individual/) | `/plastik-kartlar-ferdi/`<br>`/en/plastik-kartlar-ferdi/`<br>`/fa/plastik-kartlar-ferdi/` | Migrated: 216 words, 1 table(s), 8 image(s) | 1 table(s); Gallery; Link tiles | 0 | 0 | Official EN (2022-07-07) | Source updated 2024-07-16<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 5 | [/emanetler-ferdi/](https://bmibaku.az/emanetler-ferdi/)<br>EN: [/deposits-individual/](https://en.bmibaku.az/deposits-individual/) | `/emanetler-ferdi/`<br>`/en/emanetler-ferdi/`<br>`/fa/emanetler-ferdi/` | Migrated: 100 words, 1 table(s) | Document list; 1 table(s); Link tiles | 0 | 4 pdf (2021) | Official EN (2022-04-21) | Source updated 2022-04-21<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 6 | [/kreditler-ferdi/](https://bmibaku.az/kreditler-ferdi/)<br>EN: [/loans-individual/](https://en.bmibaku.az/loans-individual/) | `/kreditler-ferdi/`<br>`/en/kreditler-ferdi/`<br>`/fa/kreditler-ferdi/` | Migrated: 99 words, 9 table(s) | 9 table(s) | 0 | 0 | empty-in-source → AZ fallback | Source updated 2023-01-31<br>Crawled 2026-11-22<br>⚠ cash-loan-rate<br>⚠ business-loan-rate | AZ ✓ (1440/390)<br>EN ✓ (1440/390) |
| 7 | [/pul-kocurmeleri-ferdi/](https://bmibaku.az/pul-kocurmeleri-ferdi/)<br>EN: [/money-transfers-individual/](https://en.bmibaku.az/money-transfers-individual/) | `/pul-kocurmeleri-ferdi/`<br>`/en/pul-kocurmeleri-ferdi/`<br>`/fa/pul-kocurmeleri-ferdi/` | Migrated: 80 words | Text content | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 8 | [/online-xidmetler/](https://bmibaku.az/online-xidmetler/)<br>EN: [/online-services/](https://en.bmibaku.az/online-services/) | `/online-xidmetler/`<br>`/en/online-xidmetler/`<br>`/fa/online-xidmetler/` | Migrated: 13 words | Link tiles | 8 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 9 | [/bank-tarifleri-ferdi/](https://bmibaku.az/bank-tarifleri-ferdi/)<br>EN: [/bank-tariffs-individual/](https://en.bmibaku.az/bank-tariffs-individual/) | `/bank-tarifleri-ferdi/`<br>`/en/bank-tarifleri-ferdi/`<br>`/fa/bank-tarifleri-ferdi/` | Migrated: 136 words, 1 table(s) | 1 table(s) | 0 | 0 | Official EN (2022-02-28) | Source updated 2022-03-03<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 10 | [/korporativ-bankciliq/](https://bmibaku.az/korporativ-bankciliq/)<br>EN: [/corporate-banking/](https://en.bmibaku.az/corporate-banking/) | `/korporativ-bankciliq/`<br>`/en/korporativ-bankciliq/`<br>`/fa/korporativ-bankciliq/` | Migrated: 99 words | Section overview with service tiles; Link tiles | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390)<br>FA ✓ (1440/390) |
| 11 | [/cari-hesablar-korporativ/](https://bmibaku.az/cari-hesablar-korporativ/)<br>EN: [/current-accounts-corporate/](https://en.bmibaku.az/current-accounts-corporate/) | `/cari-hesablar-korporativ/`<br>`/en/cari-hesablar-korporativ/`<br>`/fa/cari-hesablar-korporativ/` | Migrated: 343 words | Link tiles | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 12 | [/nagdsiz-emeliyyatlar-korporativ/](https://bmibaku.az/nagdsiz-emeliyyatlar-korporativ/)<br>EN: [/non-cash-transactions/](https://en.bmibaku.az/non-cash-transactions/) | `/nagdsiz-emeliyyatlar-korporativ/`<br>`/en/nagdsiz-emeliyyatlar-korporativ/`<br>`/fa/nagdsiz-emeliyyatlar-korporativ/` | Migrated: 75 words, 1 table(s) | 1 table(s); Link tiles | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 13 | [/akkreditivin-verilmesi/](https://bmibaku.az/akkreditivin-verilmesi/)<br>EN: [/issuing-letter-of-credit/](https://en.bmibaku.az/issuing-letter-of-credit/) | `/akkreditivin-verilmesi/`<br>`/en/akkreditivin-verilmesi/`<br>`/fa/akkreditivin-verilmesi/` | Migrated: 4 words, 1 table(s) | 1 table(s); Link tiles | 0 | 0 | Official EN (2022-02-14) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 14 | [/senedler-toplusu/](https://bmibaku.az/senedler-toplusu/)<br>EN: [/documentary-collection/](https://en.bmibaku.az/documentary-collection/) | `/senedler-toplusu/`<br>`/en/senedler-toplusu/`<br>`/fa/senedler-toplusu/` | Migrated: 2 words | Link tiles | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 15 | [/bank-zemanetinin-verilmesi/](https://bmibaku.az/bank-zemanetinin-verilmesi/)<br>EN: [/providing-bank-guarantee/](https://en.bmibaku.az/providing-bank-guarantee/) | `/bank-zemanetinin-verilmesi/`<br>`/en/bank-zemanetinin-verilmesi/`<br>`/fa/bank-zemanetinin-verilmesi/` | Migrated: 7 words, 1 table(s) | 1 table(s); Link tiles | 0 | 0 | Official EN (2022-02-14) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 16 | [/depozitler-korporativ/](https://bmibaku.az/depozitler-korporativ/)<br>EN: [/deposits-corporate/](https://en.bmibaku.az/deposits-corporate/) | `/depozitler-korporativ/`<br>`/en/depozitler-korporativ/`<br>`/fa/depozitler-korporativ/` | Migrated: 59 words, 1 table(s), 1 image(s) | 1 table(s) | 0 | 0 | Official EN (2022-04-21) | Source updated 2022-04-21<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 17 | [/kreditler-korporativ/](https://bmibaku.az/kreditler-korporativ/)<br>EN: [/loans-corporate/](https://en.bmibaku.az/loans-corporate/) | `/kreditler-korporativ/`<br>`/en/kreditler-korporativ/`<br>`/fa/kreditler-korporativ/` | Migrated: 192 words, 1 table(s) | 1 table(s); Link tiles | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22<br>⚠ business-loan-rate | AZ ✓ (1440/390) |
| 18 | [/bank-tarifleri-korporativ/](https://bmibaku.az/bank-tarifleri-korporativ/)<br>EN: [/bank-tariffs-corporate/](https://en.bmibaku.az/bank-tariffs-corporate/) | `/bank-tarifleri-korporativ/`<br>`/en/bank-tarifleri-korporativ/`<br>`/fa/bank-tarifleri-korporativ/` | Migrated: 136 words, 1 table(s) | 1 table(s) | 0 | 0 | Official EN (2022-02-28) | Source updated 2022-02-28<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 19 | [/haqqimizda/](https://bmibaku.az/haqqimizda/)<br>EN: [/about-us/](https://en.bmibaku.az/about-us/) | `/haqqimizda/`<br>`/en/haqqimizda/`<br>`/fa/haqqimizda/` | Migrated: 67 words, 1 table(s) | Grouped institutional index; Requisites with copy buttons; Heritage timeline; 1 table(s) | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390)<br>EN ✓ (1440/390) |
| 20 | [/bank-ve-onun-fealiyyeti/](https://bmibaku.az/bank-ve-onun-fealiyyeti/)<br>EN: [/bank-and-its-activity/](https://en.bmibaku.az/bank-and-its-activity/) | `/bank-ve-onun-fealiyyeti/`<br>`/en/bank-ve-onun-fealiyyeti/`<br>`/fa/bank-ve-onun-fealiyyeti/` | Migrated: 60 words, 1 table(s) | 1 table(s) | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 21 | [/inkisaf-strategiyasi/](https://bmibaku.az/inkisaf-strategiyasi/)<br>EN: [/development-strategy/](https://en.bmibaku.az/development-strategy/) | `/inkisaf-strategiyasi/`<br>`/en/inkisaf-strategiyasi/`<br>`/fa/inkisaf-strategiyasi/` | Migrated: 345 words | Text content | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 22 | [/meqsed-ve-hedefler/](https://bmibaku.az/meqsed-ve-hedefler/)<br>EN: [/mission-and-vision/](https://en.bmibaku.az/mission-and-vision/) | `/meqsed-ve-hedefler/`<br>`/en/meqsed-ve-hedefler/`<br>`/fa/meqsed-ve-hedefler/` | Migrated: 67 words | Text content | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 23 | [/bankin-bisness-felsefesi/](https://bmibaku.az/bankin-bisness-felsefesi/)<br>EN: [/banks-business-philosophy/](https://en.bmibaku.az/banks-business-philosophy/) | `/bankin-bisness-felsefesi/`<br>`/en/bankin-bisness-felsefesi/`<br>`/fa/bankin-bisness-felsefesi/` | Migrated: 136 words | Text content | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 24 | [/bankin-sehmdari/](https://bmibaku.az/bankin-sehmdari/)<br>EN: [/bank-s-shareholder/](https://en.bmibaku.az/bank-s-shareholder/) | `/bankin-sehmdari/`<br>`/en/bankin-sehmdari/`<br>`/fa/bankin-sehmdari/` | Migrated: 104 words, 3 table(s) | 3 table(s) | 0 | 0 | Official EN (2022-01-26) | Source updated 2025-08-07<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 25 | [/idare-heyati-struktur/](https://bmibaku.az/idare-heyati-struktur/)<br>EN: [/board-members-and-structure/](https://en.bmibaku.az/board-members-and-structure/) | `/idare-heyati-struktur/`<br>`/en/idare-heyati-struktur/`<br>`/fa/idare-heyati-struktur/` | Migrated: 68 words, 1 image(s) | Text content | 0 | 0 | Official EN (2022-11-01) | Source updated 2022-11-01<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 26 | [/departamentler/](https://bmibaku.az/departamentler/)<br>EN: [/departments/](https://en.bmibaku.az/departments/) | `/departamentler/`<br>`/en/departamentler/`<br>`/fa/departamentler/` | Migrated: 0 words, 1 table(s) | 1 table(s) | 0 | 0 | Official EN (2025-04-21) | Source updated 2025-05-01<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 27 | [/kapitalin-strukturu-ve-adekvatligi/](https://bmibaku.az/kapitalin-strukturu-ve-adekvatligi/)<br>EN: [/capital-structure-and-adequacy/](https://en.bmibaku.az/capital-structure-and-adequacy/) | `/kapitalin-strukturu-ve-adekvatligi/`<br>`/en/kapitalin-strukturu-ve-adekvatligi/`<br>`/fa/kapitalin-strukturu-ve-adekvatligi/` | Migrated: 216 words | Document archive (search + year filter) | 0 | 35 pdf (2021–2026) | Official EN (2026-04-10) | Source updated 2026-10-09<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 28 | [/daxili-komiteler-ve-kenar-auditor/](https://bmibaku.az/daxili-komiteler-ve-kenar-auditor/)<br>EN: [/internal-and-external-audit/](https://en.bmibaku.az/internal-and-external-audit/) | `/daxili-komiteler-ve-kenar-auditor/`<br>`/en/daxili-komiteler-ve-kenar-auditor/`<br>`/fa/daxili-komiteler-ve-kenar-auditor/` | Migrated: 120 words | Text content | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 29 | [/risklerinin-idaraedilmesi/](https://bmibaku.az/risklerinin-idaraedilmesi/)<br>EN: [/risk-management/](https://en.bmibaku.az/risk-management/) | `/risklerinin-idaraedilmesi/`<br>`/en/risklerinin-idaraedilmesi/`<br>`/fa/risklerinin-idaraedilmesi/` | Migrated: 355 words | Text content | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 30 | [/risk-siyaseti/](https://bmibaku.az/risk-siyaseti/)<br>EN: [/risk-policy/](https://en.bmibaku.az/risk-policy/) | `/risk-siyaseti/`<br>`/en/risk-siyaseti/`<br>`/fa/risk-siyaseti/` | Migrated: 355 words | Text content | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 31 | [/risk-idaraetme-strukturu-ve-selahiyyetleri/](https://bmibaku.az/risk-idaraetme-strukturu-ve-selahiyyetleri/)<br>EN: [/risk-management-structure-and-powers/](https://en.bmibaku.az/risk-management-structure-and-powers/) | `/risk-idaraetme-strukturu-ve-selahiyyetleri/`<br>`/en/risk-idaraetme-strukturu-ve-selahiyyetleri/`<br>`/fa/risk-idaraetme-strukturu-ve-selahiyyetleri/` | Migrated: 191 words | Text content | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 32 | [/kredit-riski-melumatlari/](https://bmibaku.az/kredit-riski-melumatlari/)<br>EN: [/credit-risk-information/](https://en.bmibaku.az/credit-risk-information/) | `/kredit-riski-melumatlari/`<br>`/en/kredit-riski-melumatlari/`<br>`/fa/kredit-riski-melumatlari/` | Migrated: 199 words | Document archive (search + year filter) | 0 | 22 pdf (2023–2026) | Official EN (2022-01-26) | Source updated 2026-10-09<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 33 | [/likvidlik-riski-melumatlari/](https://bmibaku.az/likvidlik-riski-melumatlari/)<br>EN: [/liquidity-risk-information/](https://en.bmibaku.az/liquidity-risk-information/) | `/likvidlik-riski-melumatlari/`<br>`/en/likvidlik-riski-melumatlari/`<br>`/fa/likvidlik-riski-melumatlari/` | Migrated: 75 words | Document archive (search + year filter) | 0 | 15 pdf (2023–2026) | Official EN (2022-01-26) | Source updated 2026-10-09<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 34 | [/bazar-risklerinin-olculmesi/](https://bmibaku.az/bazar-risklerinin-olculmesi/)<br>EN: [/market-risks-measurement/](https://en.bmibaku.az/market-risks-measurement/) | `/bazar-risklerinin-olculmesi/`<br>`/en/bazar-risklerinin-olculmesi/`<br>`/fa/bazar-risklerinin-olculmesi/` | Migrated: 328 words, 1 table(s) | Document archive (search + year filter); 1 table(s) | 0 | 15 pdf (2023–2026) | Official EN (2022-01-26) | Source updated 2026-10-09<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 35 | [/valyuta-movqeyi/](https://bmibaku.az/valyuta-movqeyi/)<br>EN: [/currency-position/](https://en.bmibaku.az/currency-position/) | `/valyuta-movqeyi/`<br>`/en/valyuta-movqeyi/`<br>`/fa/valyuta-movqeyi/` | Migrated: 75 words | Document archive (search + year filter) | 0 | 15 pdf (2023–2026) | Official EN (2022-01-26) | Source updated 2026-10-09<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 36 | [/stress-testlesdirme-ve-ssenariler/](https://bmibaku.az/stress-testlesdirme-ve-ssenariler/)<br>EN: [/stress-testing-and-scenarios/](https://en.bmibaku.az/stress-testing-and-scenarios/) | `/stress-testlesdirme-ve-ssenariler/`<br>`/en/stress-testlesdirme-ve-ssenariler/`<br>`/fa/stress-testlesdirme-ve-ssenariler/` | Migrated: 199 words | Text content | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 37 | [/prudensial-normativler/](https://bmibaku.az/prudensial-normativler/)<br>EN: [/prudential-norms/](https://en.bmibaku.az/prudential-norms/) | `/prudensial-normativler/`<br>`/en/prudensial-normativler/`<br>`/fa/prudensial-normativler/` | Migrated: 95 words | Document archive (search + year filter) | 0 | 19 pdf (2022–2026) | Official EN (2026-04-10) | Source updated 2026-10-09<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 38 | [/kredit-bolgusu/](https://bmibaku.az/kredit-bolgusu/)<br>EN: [/loan-division/](https://en.bmibaku.az/loan-division/) | `/kredit-bolgusu/`<br>`/en/kredit-bolgusu/`<br>`/fa/kredit-bolgusu/` | Migrated: 120 words | Document archive (search + year filter) | 0 | 15 pdf (2023–2026) | Official EN (2022-01-26) | Source updated 2026-10-09<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 39 | [/maliyye-veziyyeti-gostericileri/](https://bmibaku.az/maliyye-veziyyeti-gostericileri/)<br>EN: [/financial-reports/](https://en.bmibaku.az/financial-reports/) | `/maliyye-veziyyeti-gostericileri/`<br>`/en/maliyye-veziyyeti-gostericileri/`<br>`/fa/maliyye-veziyyeti-gostericileri/` | Migrated: 96 words | Link tiles | 0 | 0 | Official EN (2022-02-15) | Source updated 2025-01-14<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 40 | [/balans/](https://bmibaku.az/balans/)<br>EN: [/balance/](https://en.bmibaku.az/balance/) | `/balans/`<br>`/en/balans/`<br>`/fa/balans/` | Migrated: 75 words | Document archive (search + year filter) | 0 | 15 pdf (2023–2026) | Official EN (2026-04-10) | Source updated 2026-10-09<br>Crawled 2026-11-22<br>⚠ en-content-age | AZ ✓ (1440/390)<br>FA ✓ (1440/390) |
| 41 | [/menfeet-zerer/](https://bmibaku.az/menfeet-zerer/)<br>EN: [/profit-loss/](https://en.bmibaku.az/profit-loss/) | `/menfeet-zerer/`<br>`/en/menfeet-zerer/`<br>`/fa/menfeet-zerer/` | Migrated: 105 words | Document archive (search + year filter) | 0 | 15 pdf (2023–2026) | Official EN (2026-04-10) | Source updated 2026-10-09<br>Crawled 2026-11-22<br>⚠ en-content-age | AZ ✓ (1440/390) |
| 42 | [/kapitalda-deyisiklikler-haqqinda-hesabat/](https://bmibaku.az/kapitalda-deyisiklikler-haqqinda-hesabat/)<br>EN: [/statement-of-changes-in-equity/](https://en.bmibaku.az/statement-of-changes-in-equity/) | `/kapitalda-deyisiklikler-haqqinda-hesabat/`<br>`/en/kapitalda-deyisiklikler-haqqinda-hesabat/`<br>`/fa/kapitalda-deyisiklikler-haqqinda-hesabat/` | Migrated: 105 words | Document archive (search + year filter) | 0 | 15 pdf (2022–2026) | Official EN (2026-04-10) | Source updated 2026-10-09<br>Crawled 2026-11-22<br>⚠ en-content-age | AZ ✓ (1440/390) |
| 43 | [/pul-vesaitlerinin-hereketi/](https://bmibaku.az/pul-vesaitlerinin-hereketi/)<br>EN: [/cash-flow/](https://en.bmibaku.az/cash-flow/) | `/pul-vesaitlerinin-hereketi/`<br>`/en/pul-vesaitlerinin-hereketi/`<br>`/fa/pul-vesaitlerinin-hereketi/` | Migrated: 105 words | Document archive (search + year filter) | 0 | 15 pdf (2023–2026) | Official EN (2026-04-10) | Source updated 2026-10-09<br>Crawled 2026-11-22<br>⚠ en-content-age | AZ ✓ (1440/390) |
| 44 | [/maliyye-hesabatlari/](https://bmibaku.az/maliyye-hesabatlari/)<br>EN: [/financial-statements/](https://en.bmibaku.az/financial-statements/) | `/maliyye-hesabatlari/`<br>`/en/maliyye-hesabatlari/`<br>`/fa/maliyye-hesabatlari/` | Migrated: 86 words | Document archive (search + year filter) | 0 | 14 pdf (2012–2025) | Official EN (2026-03-12) | Source updated 2026-03-12<br>Crawled 2026-11-22 | AZ ✓ (1440/390)<br>EN ✓ (1440/390) |
| 45 | [/emlak-satisi/](https://bmibaku.az/emlak-satisi/)<br>EN: [/sales-of-property/](https://en.bmibaku.az/sales-of-property/) | `/emlak-satisi/`<br>`/en/emlak-satisi/`<br>`/fa/emlak-satisi/` | Migrated: 7 words | Listings split by gallery; Empty state when source has none; Inquiry CTA; Link tiles | 0 | 0 | Official EN (2022-01-26) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 46 | [/yasayis-evleri-menziller/](https://bmibaku.az/yasayis-evleri-menziller/)<br>EN: [/residential-homes-flats/](https://en.bmibaku.az/residential-homes-flats/) | `/yasayis-evleri-menziller/`<br>`/en/yasayis-evleri-menziller/`<br>`/fa/yasayis-evleri-menziller/` | No visible content (2 block(s) hidden on all devices in source; not published) | Listings split by gallery; Empty state when source has none; Inquiry CTA | 0 | 0 | no-content-in-source → AZ fallback | Source updated 2024-02-19<br>Crawled 2026-11-22<br>⚠ residential-listing-hidden | AZ ✓ (1440/390) |
| 47 | [/qeyri-yasayis-obyektleri/](https://bmibaku.az/qeyri-yasayis-obyektleri/)<br>EN: [/non-residential-facilities/](https://en.bmibaku.az/non-residential-facilities/) | `/qeyri-yasayis-obyektleri/`<br>`/en/qeyri-yasayis-obyektleri/`<br>`/fa/qeyri-yasayis-obyektleri/` | Migrated: 58 words, 22 image(s) | Listings split by gallery; Empty state when source has none; Inquiry CTA; Gallery | 0 | 0 | Official EN (2023-06-22) | Source updated 2026-04-23<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 48 | [/avtomobiller/](https://bmibaku.az/avtomobiller/)<br>EN: [/cars/](https://en.bmibaku.az/cars/) | `/avtomobiller/`<br>`/en/avtomobiller/`<br>`/fa/avtomobiller/` | No content in source | Listings split by gallery; Empty state when source has none; Inquiry CTA | 0 | 0 | no-content-in-source → AZ fallback | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 49 | [/elanlar/](https://bmibaku.az/elanlar/)<br>EN: [/advertisements/](https://en.bmibaku.az/advertisements/) | `/elanlar/`<br>`/en/elanlar/`<br>`/fa/elanlar/` | No content in source | Text content | 0 | 0 | Official EN (2022-02-15) | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 50 | [/vakansiyalar/](https://bmibaku.az/vakansiyalar/)<br>EN: [/vacancies/](https://en.bmibaku.az/vacancies/) | `/vakansiyalar/`<br>`/en/vakansiyalar/`<br>`/fa/vakansiyalar/` | Migrated: 101 words | Text content | 0 | 0 | no-content-in-source → AZ fallback | Source updated 2024-10-29<br>Crawled 2026-11-22 | AZ ✓ (1440/390) |
| 51 | [/foto-qalereya/](https://bmibaku.az/foto-qalereya/) | `/foto-qalereya/`<br>`/en/foto-qalereya/`<br>`/fa/foto-qalereya/` | Migrated: 0 words, 9 image(s) | Masonry gallery; Lightbox (keyboard: ←/→/Esc, RTL-aware); Gallery | 0 | 0 | No EN page → AZ fallback | Source updated 2022-01-26<br>Crawled 2026-11-22 | AZ ✓ (1440/390)<br>EN ✓ (1440/390) |
| 52 | [/contact/](https://bmibaku.az/contact/)<br>EN: [/contact/](https://en.bmibaku.az/contact/) | `/contact/`<br>`/en/contact/`<br>`/fa/contact/` | Migrated: 148 words, 1 table(s), 1 form(s) | General / complaint form (POST /api/contact); Map; SWIFT & requisites; Consumer-rights links; Document list; 1 table(s); Embedded map | 0 | 1 pdf (2020) | Official EN (2024-08-21) | Source updated 2024-08-21<br>Crawled 2026-11-22 | AZ ✓ (1440/390)<br>EN ✓ (1440/390)<br>FA ✓ (1440/390) |
| 53 | [/kredit-kalkulatoru/](https://bmibaku.az/kredit-kalkulatoru/)<br>EN: [/credit-calculator/](https://en.bmibaku.az/credit-calculator/) | `/kredit-kalkulatoru/`<br>`/en/kredit-kalkulatoru/`<br>`/fa/kredit-kalkulatoru/` | Migrated: 23 words | Loan calculator (annuity, 8 products); Official terms accordion; Link to legacy calculator; Accordion | 0 | 0 | Official EN (2024-07-16) | Source updated 2024-08-27<br>Crawled 2026-11-22<br>⚠ cash-loan-rate<br>⚠ business-loan-rate | AZ ✓ (1440/390)<br>EN ✓ (1440/390)<br>FA ✓ (1440/390) |
| 54 | [/online-kredit-sifarisi/](https://bmibaku.az/online-kredit-sifarisi/)<br>EN: [/loan-application/](https://en.bmibaku.az/loan-application/) | `/online-kredit-sifarisi/`<br>`/en/online-kredit-sifarisi/`<br>`/fa/online-kredit-sifarisi/` | Migrated: 29 words, 1 image(s), 1 form(s) | Multi-step credit application (POST /api/credit-application); Consent checkboxes; Accordion | 0 | 0 | Official EN (2024-08-21) | Source updated 2024-08-21<br>Crawled 2026-11-22 | AZ ✓ (1440/390)<br>FA ✓ (1440/390) |
| 55 | [/valyuta-tarixcesi/](https://bmibaku.az/valyuta-tarixcesi/)<br>EN: [/currency-history/](https://en.bmibaku.az/currency-history/) | `/valyuta-tarixcesi/`<br>`/en/valyuta-tarixcesi/`<br>`/fa/valyuta-tarixcesi/` | Migrated: 0 words, 1 form(s) | Latest official rates; Converter; History filter + pagination (GET /api/rates/history); Line chart for single currency | 0 | 0 | Official EN (2024-07-16) | Source updated 2026-10-21<br>Crawled 2026-11-22 | AZ ✓ (1440/390)<br>EN ✓ (1440/390) |

## Excluded source pages and redirects

| Source page | Status in source | Handling |
|---|---|---|
| [/test/](https://bmibaku.az/test/) | empty-in-source | Empty test page in the source CMS. |
| [/portmanat/](https://bmibaku.az/portmanat/) | empty-in-source | Empty page in the source CMS. |
| [/maliyye-veziyyeti-haqqinda-hesabat-13-04-2018/](https://bmibaku.az/maliyye-veziyyeti-haqqinda-hesabat-13-04-2018/) | empty-in-source | Empty page; redirected to /maliyye-hesabatlari/. |
| [/index/](https://bmibaku.az/) | migrated | Source homepage; replaced by / (redirected). |
| [/photo-gallery/](https://en.bmibaku.az/photo-gallery/) (EN only) | no-az-counterpart | Same 9 photos as the AZ gallery. Redirects to `/en/foto-qalereya/`. |
| [/exchange-rate-api/](https://en.bmibaku.az/exchange-rate-api/) (EN only) | no-az-counterpart | Empty page. Redirects to `/en/valyuta-tarixcesi/`. |
| [/valyuta-mezenne-api/](https://en.bmibaku.az/valyuta-mezenne-api/) (EN only) | no-az-counterpart | Header-less rates widget made for iframe embedding. Redirects to `/en/valyuta-tarixcesi/`. ⚠ If partner sites embed it, the bank must decide on a replacement widget (this site sends X-Frame-Options: DENY). |

Old English URLs (`en.bmibaku.az/<slug>/`) redirect permanently to `/en/<az-slug>/` when that host points to this app (see `next.config.mjs`).

## Discrepancies found in the source

None was resolved silently. Each needs a decision by the bank.

### Nağd pul krediti — illik faiz (`cash-loan-rate`)

- https://bmibaku.az/ (ana səhifə slayderi): **8%-dən başlayaraq**
- https://bmibaku.az/kreditler-ferdi/: **illik 12%-dən başlayaraq**
- https://bmibaku.az/kredit-kalkulatoru/: **illik 12% başlayaraq**
- Current handling: Ana səhifə aksiyası hero-da, məhsul şərtləri kalkulyatorda göstərilir; kalkulyatorda fərq barədə qeyd var.

### Biznes krediti — illik faiz (`business-loan-rate`)

- ana səhifə, /kreditler-ferdi/, /kredit-kalkulatoru/: **10%-dən başlayaraq**
- https://bmibaku.az/kreditler-korporativ/ (hüquqi şəxslər): **16%**
- Current handling: Hər səhifə öz dərc olunmuş dəyərini göstərir.

### "94 illik tarix" (`heritage-years`)

- https://bmibaku.az/ (sayğac): **94 il**
- Current handling: Mənbədəki kimi saxlanılıb; 1928-ci il qəbul edilərsə 2026-da 98 il olur. Təsdiq lazımdır.

### Yaşayış evləri / mənzillər (`residential-listing-hidden`)

- https://bmibaku.az/yasayis-evleri-menziller/: **Elan bütün cihazlarda gizlədilib (Elementor)**
- Current handling: Dərc edilməyib; manifestdə "hiddenInSource" kimi qeyd olunub.

### İngilis versiyası (`en-content-age`)

- https://en.bmibaku.az/: **Bəzi maliyyə səhifələri AZ versiyasından köhnədir (məs. 2026-04-10 vs 2026-10-09)**
- Current handling: EN səhifədə öz yenilənmə tarixi göstərilir.

## Functional checks

| Check | Result | Detail |
|---|---|---|
| credit-application: valid payload without endpoint → 503 not_configured | ✓ pass | HTTP 503 |
| credit-application: invalid payload → 422 with field list | ✓ pass | HTTP 422 ["fin","consentAsan"] |
| credit-application: foreign Origin → 403 | ✓ pass | HTTP 403 |
| credit-application: honeypot filled → 400 | ✓ pass | HTTP 400 |
| credit-application: body over 16 KB → 413 | ✓ pass | HTTP 413 |
| credit-application: 6th request in 10 min from one IP → 429 | ✓ pass | 503,503,503,503,503,429 |
| contact: valid payload without endpoint → 503 not_configured | ✓ pass | HTTP 503 |
| contact: invalid payload → 422 | ✓ pass | HTTP 422 |
| rates history: USD page 1 → points from official archive | ✓ pass | HTTP 200, 20 points |
| rates history: reversed range → 400 | ✓ pass | HTTP 400 |
| rates history: unknown currency → 400 | ✓ pass | HTTP 400 |
| gallery: click opens lightbox, → moves to next photo, Esc closes | ✓ pass | 1 / 9 → 2 / 9, closed=true |
| calculator: moving the amount slider changes the result | ✓ pass | Ödəniş xülasəsi Aylıq ödəniş 470.73 470.73 AZN Əsas borc və  → Ödəniş xülasəsi Aylıq ödəniş 800.24 800.25 AZN Əsas borc və  |
| converter: typing an amount updates the result | ✓ pass | 588.24 → 147.06 |
| no JavaScript: hero headline renders, hidden reveal blocks appear after 5 s | ✓ pass | h1=true, hidden 27 → 0 |

## External links by route

**/online-xidmetler/**

- <https://hesab.az/unregistered/#/direct-pay/mobile/merchants?lang=az&sourceName=unreg>
- <https://hesab.az/unregistered/#/direct-pay/utilities/merchants?lang=az&sourceName=unreg>
- <https://hesab.az/unregistered/#/direct-pay/telephone/merchants?lang=az&sourceName=unreg>
- <https://hesab.az/unregistered/#/direct-pay/internet/merchants>
- <https://hesab.az/unregistered/#/direct-pay/tv/merchants>
- <https://hesab.az/unregistered/#/insurance/categories>
- <https://hesab.az/unregistered/#/direct-pay/store/merchants>
- <https://hesab.az/unregistered/#/direct-pay/charity/merchants>

## Open items (not done or not verified)

1. **Credit application endpoint.** The form collects FİN, salary and phone. `CREDIT_APPLICATION_ENDPOINT` stays unset until legal, data-protection and security teams approve the receiving system. Until then the API answers `503 not_configured` and the form says so.
2. **Contact / complaint endpoint.** Same: `CONTACT_ENDPOINT` must point to the bank’s ticketing system.
3. **Discrepancies** above need an official answer (loan rates, “94 years”, hidden property listing, outdated EN financial pages).
4. **Translations.** EN interface text and all FA text are marked “under review” on the site. FA page content is Azerbaijani until official Persian text exists.
5. **Assets.** Images and documents load from bmibaku.az `/wp-content/uploads/`. Mirror them before the old WordPress site is switched off.
6. **Rates source.** Current and historical rates are read from the old WordPress plugin (`admin-ajax.php?action=mv_cr_read`). It must stay online, or be replaced, when WordPress is retired. One transient 502 was seen during QA; requests now retry once.
7. **Dependency advisory.** `npm audit` reports PostCSS advisories in the copy bundled inside Next.js 15 (build-time only; it processes this project’s own CSS). The fix ships with Next.js 16, a major upgrade to plan separately.
8. **Not covered by automated QA:** screen-reader walkthrough, real iOS/Android devices, form submission to a live endpoint, every EN/FA route in a browser (a sample is loaded; all are built and link-checked). Lighthouse was run on 4 pages only (desktop 99–100 / 100 / 100 / 100; mobile performance 86–92, other categories 100).
