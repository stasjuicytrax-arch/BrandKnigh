// Прокликивает всё интерактивное на главной и пишет, что работает, а что нет.
// Снимки открытых окон кладёт в .cache/check/ для проверки глазами.
// Запуск: node scripts/check-features.mjs [url]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:5175/BrandKnigh/';
const SHOTS = '.cache/check';
mkdirSync(SHOTS, { recursive: true });
const b = await chromium.launch();
const results = [];
const check = async (name, fn) => {
  try {
    const r = await fn();
    results.push([r === false ? 'НЕТ' : 'ок', name, typeof r === 'string' ? r : '']);
  } catch (e) {
    results.push(['НЕТ', name, e.message.split('\n')[0].slice(0, 140)]);
  }
};
const errors = [];
const bad = [];

// ---------- десктоп ----------
let p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('pageerror', (e) => errors.push(e.message));
p.on('console', (m) => m.type() === 'error' && !/CERT|mc\.yandex/.test(m.text()) && errors.push(m.text().slice(0, 160)));
p.on('response', (r) => r.status() >= 400 && !/mc\.yandex/.test(r.url()) && bad.push(`${r.status()} ${r.url()}`));
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const inView = (sel) =>
  p.evaluate((s) => {
    const r = document.querySelector(s).getBoundingClientRect();
    return r.top < innerHeight * 0.6 && r.bottom > 0;
  }, sel);
const closeLb = async () => {
  await p.keyboard.press('Escape');
  await p.waitForTimeout(300);
  if (await p.$('.lightbox')) await p.mouse.click(5, 450);
  await p.waitForTimeout(200);
};

