/**
 * Inconsistencies found in the source site on 2026-11-22. None is resolved
 * silently: each needs official bank approval. Listed in the migration report.
 */
export const DISCREPANCIES = [
  {
    id: 'cash-loan-rate',
    topic: 'Nağd pul krediti — illik faiz',
    values: [
      { where: 'https://bmibaku.az/ (ana səhifə slayderi)', value: '8%-dən başlayaraq' },
      { where: 'https://bmibaku.az/kreditler-ferdi/', value: 'illik 12%-dən başlayaraq' },
      { where: 'https://bmibaku.az/kredit-kalkulatoru/', value: 'illik 12% başlayaraq' },
    ],
    handling: 'Ana səhifə aksiyası hero-da, məhsul şərtləri kalkulyatorda göstərilir; kalkulyatorda fərq barədə qeyd var.',
  },
  {
    id: 'business-loan-rate',
    topic: 'Biznes krediti — illik faiz',
    values: [
      { where: 'ana səhifə, /kreditler-ferdi/, /kredit-kalkulatoru/', value: '10%-dən başlayaraq' },
      { where: 'https://bmibaku.az/kreditler-korporativ/ (hüquqi şəxslər)', value: '16%' },
    ],
    handling: 'Hər səhifə öz dərc olunmuş dəyərini göstərir.',
  },
  {
    id: 'heritage-years',
    topic: '"94 illik tarix"',
    values: [{ where: 'https://bmibaku.az/ (sayğac)', value: '94 il' }],
    handling: 'Mənbədəki kimi saxlanılıb; 1928-ci il qəbul edilərsə 2026-da 98 il olur. Təsdiq lazımdır.',
  },
  {
    id: 'residential-listing-hidden',
    topic: 'Yaşayış evləri / mənzillər',
    values: [{ where: 'https://bmibaku.az/yasayis-evleri-menziller/', value: 'Elan bütün cihazlarda gizlədilib (Elementor)' }],
    handling: 'Dərc edilməyib; manifestdə "hiddenInSource" kimi qeyd olunub.',
  },
  {
    id: 'en-content-age',
    topic: 'İngilis versiyası',
    values: [{ where: 'https://en.bmibaku.az/', value: 'Bəzi maliyyə səhifələri AZ versiyasından köhnədir (məs. 2026-04-10 vs 2026-10-09)' }],
    handling: 'EN səhifədə öz yenilənmə tarixi göstərilir.',
  },
] as const;
