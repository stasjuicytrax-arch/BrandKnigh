// 4.2 «Привет» (TZ.md §4.2): бесконечная строка Head-размера со старого сайта.
// Вместо «//» — маленький хромовый знак BRK. Скорость и наклон зависят от скорости скролла.
import { Fragment, useEffect, useRef } from 'react';
import { hello } from '@/data/site';
import { asset, reducedMotion } from '@/lib/env';
import { onScrollVelocity } from '@/lib/scroll';

function Run({ hidden }: { hidden?: boolean }) {
  return (
    <span className="hello__run" aria-hidden={hidden || undefined}>
      {hello.marquee.map((w) => (
        <Fragment key={w}>
          <span>{w}</span>
          <img className="hello__mark" src={asset('assets/brk-chrome.webp')} alt="" />
        </Fragment>
      ))}
    </span>
  );
}

export function Hello() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || reducedMotion()) return;
    let x = 0, v = 0, skew = 0, raf = 0, last = performance.now();
    const base = 60; // px/с в покое
    const off = onScrollVelocity((vel) => (v = vel));
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const boost = Math.min(18, Math.abs(v)) * 40;
      x -= (base + boost) * dt * (v < -0.5 ? -1 : 1);
      const half = el.scrollWidth / 2;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      const targetSkew = Math.max(-8, Math.min(8, -v * 0.6));
      skew += (targetSkew - skew) * 0.12;
      v *= 0.92;
      el.style.transform = `translate3d(${x}px,0,0) skewX(${skew.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      off();
    };
  }, []);

  return (
    <section id="hello" className="hello" aria-labelledby="hello-h">
      <h2 id="hello-h" className="sr-only">Привет</h2>
      <div className="hello__viewport t-head">
        <div ref={track} className="hello__track">
          <Run />
          <Run hidden />
        </div>
      </div>
      <div className="grid-12">
        <p className="hello__lead t-lead">{hello.lead}</p>
      </div>
    </section>
  );
}