for (const [label, id] of [['Афиши', '#afishi'], ['Сайты', '#sites'], ['Услуги', '#services'], ['Контакты', '#contact'], ['Главная', '#top']]) {
  await check(`Меню «${label}» ведёт к ${id}`, async () => {
    await p.mouse.wheel(0, -200);
    await p.waitForTimeout(700);
    await p.click(`.nav__links a:has-text("${label}")`);
    await p.waitForTimeout(1600);
    return inView(id);
  });
}
await check('«Смотреть работы» ведёт к видео', async () => {
  await p.click('.play-link');
  await p.waitForTimeout(1600);
  return inView('#video');
});
await p.evaluate(() => scrollTo(0, 0));
await p.waitForTimeout(800);
await check('Видео в карточке первого экрана играет', () =>
  p.evaluate(() => {
    const v = document.querySelector('.hero__card--work video');
    return v.readyState >= 2 && !v.paused;
  }),
);
await check('Карточка MEG открывает ролик со звуком, Esc закрывает', async () => {
  await p.click('.hero__card--work');
  await p.waitForSelector('.lightbox video');
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${SHOTS}/lightbox.png` });
  const ok = await p.evaluate(() => {
    const v = document.querySelector('.lightbox video');
    const btn = document.querySelector('.lightbox__close').getBoundingClientRect();
    // в окне должен быть виден обычный курсор: свой спрятан, системный не «none»
    const own = document.querySelector('.cursor');
    const ownHidden = !own || getComputedStyle(own).display === 'none';
    const native = getComputedStyle(document.querySelector('.lightbox')).cursor !== 'none';
    return v.src.endsWith('full.mp4') && !v.muted && btn.width < 80 && btn.height < 80 && ownHidden && native;
  });
  await closeLb();
  return ok && (await p.$('.lightbox')) === null;
});
await check('«Зажми» оживляет статичную афишу', async () => {
  await p.locator('#afishi').scrollIntoViewIfNeeded();
  await p.waitForTimeout(1200);
  const f = await p.$('.poster:not(.poster--live)');
  const bb = await f.boundingBox();
  await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
  await p.mouse.down();
  await p.waitForTimeout(900);
  const on = await p.evaluate(() => document.querySelector('.poster:not(.poster--live) video').classList.contains('is-on'));
  await p.mouse.up();
  return on;
});
await check('Бенто: большая плитка открывает ролик', async () => {
  await p.locator('.t-big').scrollIntoViewIfNeeded();
  await p.click('.t-big');
  await p.waitForSelector('.lightbox video');
  await closeLb();
  return true;
});
await check('Лента: стрелка «вперёд» листает', async () => {
  await p.locator('.rail').scrollIntoViewIfNeeded();
  await p.waitForTimeout(600);
  const before = await p.evaluate(() => document.querySelector('.rail__track').scrollLeft);
  await p.click('[aria-label="Следующий ролик"]');
  await p.waitForTimeout(1200);
  const after = await p.evaluate(() => document.querySelector('.rail__track').scrollLeft);
  return after > before ? `сдвиг ${Math.round(after - before)}px` : false;
});
await check('Лента не дёргает страницу', async () => {
  const y = await p.evaluate(() => scrollY);
  await p.waitForTimeout(4000);
  return Math.abs((await p.evaluate(() => scrollY)) - y) < 2;
});
await check('Лента: ролик открывается, стрелки в окне листают', async () => {
  await p.click('.rail__card.is-active');
  await p.waitForSelector('.lightbox video');
  const a = await p.getAttribute('.lightbox video', 'src');
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(300);
  const c = await p.getAttribute('.lightbox video', 'src');
  await p.screenshot({ path: `${SHOTS}/lightbox-rail.png` });
  await closeLb();
  return a !== c;
});
await check('Афиша из наклонной сетки открывается крупно', async () => {
  await p.locator('#posters').scrollIntoViewIfNeeded();
  await p.waitForTimeout(500);
  await p.locator('.posters__item').nth(7).click({ force: true });
  await p.waitForSelector('.lightbox__poster');
  await p.screenshot({ path: `${SHOTS}/poster.png` });
  await closeLb();
  return true;
});
await check('Сайты: на компьютере все кейсы видны сразу, одного размера', async () => {
  await p.locator('#sites').scrollIntoViewIfNeeded();
  const r = await p.$$eval('.case', (a) => a.map((x) => [x.offsetWidth, getComputedStyle(x).display]));
  const visible = r.filter(([, d]) => d !== 'none');
  const sizes = new Set(visible.map(([w]) => w));
  return visible.length === r.length && sizes.size === 1 ? `${visible.length} карточек по ${[...sizes][0]}px` : false;
});
await check('Карточки сайтов ведут на живые адреса', async () => {
  const hrefs = await p.$$eval('.case', (a) => a.map((x) => x.href));
  return hrefs.every((h) => h.startsWith('http')) ? `${hrefs.length} ссылок` : false;
});
await check('Услуга «Сайты и лендинги» ведёт к сайтам', async () => {
  await p.locator('#services').scrollIntoViewIfNeeded();
  await p.click('.service:has-text("Сайты и лендинги")');
  await p.waitForTimeout(1600);
  return inView('#sites');
});
await check('Работа из «Логотипы и стиль» открывается', async () => {
  await p.locator('#identity').scrollIntoViewIfNeeded();
  await p.locator('.print').first().click();
  await p.waitForSelector('.lightbox__poster');
  await closeLb();
  return true;
});
await check('Форма: пустая отправка показывает 2 ошибки', async () => {
  await p.locator('#contact').scrollIntoViewIfNeeded();
  await p.click('.form__submit');
  return (await p.$$('.field__error')).length === 2;
});
await check('Форма: заполненная открывает Telegram @Stas_G13 с текстом и показывает «Готово»', async () => {
  const popup = p.waitForEvent('popup', { timeout: 5000 });
  await p.fill('input[name=name]', 'Тест');
  await p.fill('input[name=tel]', '9991234567');
  await p.click('.chip:has-text("Сайт")');
  await p.click('.form__submit');
  await p.waitForSelector('.form__done');
  const t = await p.textContent('.form__done pre');
  const tg = await popup;
  const u = tg.url();
  await tg.close();
  return t.includes('Телефон: +7 (999) 123-45-67') && t.includes('Нужно: Сайт') && u.includes('t.me/Stas_G13') && decodeURIComponent(u).includes('Нужно: Сайт');
});
await check('Страница политики открывается', async () => (await p.request.get(new URL('policy/', url).href)).ok());
await check('Яндекс.Метрика 113849245 подключена, клик в Telegram шлёт цель tg_click', async () => {
  const ok = await p.evaluate(() => typeof window.ym === 'function' && [...document.scripts].some((s) => s.src.includes('113849245')));
  await p.evaluate(() => {
    window.__goals = [];
    const orig = window.ym;
    window.ym = (...a) => { if (a[1] === 'reachGoal') window.__goals.push(a[2]); return orig?.(...a); };
    const a = document.querySelector('.hero a[href*="t.me"]');
    a.addEventListener('click', (e) => e.preventDefault(), { once: true });
    a.click();
  });
  const goals = await p.evaluate(() => window.__goals);
  return ok && goals.includes('tg_click');
});
const tg = await p.$$eval('a[href*="t.me"]', (a) => a.length);
results.push([tg ? 'ок' : 'ЖДЁТ', 'Кнопки Telegram', tg ? `${tg} ссылок t.me` : 'username не задан, кнопки ведут к форме']);
await p.close();

// ---------- телефон ----------
p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
p.on('pageerror', (e) => errors.push('телефон: ' + e.message));
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
await check('Телефон: кейсов сначала 4, «Показать ещё» раскрывает все', async () => {
  await p.locator('#sites').scrollIntoViewIfNeeded();
  const before = await p.$$eval('.case', (a) => a.filter((x) => getComputedStyle(x).display !== 'none').length);
  await p.tap('.more button');
  const after = await p.$$eval('.case', (a) => a.filter((x) => getComputedStyle(x).display !== 'none').length);
  return before === 4 && after > 4 ? `${before} → ${after}` : false;
});
await p.evaluate(() => scrollTo(0, 0));
await check('Телефон: «Меню» открывается и ведёт к разделу', async () => {
  await p.tap('.nav__menu');
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${SHOTS}/menu-phone.png` });
  await p.tap('.menu__list a:has-text("Услуги")');
  await p.waitForTimeout(1600);
  const open = await p.$('.menu.is-open');
  const top = await p.evaluate(() => document.querySelector('#services').getBoundingClientRect().top);
  return !open && top < 500;
});
await check('Телефон: ролик MEG открывается', async () => {
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(500);
  await p.tap('.hero__card--work');
  await p.waitForSelector('.lightbox video');
  await p.screenshot({ path: `${SHOTS}/lightbox-phone.png` });
  return true;
});
await p.close();
await b.close();

for (const [s, n, d] of results) console.log(`${s.padEnd(4)} ${n}${d ? ' — ' + d : ''}`);
if (errors.length) console.log('Ошибки в консоли:\n  ' + [...new Set(errors)].join('\n  '));
if (bad.length) console.log('Битые запросы:\n  ' + [...new Set(bad)].slice(0, 15).join('\n  '));
