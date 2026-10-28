// 4.3 «Анимация афиш» (TZ.md §4.3): сцена-карта со светом и зерном, пиннинг 250vh (телефон 180vh).
// Этапы: (1) статичная обложка, рамка открывается шторкой; (2) обложка оживает, точка «Играет», снизу «АФИШ»;
// (3) зум ×1.4 на детали, справа подпись и кнопка. Зажатие пальцем/мышью сразу оживляет афишу.
import { useEffect, useRef, useState } from 'react';
import { LimeButton } from '@/components/Buttons';
import { scene, tgUrl } from '@/data/site';
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
    const ctx = gsap.context(() => {
      // шторка рамки: снизу вверх, картинка оседает 1.12 → 1
      gsap.fromTo('.alive__frame', { clipPath: 'inset(100% 0% 0% 0% round 28px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      });
      gsap.fromTo('.alive__zoom img', { scale: 1.12 }, {
        scale: 1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      });
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6,
          onUpdate: (s) => setStage(s.progress < 0.28 ? 1 : s.progress < 0.6 ? 2 : 3),
        },
      })
        .fromTo('.alive__bottom', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.28, ease: 'none' }, 0.28)
        .fromTo('.alive__card--after', { opacity: 0.35 }, { opacity: 1, duration: 0.2, ease: 'none' }, 0.3)
        .to('.alive__zoom', { scale: 1.4, duration: 0.3, ease: 'none' }, 0.6)
        .fromTo('.alive__caption', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.15, ease: 'none' }, 0.64)
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

  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(t);
  }, []);

  if (still) {
    // reduced motion: без пиннинга, статика и живая версия рядом
    return (
      <section id="afishi" className="alive alive--still scene" aria-labelledby="afishi-h">
        <div className="alive__light" aria-hidden />
        <div className="grain" />
        <h2 id="afishi-h" className="t-head alive__h-static">
          {scene.top} {scene.bottom}
        </h2>
        <div className="alive__pair">
          <figure>
            <img src={STILL} alt="Афиша MEG · 14 июня, статичная" width={540} height={960} />
            <figcaption className="t-small">{scene.before.label} — {scene.before.text}</figcaption>
          </figure>
          <figure>
            <video src={videoSrc(ID, 'loop.mp4')} poster={STILL} muted loop playsInline controls preload="none" />
            <figcaption className="t-small">{scene.after.label} — {scene.after.text}</figcaption>
          </figure>
        </div>
        <div className="alive__caption-static">
          <p className="t-lead">{scene.caption}</p>
          <LimeButton href={tgUrl()} place="afishi">{scene.cta}</LimeButton>
        </div>
      </section>
    );
  }

  return (
    <section id="afishi" ref={root} className="alive" style={{ height: isPhone() ? '180vh' : '250vh' }} aria-labelledby="afishi-h">
      <div className="alive__sticky">
        <div className="alive__stage scene">
          <div className="alive__light" aria-hidden />
          <div className="grain" />
          <h2 id="afishi-h" className="alive__h t-head">
            <span className="alive__top">{scene.top}</span>
            <span className="alive__bottom">{scene.bottom}</span>
          </h2>

          <div className="alive__card alive__card--before glass" aria-hidden>
            <b className="t-title">{scene.before.label}</b>
            <span className="t-small">{scene.before.text}</span>
          </div>

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
            <span className={`alive__live glass live ${live ? 'is-on' : ''}`}>Играет</span>
          </div>

          <div className="alive__side">
            <div className="alive__card alive__card--after glass" aria-hidden>
              <b className="t-title">{scene.after.label}</b>
              <span className="t-small">{scene.after.text}</span>
            </div>
            <div className="alive__caption">
              <p className="t-lead">{scene.caption}</p>
              <LimeButton href={tgUrl()} place="afishi">{scene.cta}</LimeButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
