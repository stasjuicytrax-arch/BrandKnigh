// 4.1 Первый экран «Хромовый рыцарь» (TZ.md §4.1).
// Сверху h1 «ДВИЖЕНИЕ [окно] / ПРОДАЁТ», в нижних 55% — 3D-рыцарь, на линии 52% фраза разрезана вокруг него.
import { ArrowDown } from 'lucide-react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { GlassButton } from '@/components/GlassButton';
import { InlineSlot } from '@/components/InlineSlot';
import { hero, tgUrl } from '@/data/site';
import { videos } from '@/data/videos';
import { asset, reducedMotion, webglOk } from '@/lib/env';
import { gsap, ScrollTrigger, scrollToHash } from '@/lib/scroll';
import { emitFlight, flight, heroPose } from '@/three/flight';

const KnightScene = lazy(() => import('@/three/KnightScene'));

// MEG первым (TZ.md §2.3), дальше живые афиши со старого сайта
const SLOT_IDS = videos.slice(0, 8).map((v) => v.id);

export function Hero({ entered }: { entered: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [three] = useState(() => webglOk() && !reducedMotion());
  const [pose, setPose] = useState(() => heroPose(window.innerWidth, window.innerHeight));

  useEffect(() => {
    const r = () => setPose(heroPose(window.innerWidth, window.innerHeight));
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);

  // без 3D прелоадеру нечего ждать
  useEffect(() => {
    if (!three) {
      flight.ready = true;
      emitFlight();
    }
  }, [three]);

  // «Полёт»: 0→100vh первого экрана, scrub 0.6
  useEffect(() => {
    if (!three || !root.current) return;
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: () => `+=${window.innerHeight}`,
      scrub: 0.6,
      onUpdate: (self) => {
        flight.progress = self.progress;
        emitFlight();
      },
    });
    return () => st.kill();
  }, [three]);

  // вход после прелоадера: строки из-под маски, окно шторкой, половины фразы от центра, кнопка последней
  useEffect(() => {
    if (!entered || !root.current) return;
    if (reducedMotion()) return;
    const q = gsap.utils.selector(root.current);
    // gsap.context: при повторном монтировании (StrictMode) from-анимации откатываются, а не замирают
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from(q('.hero__line-inner'), { yPercent: 105, duration: 0.9, stagger: 0.12 })
        .from(q('.inline-slot'), { clipPath: 'inset(100% 0 0 0)', duration: 0.9 }, 0.25)
        .from(q('.hero__half--l'), { x: 60, opacity: 0, duration: 0.6 }, 0.45)
        .from(q('.hero__half--r'), { x: -60, opacity: 0, duration: 0.6 }, 0.45)
        .from(q('.hero__note'), { opacity: 0, duration: 0.6 }, 0.6)
        .from(q('.hero__actions'), { y: 24, opacity: 0, duration: 0.6 }, 0.7);
    }, root);
    return () => ctx.revert();
  }, [entered]);

  return (
    <section id="top" ref={root} className="hero" style={{ visibility: entered ? 'visible' : 'hidden' }}>
      <h1 className="hero__title t-display" aria-label={hero.ariaLabel}>
        <span className="hero__line" aria-hidden>
          <span className="hero__line-inner">{hero.slogan.first}</span>
        </span>
        <span className="hero__line" aria-hidden>
          <span className="hero__line-inner">
            {hero.slogan.second}
            <InlineSlot ids={SLOT_IDS} interval={3000} width={1.7} className="hero__slot" />
          </span>
        </span>
        <span className="hero__line" aria-hidden>
          <span className="hero__line-inner">
            <Typed word={hero.slogan.typed} start={entered} />
          </span>
        </span>
      </h1>

      <div className="hero__horizon">
        <p className="t-lead hero__lead">
          <span className="hero__half hero__half--l">{hero.leadLeft}</span>{' '}
          <span className="hero__half hero__half--r">{hero.leadRight}</span>
        </p>
        <p className="t-body hero__note">{hero.note}</p>
      </div>

      {/* фолбэк без WebGL / при reduced motion: статичный рендер рыцаря (scripts/render-knight.mjs) */}
      {!three && (
        <img
          className="hero__fallback"
          src={asset('assets/fallback/hero.webp')}
          alt=""
          width={1200}
          height={800}
          style={{ left: pose.cx - (pose.w * 1.35) / 2, top: pose.cy - (pose.w * 1.35 * 2) / 3 / 2, width: pose.w * 1.35 }}
        />
      )}

      <div className="hero__actions">
        <GlassButton href={tgUrl()} place="hero">
          {hero.cta}
        </GlassButton>
        <a
          href="#afishi"
          className="link-u t-small hero__secondary"
          onClick={(e) => {
            e.preventDefault();
            scrollToHash('#afishi');
          }}
        >
          {hero.secondary}
          <ArrowDown aria-hidden size={18} strokeWidth={1.75} />
        </a>
      </div>

      {three && (
        <Suspense fallback={null}>
          <KnightScene />
        </Suspense>
      )}
    </section>
  );
}

/** «_SOLUTION»: подчёркивание — мигающий курсор; слово печатается по 60 мс на букву и раз в 6 с перепечатывается. */
function Typed({ word, start }: { word: string; start: boolean }) {
  const still = reducedMotion();
  const [n, setN] = useState(still ? word.length : 0);

  useEffect(() => {
    if (still || !start) return;
    let timer = 0;
    let len = 0;
    const type = () => {
      if (len < word.length) {
        setN(++len);
        timer = window.setTimeout(type, 60);
      } else timer = window.setTimeout(erase, 6000);
    };
    const erase = () => {
      if (len > 0) {
        setN(--len);
        timer = window.setTimeout(erase, 35);
      } else timer = window.setTimeout(type, 300);
    };
    timer = window.setTimeout(type, 500);
    return () => clearTimeout(timer);
  }, [start, still, word]);

  return (
    <span className="typed">
      <span className={`typed__cursor ${still ? '' : 'typed__cursor--blink'}`}>_</span>
      <span className="typed__word">
        {word.slice(0, n)}
        {/* невидимый остаток держит ширину строки, чтобы заголовок не прыгал */}
        <span className="typed__rest">{word.slice(n)}</span>
      </span>
    </span>
  );
}
