// 4.3 «Анимация афиш» (переделано по замечанию заказчика 28.10.2026: без пиннинга, без пятна-градиента).
// Слева заголовок, фраза и кнопка; справа две афиши MEG одного размера: «Было» — статика
// (зажатие оживляет её прямо на месте), «Стало» — тот же макет в движении.
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/Buttons';
import { Glass } from '@/components/ui/liquid-glass';
import { scene, tgUrl } from '@/data/site';
import { videoSrc } from '@/data/videos';
import { reducedMotion } from '@/lib/env';
import { gsap } from '@/lib/scroll';

const ID = 'meg-14june';
// статичная афиша — последний кадр ролика (вся афиша целиком)
const STILL = `${import.meta.env.BASE_URL}assets/videos/${ID}/still.webp`;

export function AliveScene() {
  const root = useRef<HTMLElement>(null);
  const held = useRef<HTMLVideoElement>(null);
  const [pressing, setPressing] = useState(false);

  useEffect(() => {
    const v = held.current;
    if (!v) return;
    if (pressing) v.play().catch(() => {});
    else {
      v.pause();
      v.currentTime = 0;
    }
  }, [pressing]);

  useEffect(() => {
    if (reducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.poster', {
        y: 48, opacity: 0, rotate: (i: number) => (i ? 4 : -4), duration: 1, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="afishi" ref={root} className="alive section container" aria-labelledby="afishi-h">
      <div className="alive__copy" data-reveal>
        <h2 id="afishi-h" className="t-head">
          {scene.top} <span className="alive__mute">{scene.bottom}</span>
        </h2>
        <p className="t-lead">{scene.caption}</p>
        <Button href={tgUrl()} place="afishi">{scene.cta}</Button>
      </div>

      <div className="alive__pair">
        <figure
          className="poster"
          data-cursor="Зажми"
          onPointerDown={(e) => {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            setPressing(true);
          }}
          onPointerUp={() => setPressing(false)}
          onPointerCancel={() => setPressing(false)}
          onContextMenu={(e) => e.preventDefault()}
        >
          <img src={STILL} alt="Афиша MEG · 14 июня, статичная" width={540} height={960} className={pressing ? 'is-off' : ''} />
          <video ref={held} src={videoSrc(ID, 'loop.mp4')} poster={STILL} muted loop playsInline preload="none" className={pressing ? 'is-on' : ''} />
          <figcaption className="poster__tag">
            <Glass tone="dark" />
            <span><b>{scene.before.label}</b> · {scene.before.text}</span>
            <span className="poster__hint">зажми</span>
          </figcaption>
        </figure>

        <figure className="poster poster--live">
          <video src={videoSrc(ID, 'loop.mp4')} poster={STILL} muted loop playsInline autoPlay={!reducedMotion()} preload="metadata" />
          <figcaption className="poster__tag">
            <Glass tone="dark" />
            <span><b>{scene.after.label}</b> · {scene.after.text}</span>
            <span className="live">Играет</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
