// 4.1 Первый экран (решение заказчика 28.10.2026, референс NextWave): слева заголовок со старого сайта
// с лаймовым подчёркиванием одного слова, абзац, лаймовая кнопка и «Смотреть работы»; справа рыцарь
// студии в большой скруглённой рамке, поверх — стеклянные карточки, орбита и вращающийся бейдж.
// Без 3D: тяжёлое WebGL на главной заказчик отклонил.
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/Badge';
import { Button, PlayLink } from '@/components/Buttons';
import { Glass } from '@/components/ui/liquid-glass';
import { VideoLightbox } from '@/components/VideoLightbox';
import { hero, tgUrl } from '@/data/site';
import { videoSrc, videos } from '@/data/videos';
import { asset, reducedMotion } from '@/lib/env';
import { followPointer } from '@/lib/motion';
import { gsap } from '@/lib/scroll';

const MEG = videos[0];

/** «WE CREATE DIGITAL _SOLUTION»: курсор мигает, SOLUTION печатается и стирается */
function Typed() {
  const still = reducedMotion();
  const word = hero.typed;
  const [n, setN] = useState(still ? word.length : 0);
  useEffect(() => {
    if (still) return;
    let t = 0, len = 0;
    const type = () => {
      setN(++len);
      t = window.setTimeout(len < word.length ? type : erase, len < word.length ? 70 : 5200);
    };
    const erase = () => {
      setN(--len);
      t = window.setTimeout(len > 0 ? erase : type, len > 0 ? 35 : 300);
    };
    t = window.setTimeout(type, 600);
    return () => clearTimeout(t);
  }, [still, word]);
  return (
    <span className="typed" aria-label={`${hero.slogan} ${word}`}>
      <span aria-hidden>
        {hero.slogan} <span className="typed__cursor">_</span>
        {word.slice(0, n)}
        <span className="typed__rest">{word.slice(n)}</span>
      </span>
    </span>
  );
}

export function Hero() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const visual = useRef<HTMLDivElement>(null);

  // глубина: рамка с рыцарем наклоняется за курсором (±5°), карточки и бейдж смещаются навстречу
  useEffect(() => {
    const el = visual.current;
    if (!el) return;
    const media = el.querySelector<HTMLElement>('.hero__media');
    const floats = [...el.querySelectorAll<HTMLElement>('[data-float], .hero__badge')];
    return followPointer(el, (x, y) => {
      if (media) media.style.transform = `perspective(1400px) rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 4).toFixed(2)}deg)`;
      floats.forEach((f, i) => {
        const k = 12 + i * 6;
        f.style.translate = `${(-x * k).toFixed(1)}px ${(-y * k * 0.7).toFixed(1)}px`;
      });
    });
  }, []);

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.hero__title', { y: 40, opacity: 0, duration: 1 })
        .from('.hero__eyebrow, .hero__lead, .hero__actions', { y: 24, opacity: 0, duration: 0.8, stagger: 0.07 }, 0.3)
        .from('.hero__media', { clipPath: 'inset(8% 8% 8% 8% round 40px)', opacity: 0, duration: 1.2 }, 0.1)
        .from('.hero__media img', { scale: 1.12, duration: 1.6 }, 0.1)
        .from('.hero [data-float]', { y: 32, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.6);
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" className="hero container" aria-label={hero.ariaLabel}>
      <div className="hero__text">
        <p className="hero__eyebrow">
          <i className="hero__dot" aria-hidden />
          <Typed />
        </p>
        <h1 className="hero__title">
          {hero.title.join(' ')}{' '}
          <span className="hero__accent">
            {hero.accent}
            <svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden>
              <path d="M4 16 C 70 6, 150 4, 296 12" pathLength={1} />
            </svg>
          </span>
        </h1>
        <p className="hero__lead t-lead">{hero.lead}</p>
        <div className="hero__actions">
          <Button href={tgUrl()} place="hero">{hero.cta}</Button>
          <PlayLink href="#video">{hero.secondary}</PlayLink>
        </div>
      </div>

      <div className="hero__visual" ref={visual}>
        <div className="hero__media">
          <img
            src={asset('assets/hero/knight-1400.webp')}
            srcSet={`${asset('assets/hero/knight-800.webp')} 800w, ${asset('assets/hero/knight-1400.webp')} 1400w`}
            sizes="(max-width: 900px) 100vw, 50vw"
            alt="Рыцарь BrandKnight в доспехах со стикерами и красным плащом"
            width={1400}
            height={2508}
            {...{ fetchpriority: "high" }}
          />
          <svg className="hero__orbit" viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden>
            <ellipse cx="200" cy="110" rx="196" ry="70" transform="rotate(-12 200 110)" />
            <ellipse className="hero__comet" cx="200" cy="110" rx="196" ry="70" transform="rotate(-12 200 110)" pathLength={1} />
          </svg>
        </div>

        <button type="button" className="hero__card hero__card--work" data-float data-cursor="Смотреть" onClick={() => setLightbox(0)}>
          <Glass tone="dark" />
          <video src={videoSrc(MEG.id, 'loop.mp4')} poster={videoSrc(MEG.id, 'poster.webp')} muted loop playsInline autoPlay={!reducedMotion()} preload="metadata" />
          <span className="hero__card-text">
            <b>{hero.work.title}</b>
            <span>{hero.work.name}</span>
            <span className="live">Играет</span>
          </span>
        </button>

        <Badge className="hero__badge" place="hero-badge" />
      </div>

      <VideoLightbox items={[MEG]} index={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
