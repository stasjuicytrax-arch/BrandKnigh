// 4.2 «Привет» + цифры (TZ.md §4.2): тёмная полоса-сцена (как в NextWave). Бегущая строка со старого сайта,
// скорость и наклон от скорости скролла; под ней фраза и три счётчика лаймом, досчитывают от 0 при появлении.
import { Fragment, useEffect, useRef, useState } from 'react';
import { hello } from '@/data/site';
import { stats } from '@/data/stats';
import { reducedMotion } from '@/lib/env';
import { onScrollVelocity } from '@/lib/scroll';

function Run({ hidden }: { hidden?: boolean }) {
  return (
    <span className="hello__run" aria-hidden={hidden || undefined}>
      {hello.marquee.map((w) => (
        <Fragment key={w}>
          <span>{w}</span>
          <i className="hello__dot" aria-hidden />
        </Fragment>
      ))}
    </span>
  );
}

function Counter({ value, label, run }: { value: number; label: string; run: boolean }) {
  const [n, setN] = useState(reducedMotion() ? value : 0);
  useEffect(() => {
    if (!run || reducedMotion()) return;
    const t0 = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, value]);
  return (
    <div className="hello__stat">
      <b className="tabular" aria-hidden>{n}</b>
      <span aria-hidden>{label}</span>
      <span className="sr-only">
        {value} {label}
      </span>
    </div>
  );
}

export function Hello() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      skew += (Math.max(-8, Math.min(8, -v * 0.6)) - skew) * 0.12;
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
    <section id="hello" ref={root} className="hello scene" aria-labelledby="hello-h">
      <h2 id="hello-h" className="sr-only">Привет</h2>
      <div className="hello__viewport t-head">
        <div ref={track} className="hello__track">
          <Run hidden />
          <Run hidden />
        </div>
      </div>
      <div className="hello__row">
        <p className="t-lead hello__lead">{hello.lead}</p>
        <div className="hello__stats">
          {stats.map((s) => (
            <Counter key={s.label} value={s.value} label={s.label} run={seen} />
          ))}
        </div>
      </div>
    </section>
  );
}
