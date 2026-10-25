// Прелоадер (TZ.md §3.1): только первый визит за сессию. 900–2000 мс, затем шторка уезжает вверх.
// Капли хрома — только десктоп без reduced motion; иначе знак BRK проявляется за 400 мс.
import { lazy, Suspense, useEffect, useState } from 'react';
import { asset, finePointer, isPhone, reducedMotion, webglOk } from '@/lib/env';
import { flight, heroPose, KNIGHT_ASPECT } from '@/three/flight';

const LiquidDrops = lazy(() => import('@/three/LiquidDrops'));

const KEY = 'bk-preloaded';
const MIN = 900;
const MAX = 2000;

export function shouldPreload() {
  try {
    return !sessionStorage.getItem(KEY);
  } catch {
    return false;
  }
}

/** onReveal — шторка пошла вверх (первый экран начинает вход), onDone — прелоадер можно убрать */
export function Preloader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const drops = !isPhone() && !reducedMotion() && finePointer() && webglOk();
  const pose = heroPose(window.innerWidth, window.innerHeight);

  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setCount(100);
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {}
      setLeaving(true);
      onReveal();
      setTimeout(onDone, reducedMotion() ? 0 : 850);
    };
    const tick = () => {
      const el = performance.now() - t0;
      // счётчик идёт по времени, но не дальше 90, пока сцена рыцаря не готова
      const target = Math.min(flight.ready ? 100 : 90, (el / MIN) * 100);
      setCount((c) => Math.max(c, Math.floor(target)));
      if ((el >= MIN && flight.ready) || el >= MAX) return finish();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onReveal, onDone]);

  return (
    <div className={`preloader ${leaving ? 'preloader--leave' : ''}`} role="status" aria-label="Загрузка">
      {drops && (
        <div
          className="preloader__drops"
          style={{ left: pose.cx - pose.w * 0.6, top: pose.cy - pose.w * 0.6, width: pose.w * 1.2, height: pose.w * 1.2 }}
        >
          <Suspense fallback={null}>
            <LiquidDrops merge={650} />
          </Suspense>
        </div>
      )}
      <img
        className={`preloader__mark ${drops ? 'preloader__mark--late' : ''}`}
        src={asset('brk.svg')}
        alt=""
        style={{ left: pose.cx - pose.w / 2, top: pose.cy - pose.w / KNIGHT_ASPECT / 2, width: pose.w }}
      />
      <span className="preloader__count t-small tabular">{count}</span>
    </div>
  );
}
