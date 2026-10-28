// Проверка вёрстки: на 6 ширинах ищет текст, который вылезает за свою «коробку»
// (ближайший предок с фоном, рамкой, стеклом или overflow), и горизонтальный скролл страницы.
// Запуск: node scripts/check-layout.mjs [url]   (dev-сервер или Pages)
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:5175/BrandKnigh/';
const widths = [2560, 2133, 1920, 1440, 1280, 1024, 768, 390, 360];
const b = await chromium.launch();
let problems = 0;
for (const w of widths) {
  const mobile = w < 768;
  const p = await b.newPage({ viewport: { width: w, height: 900 }, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(800);
  const res = await p.evaluate(() => {
    const out = [];
    const W = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth > W + 1) out.push(`горизонтальный скролл: ${document.documentElement.scrollWidth} > ${W}`);
    const isBox = (el) => {
      const cs = getComputedStyle(el);
      if (el === document.body) return true;
      if (cs.overflow !== 'visible' || cs.overflowX !== 'visible') return true;
      if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') return true;
      if (cs.borderTopWidth !== '0px' || cs.boxShadow.includes('inset')) return true;
      if ([...el.children].some((c) => c.classList?.contains('glass'))) return true;
      return false;
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (walker.nextNode()) {
      const t = walker.currentNode;
      if (!t.textContent.trim()) continue;
      const el = t.parentElement;
      if (!el || seen.has(el)) continue;
      seen.add(el);
      if (el.closest('[aria-hidden="true"], .sr-only, .hello__track, .footer__word, [inert], svg, script, style, .menu')) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      const r = document.createRange(); r.selectNodeContents(t);
      const tr = r.getBoundingClientRect();
      if (!tr.width) continue;
      let box = el.parentElement;
      while (box && !isBox(box)) box = box.parentElement;
      if (!box) continue;
      const br = box.getBoundingClientRect();
      const over = Math.max(br.left - tr.left, tr.right - br.right);
      if (over > 2) out.push(`«${t.textContent.trim().slice(0, 40)}» вылезает на ${Math.round(over)}px из ${box.tagName.toLowerCase()}.${[...box.classList].join('.')}`);
    }
    return out;
  });
  problems += res.length;
  console.log(`— ${w}px: ${res.length ? '' : 'ок'}`);
  res.slice(0, 25).forEach((l) => console.log('   ' + l));
  await p.close();
}
await b.close();
console.log(problems ? `ПРОБЛЕМ: ${problems}` : 'Проблем нет');
process.exitCode = problems ? 1 : 0;
