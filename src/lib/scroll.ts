// Lenis (только десктоп, lerp 0.1) в связке с GSAP ScrollTrigger (TZ.md §3.4).
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { finePointer, reducedMotion } from './env';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
const velocityListeners = new Set<(v: number) => void>();

export function initScroll() {
  if (lenis || reducedMotion() || !finePointer()) return null;
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', (l: Lenis) => {
    ScrollTrigger.update();
    velocityListeners.forEach((fn) => fn(l.velocity));
  });
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** Скорость скролла (px/кадр). Без Lenis считаем по нативному scroll. */
export function onScrollVelocity(fn: (v: number) => void) {
  velocityListeners.add(fn);
  let last = window.scrollY;
  let raf = 0;
  const native = () => {
    if (lenis) return;
    const y = window.scrollY;
    fn(y - last);
    last = y;
    raf = requestAnimationFrame(native);
  };
  if (!lenis) raf = requestAnimationFrame(native);
  return () => {
    velocityListeners.delete(fn);
    cancelAnimationFrame(raf);
  };
}

/** Якорные ссылки: через Lenis со смещением под шапку. */
export function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  const offset = -parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '64', 10);
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset });
  else el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
}

export { gsap, ScrollTrigger };
