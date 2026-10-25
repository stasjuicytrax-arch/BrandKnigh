// 17 кейсов сайтов из content/cases.md: сначала новые, затем старые.
// Скриншоты новых: public/assets/cases/<slug>-{desktop,mobile,full}.webp (scripts/shoot-cases.mjs).
// ⚠ bimtara.ru: на скриншоте со старого сайта открыт сайт DIGITAL EVENTS — пара под вопросом, спросить заказчика.
export type Case = {
  slug: string;
  name: string;
  url: string;
  about?: string;
  tag?: string;
  shots: { desktop: string; mobile?: string; full?: string };
  featured?: boolean;
};

const shot = (slug: string) => ({
  desktop: `assets/cases/${slug}-desktop.webp`,
  mobile: `assets/cases/${slug}-mobile.webp`,
  full: `assets/cases/${slug}-full.webp`,
});
const old = (file: string) => ({ desktop: `assets/old-site/sites/${file}` });

export const cases: Case[] = [
  { slug: 'djnagoo', name: 'DJ NAGOO', url: 'https://djnagoo.site', tag: 'Пресс-кит артиста', featured: true,
    about: 'Диджей и продюсер с 2005 года, резиденции в России и Бахрейне, «Лучший DJ Санкт-Петербурга 2018».', shots: shot('djnagoo') },
  { slug: 'oppaacha', name: 'OPPAACHA', url: 'https://oppaacha.site/', tag: 'Пресс-кит артиста',
    about: 'Продюсер и DJ: релизы, лайвы, букинг, райдер.', shots: shot('oppaacha') },
  { slug: 'djlolly', name: 'LOLLY', url: 'https://djlolly.site/', tag: 'Пресс-кит артиста',
    about: 'DJ и продюсер из Янгона, сеты в Мьянме и Таиланде: шоурил, туры, загрузки для промоутеров.', shots: shot('djlolly') },
  { slug: '39kingdom', name: '39 KINGDOM', url: 'https://stasjuicytrax-arch.github.io/39Kingdom/', tag: 'Пресс-кит артиста',
    about: 'Гибридный электронный дуэт: вокал, гитара, барабаны.', shots: shot('39kingdom') },
  { slug: 'partytime', name: 'Время веселиться', url: 'https://stasjuicytrax-arch.github.io/Partytime/', tag: 'Сайт ивент-площадки', featured: true,
    about: 'Сеть караоке-лофтов в Санкт-Петербурге: 56 залов, 4 локации, бронь в 6 шагов.', shots: shot('partytime') },
  { slug: 'digital-events', name: 'DIGITAL EVENTS', url: 'https://stasjuicytrax-arch.github.io/DIGITAL-EVENTS/', tag: 'Сайт агентства', featured: true,
    about: 'Креативное агентство из Перми: цифровые аттракционы, AR, 3D-mapping для событий.', shots: shot('digital-events') },
  { slug: 'stastoropov', name: 'Стас Торопов', url: 'https://stastoropov-site.vercel.app/', tag: 'Сайт ведущего',
    about: 'Ведущий мероприятий в Перми: свадьбы, корпоративы, юбилеи.', shots: shot('stastoropov') },
  { slug: 'help-wedding', name: 'В титрах', url: 'https://help-wedding.ru/', shots: old('6464-6139-2026-06-26_18-52-34.png') },
  { slug: 'school-xyz', name: 'School XYZ', url: 'https://www.school-xyz.com', shots: old('3331-3936-2022-10-31_14-50-21.png') },
  { slug: 'welldone', name: 'Welldone', url: 'https://welldone.green/', shots: old('6330-6131-2022-10-31_15-17-42.png') },
  { slug: 'dinamo', name: 'Динамо', url: 'https://dinamo-school.ru/', shots: old('3232-3330-2022-11-03_17-31-54.png') },
  { slug: 'bimtara', name: 'Bimtara', url: 'https://bimtara.ru/', shots: old('6137-6261-2023-10-01_23-32-29.png') },
  { slug: 'synergy', name: 'Synergy', url: 'https://lp.synergy.ru/unmanned-technology', shots: old('6430-3032-2022-12-02_14-52-00.png') },
  { slug: 'wap', name: 'WAP Agency', url: 'https://wapagency.ru/', shots: old('6630-6330-2025-10-01_16-44-57.png') },
  { slug: 'citiwell', name: 'Citiwell', url: 'https://citiwell.ru/', shots: old('6131-6532-2023-09-29_18-33-15.png') },
  { slug: 'brkwood', name: 'BRK Wood', url: 'https://msk.brkwood.ru/', shots: old('6361-3866-2023-12-12_13-49-09.png') },
  { slug: 'nichegolishnego', name: 'Ничего лишнего', url: 'https://nichegolishnego.shop/', shots: old('3239-3639-2024-03-03_23-43-50.png') },
];
