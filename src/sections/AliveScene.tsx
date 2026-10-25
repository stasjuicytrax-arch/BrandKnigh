// 4.3 «Статику листают — движение смотрят» (TZ.md §4.3). Пиннинг 300vh (телефон 200vh), липкая сцена 100svh.
// Этапы: 1) статичная афиша, рамка открывается шторкой; 2) афиша оживает, LIVE, снизу приезжает вторая половина;
// 3) видео ×1.8 на детали, справа подпись. Зажатие на этапе 1 оживляет афишу сразу.
import { useEffect, useRef, useState } from 'react';
import { scene } from '@/data/site';
import { videoSrc } from '@/data/videos';
import { isPhone, reducedMotion } from '@/lib/env';
import { gsap, ScrollTrigger } from '@/lib/scroll';

const ID = 'meg-14june';
// статичная афиша — последний кадр ролика (вся афиша целиком), а не кадр 1-й секунды с крупным планом
const STILL = `${import.meta.env.BASE_URL}assets/videos/${ID}/still.webp`;

export function AliveScene() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState(0);
  const [held, setHeld] = useState(false);
  const [still] = useState(reducedMotion);
  const live = stage >= 2 || held;

  useEffect(() => {
    if (still || !root.current) return;
    const q = gsap.utils.selector(root.current);
    const ctx = gsap.context(() => {
      // шторка рамки — один раз на сайте
      gsap.fromTo(
        q('.alive__frame'),
        { clipPath: 'inset(100% 0% 0% 0% round 28px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 28px)',
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.current, start: 'top 35%', once: true },
        },
      );
      gsap.fromTo(q('.alive__frame img'), { scale: 1.12 }, {
        scale: 1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 35%', once: true },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (s) => setStage(s.progress < 0.3 ? 1 : s.progress < 0.62 ? 2 : 3),
        },
      });
      tl.fromTo(q('.alive__bottom'), { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.3, ease: 'none' }, 0.3)
        .to(q('.alive__zoom'), { scale: 1.8, duration: 0.3, ease: 'none' }, 0.62)
        .fromTo(q('.alive__caption'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.15, ease: 'none' }, 0.66)
        .to({}, { duration: 0.1 });
    }, root);
    return () => ctx.revert();
  }, [still]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (live) v.play().catch(() => {});
    else {
      v.pause();
      v.currentTime = 0;
    }
  }, [live]);

  useEffect(() => ScrollTrigger.refresh(), []);

  if (still) {
    // reduced motion: без пиннинга, статика и живая версия рядом
    return (
      <section id="afishi" className="alive alive--still px-margin" aria-labelledby="afishi-h">
        <h2 id="afishi-h" className="t-display alive__h">
          <span>{scene.top}</span> <span>{scene.bottom}</span>
        </h2>
        <div className="alive__pair">
          <img src={STILL} alt="Афиша MEG · 14 июня, статичная" width={540} height={960} />
          <video src={videoSrc(ID, 'loop.mp4')} poster={videoSrc(ID, 'poster.webp')} muted loop playsInline controls preload="none" />
        </div>
        <p className="t-lead alive__caption-static">{scene.caption}</p>
      </section>
    );
  }

  return (
    <section id="afishi" ref={root} className="alive" style={{ height: isPhone() ? '200vh' : '300vh' }} aria-labelledby="afishi-h">
      <div className="alive__sticky">
        <h2 id="afishi-h" className="alive__h t-display">
          <span className="alive__top">{scene.top}</span>
          <span className="alive__bottom">{scene.bottom}</span>
        </h2>
        <div
          className="alive__frame"
          data-cursor={stage <= 1 ? 'Зажми' : undefined}
          onPointerDown={(e) => {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            setHeld(true);
          }}
          onPointerUp={() => setHeld(false)}
          onPointerCancel={() => setHeld(false)}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="alive__zoom">
            <img src={STILL} alt="Афиша MEG · 14 июня" width={540} height={960} className={live ? 'is-off' : ''} />
            <video ref={video} src={videoSrc(ID, 'loop.mp4')} muted loop playsInline preload="auto" className={live ? 'is-on' : ''} />
          </div>
          <span className={`alive__live t-small ${live ? 'is-on' : ''}`}>
            <span className="live-dot" /> LIVE
          </span>
        </div>
        <p className="alive__caption t-lead">{scene.caption}</p>
      </div>
    </section>
  );
}
