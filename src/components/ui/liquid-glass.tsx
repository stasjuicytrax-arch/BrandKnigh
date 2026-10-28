// Жидкое стекло по рецепту заказчика («Рецепты/Жидкое стекло.md», как на DIGITAL EVENTS):
// одна SVG-карта смещения на страницу (красный — сдвиг по X, зелёный — по Y, нейтральный центр,
// искажение только у краёв). В Chromium — преломление через backdrop-filter: url(#bk-liquid),
// в Safari/Firefox — матовое стекло blur(10px). Стекло всегда отдельный слой <Glass/> под контентом,
// иначе backdrop-filter пропадает из-за transform/overflow/opacity у родителя.
import { useEffect } from 'react';

const BEZEL = 32;
const map = `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'>
<defs>
<linearGradient id='x' x1='0' x2='1' y1='0' y2='0'><stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#f00'/></linearGradient>
<linearGradient id='y' x1='0' x2='0' y1='0' y2='1'><stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#0f0'/></linearGradient>
<filter id='b'><feGaussianBlur stdDeviation='${BEZEL / 3}'/></filter>
</defs>
<rect width='256' height='256' fill='url(#x)'/>
<rect width='256' height='256' fill='url(#y)' style='mix-blend-mode:screen'/>
<rect x='${BEZEL}' y='${BEZEL}' width='${256 - BEZEL * 2}' height='${256 - BEZEL * 2}' rx='${BEZEL}' fill='#808000' filter='url(#b)'/>
</svg>`;
const MAP_URL = `data:image/svg+xml,${encodeURIComponent(map)}`;

/** Один общий SVG-фильтр на страницу. Рендерится один раз в корне. */
export function GlassFilter() {
  useEffect(() => {
    // url()-фильтры в backdrop-filter стабильно работают только в Chromium
    const ua = navigator.userAgent;
    const chromium = /Chrome\/|Edg\/|YaBrowser\//.test(ua) && !/Firefox\//.test(ua);
    if (chromium && CSS.supports('backdrop-filter', 'url(#bk-liquid)')) document.documentElement.classList.add('glass-svg');
  }, []);
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <filter id="bk-liquid" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feImage href={MAP_URL} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale={32} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

/** Подложка-стекло: первым ребёнком в элементе с position: relative и border-radius. */
export function Glass({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return <span className={`glass ${tone === 'dark' ? 'glass--dark' : ''}`} aria-hidden="true" />;
}
