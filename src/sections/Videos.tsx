// 4.4 Рекламные видео-креативы (TZ.md §4.4, бенто — по design/concept): заголовок с врезкой видео и
// лаймовой пилюлей, вводный ряд, бенто, ниже — лента всех роликов. Активный ролик играет; клик открывает
// лайтбокс со звуком. Вместо Circular Carousel 21st.dev — своя лента (код компонента заказчик не прислал).
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/Buttons';
import { Glass } from '@/components/ui/liquid-glass';
import { VideoLightbox } from '@/components/VideoLightbox';
import { tgUrl } from '@/data/site';
import { posters } from '@/data/posters';
import { videoSrc, videos } from '@/data/videos';
import { asset, reducedMotion } from '@/lib/env';

const AUDIENCE = ['Диджеи', 'Клубы и бары', 'Фестивали', 'Караоке', 'Ведущие', 'Бренды'];
const idx = (id: string) => videos.findIndex((v) => v.id === id);

/** Видео, которое играет, только пока его видно */
function Clip({ id, className = '' }: { id: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || reducedMotion()) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} className={className} src={videoSrc(id, 'loop.mp4')} poster={videoSrc(id, 'poster.webp')} muted loop playsInline preload="none" />;
}

function Rail({ open }: { open: (i: number) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(reducedMotion());

  // активная карточка — ближайшая к центру ленты
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { root: el, rootMargin: '0px -45% 0px -45%' },
    );
    el.querySelectorAll('[data-i]').forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  // листаем только саму ленту по горизонтали: scrollIntoView прокручивал всю страницу к ленте
  const go = (dir: number) => {
    const el = rail.current;
    const card = el?.querySelector<HTMLElement>(`[data-i="${Math.max(0, Math.min(videos.length - 1, active + dir))}"]`);
    if (!el || !card) return;
    const left = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
    el.scrollTo({ left, behavior: reducedMotion() ? 'auto' : 'smooth' });
  };

  // автоплей ленты 3.5 с — только пока лента на экране; пауза кнопкой (WCAG 2.2.2) и при наведении
  const hover = useRef(false);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (paused || !inView) return;
    const t = setInterval(() => !hover.current && go(active >= videos.length - 1 ? -videos.length : 1), 3500);
    return () => clearInterval(t);
  });

  return (
    <div className="rail" onPointerEnter={() => (hover.current = true)} onPointerLeave={() => (hover.current = false)}>
      <div ref={rail} className="rail__track" tabIndex={0} aria-label="Все видео-креативы" onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
      }}>
        {videos.map((v, i) => {
          const near = Math.abs(i - active) <= 1;
          return (
            <button key={v.id} type="button" data-i={i} className={`rail__card ${i === active ? 'is-active' : ''}`} data-cursor="Смотреть" onClick={() => open(i)} aria-label={`Смотреть: ${v.title ?? 'видео-креатив'}`}>
              {near && !paused ? (
                <video src={videoSrc(v.id, 'loop.mp4')} poster={videoSrc(v.id, 'poster.webp')} muted loop playsInline autoPlay preload="none" />
              ) : (
                <img src={videoSrc(v.id, 'poster.webp')} alt="" loading="lazy" width={540} height={960} />
              )}
              <span className="rail__tag">
                <Glass tone="dark" />
                <span>{v.title ?? 'Видео-креатив'}</span>
                {i === active && !paused && <span className="live">Играет</span>}
              </span>
            </button>
          );
        })}
      </div>
      <div className="rail__controls">
        <button type="button" className="round-btn" aria-label="Предыдущий ролик" onClick={() => go(-1)}>
          <Glass />
          <ChevronLeft size={22} />
        </button>
        <button type="button" className="round-btn" aria-label={paused ? 'Запустить ленту' : 'Пауза'} onClick={() => setPaused((p) => !p)}>
          <Glass />
          {paused ? <Play size={18} /> : <Pause size={18} />}
        </button>
        <button type="button" className="round-btn" aria-label="Следующий ролик" onClick={() => go(1)}>
          <Glass />
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}

export function Videos() {
  const root = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);


  return (
    <section id="video" ref={root} className="section container" aria-labelledby="video-h">
      <h2 id="video-h" className="t-head title">
        Рекламные видео&#8209;<span className="pill">креативы</span>
      </h2>
      <div className="intro" data-reveal>
        <p className="t-body">Анимируем афиши, сторис и рекламные ролики для вечеринок, клубов, фестивалей и брендов. Делаем под Instagram, Telegram и экраны в зале.</p>
        <Button href={tgUrl()} place="video">Заказать анимацию</Button>
      </div>

      <div className="bento" data-reveal>
        <button type="button" className="tile t-big" data-cursor="Смотреть" onClick={() => setLightbox(0)}>
          <Clip id="meg-14june" />
          <span className="tag"><Glass tone="dark" /><span>MEG · 14 июня</span><span className="live">Сторис</span></span>
        </button>
        <div className="tile t-lime">
          <h3 className="t-title">Афиша, которая двигается</h3>
          <p>Оживим ваш макет или сделаем афишу с нуля: сторис, посты, экраны в зале.</p>
          <Button href="#video-all" variant="ghost">Смотреть все</Button>
        </div>
        <button type="button" className="tile t-vid" data-cursor="Смотреть" onClick={() => setLightbox(idx('hytYXIRvD9I'))}>
          <Clip id="hytYXIRvD9I" />
        </button>
        <div className="tile t-pos"><img src={asset(posters[11])} alt="Статичная афиша вечеринки" loading="lazy" /></div>
        <div className="tile t-dark">
          <h3>Для кого</h3>
          <ul>{AUDIENCE.map((a) => <li key={a}>{a}</li>)}</ul>
        </div>
        <button type="button" className="tile t-vid" data-cursor="Смотреть" onClick={() => setLightbox(idx('ksp6yT9WuCs'))}>
          <Clip id="ksp6yT9WuCs" />
        </button>
        <div className="tile t-pos"><img src={asset(posters[16])} alt="Статичная афиша вечеринки" loading="lazy" /></div>
      </div>

      <div id="video-all" className="rail-wrap">
        <Rail open={setLightbox} />
      </div>

      <VideoLightbox items={videos} index={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
