// Векторизует знак BRK из PNG старого сайта (1000x1000, белые буквы на чёрном)
// в src/three/knight-path.svg (для экструзии в 3D) и public/brk.svg (логотип в шапке).
// Запуск: node scripts/trace-logo.mjs
import potrace from 'potrace';
import { writeFileSync } from 'node:fs';

const SRC = 'public/assets/old-site/brand/6137-6138-Brk_png.png';
potrace.trace(SRC, { threshold: 128, turdSize: 20, optTolerance: 0.2, alphaMax: 0.6, blackOnWhite: false, color: '#0B0B0B', background: 'transparent' }, (err, svg) => {
  if (err) throw err;
  const d = svg.match(/ d="([^"]+)"/)[1];
  const nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
  const xs = nums.filter((_, i) => i % 2 === 0), ys = nums.filter((_, i) => i % 2 === 1);
  const [x0, y0, x1, y1] = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map(Math.round);
  const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${x1 - x0} ${y1 - y0}"><path fill="#0B0B0B" fill-rule="evenodd" d="${d}"/></svg>\n`;
  writeFileSync('src/three/knight-path.svg', out);
  writeFileSync('public/brk.svg', out);
  console.log('viewBox', x0, y0, x1 - x0, y1 - y0, 'subpaths', (d.match(/M/g) || []).length);
});
