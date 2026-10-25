// Общие данные сайта. Тексты правятся здесь, а не в разметке.

/** Telegram студии без @. Заказчик ещё не прислал username — пока пусто, кнопки ведут на #contact. */
export const telegram = '';

export const instagram = [
  { handle: '@brandknight.design', url: 'https://instagram.com/brandknight.design' },
  { handle: '@stastoropov', url: 'https://www.instagram.com/stastoropov/' },
];

export const email = 'Brand.knight@yandex.ru';
export const metrikaId = 62752975;

export const tgUrl = (text?: string) =>
  telegram ? `https://t.me/${telegram}${text ? `?text=${encodeURIComponent(text)}` : ''}` : '#contact';

export const nav = [
  { href: '#afishi', label: 'Афиши' },
  { href: '#sites', label: 'Сайты' },
  { href: '#services', label: 'Услуги' },
  { href: '#clients', label: 'Клиенты' },
  { href: '#contact', label: 'Контакты' },
];

// Слоган старого сайта дословно (TZ.md §4.1): три строки, окно-афиша после DIGITAL, «_» — мигающий курсор.
export const hero = {
  slogan: { first: 'We create', second: 'Digital', typed: 'Solution' },
  ariaLabel: 'BrandKnight — анимация афиш, видео-креативы и создание сайтов',
  leadLeft: 'для вашего бизнеса и ваших событий:',
  leadRight: 'анимированные афиши, видео-креативы и сайты',
  note: 'Цифровой маркетинг, который помогает бизнесу развиваться',
  cta: 'Написать в Telegram',
  secondary: 'Смотреть работы',
};

export const hello = {
  marquee: ['ПРИВЕТ', 'HALLO', 'BUENOS DÍAS', 'GUTEN TAG', 'OLÁ', 'MERHABA', '你好', 'HYVÄÄ PÄIVÄÄ', 'SZERVUSZ', 'ΓΕΙΆ ΣΑΣ', 'BONJOUR'],
  lead: 'Мы внимательны, дружелюбны и просты. Работаем со стартапами, бизнесом и ивент-индустрией.',
};

// 4.3: h2 «Анимация афиш» — первое слово над рамкой, второе приезжает снизу
export const scene = {
  top: 'Анимация',
  bottom: 'афиш',
  caption: 'Анимированная афиша останавливает палец в ленте. Оживим ваш макет или сделаем афишу с нуля.',
};
