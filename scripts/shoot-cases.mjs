// Снимает скриншоты 7 новых кейсов (content/cases.md) по TZ.md §2.4:
// 1440×900 и 390×844 (первый экран) + fullPage десктопа для «прокрутки в устройстве». WebP q82.
// Запуск: node scripts/shoot-cases.mjs   (нужны playwright и ffmpeg)
import { chromium } from 'playwright';
import { mkdirSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const cases = [
  { slug: 'djnagoo', url: 'https://djnagoo.site' },
  { slug: 'oppaacha', url: 'https://oppaacha.site/' },
  { slug: 'djlolly', url: 'https://djlolly.site/' },
  { slug: '39kingdom', url: 'https://stasjuicytrax-arch.github.io/39Kingdom/' },
  { slug: 'partytime', url: 'https://stasjuicytrax-arch.github.io/Partytime/' },
  { slug: 'digital-events', url: 'https://stasjuicytrax-arch.github.io/DIGITAL-EVENTS/' },
  { slug: 'stastoropov', url: 'https://stastoropov-site.vercel.app/' },
];
const OUT = 'public/assets/cases';
mkdirSync(OUT, { recursive: true });

// fullPage у длинных сайтов бывает > 16k px: WebP не держит больше 16383 по стороне, режем.
const toWebp = (png, webp, maxH = 16000) => {
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', png, '-vf', `crop=iw:min(ih\\,${maxH}):0:0`,
    '-c:v', 'libwebp', '-quality', '82', webp]);
  unlinkSync(png);
};

// Прокрутить страницу вниз, чтобы сработали ленивые картинки и анимации появления.
async function warm(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
}

const browser = await chromium.launch();
for (const c of cases) {
  for (const [kind, viewport, mobile] of [['desktop', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, locale: 'ru-RU', reducedMotion: 'no-preference' });
    const page = await ctx.newPage();
    try {
      await page.goto(c.url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => page.waitForLoadState('load'));
      await page.waitForTimeout(3000);
      await warm(page);
      await page.screenshot({ path: `${OUT}/${c.slug}-${kind}.png` });
      toWebp(`${OUT}/${c.slug}-${kind}.png`, `${OUT}/${c.slug}-${kind}.webp`);
      if (kind === 'desktop') {
        await page.screenshot({ path: `${OUT}/${c.slug}-full.png`, fullPage: true });
        toWebp(`${OUT}/${c.slug}-full.png`, `${OUT}/${c.slug}-full.webp`);
      }
      console.log(`ok  ${c.slug} ${kind}`);
    } catch (e) {
      console.log(`ERR ${c.slug} ${kind}: ${e.message.split('\n')[0]}`);
    }
    await ctx.close();
  }
}
await browser.close();
