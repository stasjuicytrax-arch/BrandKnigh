// 4.1 Первый экран (TZ.md §4.1): сцена-карта с 3D-узлом из жидкого стекла сквозь слоган.
// Эталон — design/concept/index.html. Загрузка (TZ.md §3.1) происходит в самой сцене: узел собирается
// из прозрачности, внизу стеклянная пилюля со счётчиком, затем въезжают карточки и начинается печать.
import { Play } from 'lucide-react';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/Badge';
import { REVEAL_EVENT } from '@/components/Header';
import { GhostButton, LimeButton } from '@/components/Buttons';
import { VideoLightbox } from '@/components/VideoLightbox';
import { hero, tgUrl } from '@/data/site';
import { stats } from '@/data/stats';
import { videoSrc, videos } from '@/data/videos';
import { reducedMotion, webglOk } from '@/lib/env';
import { gsap } from '@/lib/scroll';

const HeroScene = lazy(() => import('@/three/HeroScene'));

const KEY = 'bk-loaded';
const MIN = 900;
const MAX = 2000;
const MEG = videos[0];

const firstVisit = () => {
  try {
    return !sessionStorage.getItem(KEY);
  } catch {
    return false;
  }
};

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [three] = useState(webglOk);
  const [reduced] = useState(reducedMotion);
  const [preload] = useState(firstVisit);
  const [fontReady, setFontReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(!three);
  const [revealed, setRevealed] = useState(false);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const scroll = useRef(0);
  const appear = useRef(preload && !reduced ? 0 : 1);

  // слоган рисуется в canvas: сначала дождаться Unbounded
  useEffect(() => {
    document.fonts.load('800 100px Unbounded').finally(() => setFontReady(true));
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    const onScroll = () => (scroll.current = Math.min(1, window.scrollY / el.clientHeight));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // загрузка: 900–2000 мс, счётчик 0–100, узел собирается; без прелоадера — сразу
  useEffect(() => {
    if (!preload) {
      if (sceneReady) setRevealed(true);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const el = performance.now() - t0;
      appear.current = reduced ? 1 : Math.min(1, el / MIN);
      setCount((c) => Math.max(c, Math.floor(Math.min(sceneReady ? 100 : 90, (el / MIN) * 100))));
      if ((el >= MIN && sceneReady) || el >= MAX) {
        appear.current = 1;
        setCount(100);
        try {
          sessionStorage.setItem(KEY, '1');
        } catch {}
        setRevealed(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [preload, sceneReady, reduced]);

  // въезд навигации и карточек снизу (stagger 70 мс)
  useEffect(() => {
    if (!revealed || !root.current || reduced || !preload) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-enter]', { y: 32, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07 });
    }, root);
    return () => ctx.revert();
  }, [revealed, reduced, preload]);

  useEffect(() => {
    if (revealed) window.dispatchEvent(new Event(REVEAL_EVENT));
  }, [revealed]);

  const onReady = useCallback(() => setSceneReady(true), []);
  const hidden = preload && !revealed;

  return (
    <section id="top" ref={root} className={`hero scene ${hidden ? 'is-loading' : ''}`} aria-labelledby="hero-h">
      {three && fontReady ? (
        <Suspense fallback={null}>
          <HeroScene visible={visible} scroll={scroll} typing={revealed} reduced={reduced} appear={appear} onReady={onReady} />
        </Suspense>
      ) : null}
      {!three && (
        <div className="hero__fallback" aria-hidden>
          <span>We create</span>
          <span>digital</span>
          <span>
            <i className="hero__cursor" />
            solution
          </span>
        </div>
      )}
      <div className="grain" />
      <h1 id="hero-h" className="sr-only">
        We create digital solution. BrandKnight — анимация афиш, видео-креативы и создание сайтов
      </h1>

      <nav className="hero__side glass" aria-label="Разделы" data-enter>
        <a className="is-on" href="#top" aria-label="Главная">BRK</a>
        <a href="#afishi" aria-label="Афиши"><Play size={16} strokeWidth={2.2} /></a>
        <a href="#sites" aria-label="Сайты">WEB</a>
        <a href="#contact" aria-label="Контакты">TG</a>
      </nav>

      <Badge className="hero__badge" place="hero-badge" />

      <div className="hero__stats">
        {stats.map((s) => (
          <div key={s.label} className="stat glass" data-enter>
            <b>{s.value}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="hero__lead glass" data-enter>
        <p>
          {hero.leadLeft} {hero.leadRight}
        </p>
        <small>{hero.note}</small>
        <div className="hero__row">
          <LimeButton href={tgUrl()} place="hero" glass>
            {hero.cta}
          </LimeButton>
          <GhostButton href="#afishi">{hero.secondary}</GhostButton>
        </div>
      </div>

      <button type="button" className="hero__work glass" data-enter data-cursor="Смотреть" onClick={() => setLightbox(0)}>
        <video src={videoSrc(MEG.id, 'loop.mp4')} poster={videoSrc(MEG.id, 'poster.webp')} muted loop playsInline autoPlay={!reduced} preload="metadata" />
        <span>
          <b>{hero.work.title}</b>
          <span>{hero.work.name}</span>
          <span className="live">Играет</span>
        </span>
      </button>

      {preload && (
        <div className={`hero__loader glass t-small tabular ${revealed ? 'is-done' : ''}`} role="status" aria-label="Загрузка">
          {count}
        </div>
      )}

      <VideoLightbox items={[MEG]} index={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
