// Общие данные сайта. Тексты правятся здесь, а не в разметке.

/** Telegram студии без @. Заказчик ещё не прислал username — пока пусто, кнопки ведут на #contact. */
export const telegram = '';

export const instagram = [
  { handle: '@brandknight.design', url: 'https://instagram.com/brandknight.design' },
];

export const email = 'Brand.knight@yandex.ru';
export const metrikaId = 62752975;

export const tgUrl = (text?: string) =>
  telegram ? `https://t.me/${telegram}${text ? `?text=${encodeURIComponent(text)}` : ''}` : '#contact';

export const nav = [
  { href: '#top', label: 'Главная' },
  { href: '#afishi', label: 'Афиши' },
  { href: '#sites', label: 'Сайты' },
  { href: '#services', label: 'Услуги' },
  { href: '#contact', label: 'Контакты' },
];

// Первый экран (решение заказчика 28.10: композиция NextWave, рыцарь вместо 3D).
// Все строки — со старого сайта: заголовок «Цифровой маркетинг, который помогает бизнесу развиваться»,
// слоган WE CREATE DIGITAL _SOLUTION — бегущей печатью в пилюле над заголовком.
export const hero = {
  slogan: 'We create digital',
  typed: 'solution',
  title: ['Цифровой маркетинг,', 'который помогает', 'бизнесу'],
  accent: 'развиваться',
  lead: 'Для вашего бизнеса и ваших событий: анимированные афиши, видео-креативы и сайты.',
  cta: 'Написать в Telegram',
  secondary: 'Смотреть работы',
  navCta: 'Написать нам',
  work: { title: 'Анимация афиш', name: 'MEG · 14 июня' },
  ariaLabel: 'BrandKnight — анимация афиш, видео-креативы и создание сайтов',
};

export const hello = {
  marquee: ['ПРИВЕТ', 'HALLO', 'BUENOS DÍAS', 'GUTEN TAG', 'OLÁ', 'MERHABA', '你好', 'HYVÄÄ PÄIVÄÄ', 'SZERVUSZ', 'ΓΕΙΆ ΣΑΣ', 'BONJOUR'],
  lead: 'Мы внимательны, дружелюбны и просты. Работаем со стартапами, бизнесом и ивент-индустрией.',
};

// 4.3: h2 «Анимация афиш» — первое слово над рамкой, второе приезжает снизу
export const scene = {
  top: 'Анимация',
  bottom: 'афиш',
  before: { label: 'Было', text: 'статичная афиша' },
  after: { label: 'Стало', text: 'афиша в движении' },
  caption: 'Анимированная афиша останавливает палец в ленте. Оживим ваш макет или сделаем афишу с нуля.',
  cta: 'Заказать анимацию',
};
