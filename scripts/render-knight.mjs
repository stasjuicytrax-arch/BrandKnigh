// Снимает статичный рендер хромового рыцаря со страницы (dev-сервер должен работать):
//  public/assets/brk-chrome.webp   — знак на прозрачном фоне (разделитель в бегущей строке «Привет»)
//  public/assets/fallback/hero.webp — кадр первого экрана для фолбэка без WebGL / при reduced motion
// Запуск: npm run dev, затем node scripts/render-knight.mjs [url]
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, unlinkSync } from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:5173/BrandKnigh/';
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await p.addInitScript(() => sessionStorage.setItem('bk-preloaded', '1'));
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(7000);
// оставить только канвас; курсор в центре, чтобы знак стоял ровно
await p.mouse.move(720, 450);
await p.addStyleTag({ content: 'html,body{background:transparent!important} body *:not(.knight-canvas):not(.knight-canvas *){visibility:hidden!important}' });
await p.waitForTimeout(1500);
mkdirSync('public/assets/fallback', { recursive: true });
const pose = await p.evaluate(() => {
  const vw = innerWidth, vh = innerHeight;
  return { cx: vw / 2, cy: vh * 0.745, w: Math.min(vw * 0.3, vh * 0.4) };
});
const h = pose.w / (661 / 395);
const pad = 24;
await p.screenshot({
  path: '.cache/mark.png', omitBackground: true,
  clip: { x: pose.cx - pose.w / 2 - pad, y: pose.cy - h / 2 - pad, width: pose.w + pad * 2, height: h + pad * 2 },
});
await p.screenshot({
  path: '.cache/hero.png', omitBackground: false,
  clip: { x: pose.cx - pose.w / 2 - pad * 3, y: pose.cy - h / 2 - pad * 2, width: pose.w + pad * 6, height: h + pad * 5 },
});
await b.close();
const webp = (src, dst, w) => execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', src, '-vf', `scale=${w}:-1`, '-c:v', 'libwebp', '-quality', '86', '-pix_fmt', 'yuva420p', dst]);
webp('.cache/mark.png', 'public/assets/brk-chrome.webp', 240);
webp('.cache/hero.png', 'public/assets/fallback/hero.webp', 1200);
unlinkSync('.cache/mark.png');
unlinkSync('.cache/hero.png');
console.log('ok');
