// Общее движение страницы (решение заказчика 28.10: «дорого, креативно, с анимациями»).
// Только transform / opacity / clip-path, ease-out-кривые, один раз при входе; reduced motion — ничего не двигаем.
import { finePointer, reducedMotion } from './env';
import { gsap } from './scroll';

/** Заголовки секций выезжают из-под маски, вводные блоки и карточки — подъёмом по очереди. */
export function initReveals(root: HTMLElement) {
  if (reducedMotion()) return () => {};
  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('main h2:not(.sr-only)').forEach((h) => {
      gsap.from(h, {
        yPercent: 35,
        opacity: 0,
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1.1,
        ease: 'expo.out',
        clearProps: 'clipPath',
        scrollTrigger: { trigger: h, start: 'top 88%', once: true },
      });
    });
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((group) => {
      gsap.from([...group.children].filter((c) => c.tagName !== 'H2'), {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.07,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      });
    });
  }, root);
  return () => ctx.revert();
}

/** Магнитные кнопки: пилюля тянется к курсору (±8px), отпускание — пружиной через CSS-переход. */
export function initMagnetic() {
  if (reducedMotion() || !finePointer()) return () => {};
  const move = (e: PointerEvent) => {
    const btn = (e.target as Element | null)?.closest?.<HTMLElement>('.btn, .play-link, .badge');
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    btn.style.translate = `${(dx * 8).toFixed(1)}px ${(dy * 6).toFixed(1)}px`;
    btn.dataset.magnet = '';
  };
  const out = (e: PointerEvent) => {
    const btn = (e.target as Element | null)?.closest?.<HTMLElement>('[data-magnet]');
    if (btn && !btn.contains(e.relatedTarget as Node)) {
      btn.style.translate = '';
      delete btn.dataset.magnet;
    }
  };
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerout', out);
  return () => {
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerout', out);
  };
}

/** Плавное следование за курсором внутри элемента: вызывает fn(x, y) в диапазоне −1…1 с инерцией. */
export function followPointer(el: HTMLElement, fn: (x: number, y: number) => void) {
  if (reducedMotion() || !finePointer()) return () => {};
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0, running = false;
  const tick = () => {
    x += (tx - x) * 0.08;
    y += (ty - y) * 0.08;
    fn(x, y);
    if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) raf = requestAnimationFrame(tick);
    else running = false;
  };
  const wake = () => {
    if (!running) {
      running = true;
      raf = requestAnimationFrame(tick);
    }
  };
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    wake();
  };
  const leave = () => {
    tx = 0;
    ty = 0;
    wake();
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  return () => {
    cancelAnimationFrame(raf);
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerleave', leave);
  };
}
