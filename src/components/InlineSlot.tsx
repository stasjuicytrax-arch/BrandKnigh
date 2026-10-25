// Окно-в-строке (DESIGN.md §9): живая афиша в строке заголовка вместо слова.
// Высота по прописным (0.78em), выравнивание по базовой линии. Ролики меняются шторкой снизу вверх.
import { useEffect, useRef, useState } from 'react';
import { videoSrc } from '@/data/videos';
import { reducedMotion } from '@/lib/env';

type Props = {
  ids: string[];
  /** Смена раз в N мс; 0 — одна афиша */
  interval?: number;
  /** Ширина в em (1.6–2.4) */
  width?: number;
  className?: string;
};

export function InlineSlot({ ids, interval = 3000, width = 1.9, className = '' }: Props) {
  const [{ i, prev }, setSlot] = useState<{ i: number; prev: number | null }>({ i: 0, prev: null });
  const root = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!interval || ids.length < 2 || !visible || reducedMotion()) return;
    const t = setInterval(() => {
      setSlot((s) => ({ i: (s.i + 1) % ids.length, prev: s.i }));
    }, interval);
    return () => clearInterval(t);
  }, [interval, ids.length, visible]);

  const still = reducedMotion();

  return (
    <span
      ref={root}
      aria-hidden
      className={`inline-slot ${className}`}
      style={{ width: `${width}em` }}
    >
      {prev !== null && (
        <SlotVideo key={`p${prev}-${i}`} id={ids[prev]} still={still} play={visible} />
      )}
      <SlotVideo key={`c${i}`} id={ids[i]} still={still} play={visible} enter={prev !== null} />
    </span>
  );
}

function SlotVideo({ id, still, play, enter = false }: { id: string; still: boolean; play: boolean; enter?: boolean }) {
  const v = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = v.current;
    if (!el || still) return;
    if (play) el.play().catch(() => {});
    else el.pause();
  }, [play, still]);
  if (still) return <img className="inline-slot__media" src={videoSrc(id, 'poster.webp')} alt="" />;
  return (
    <video
      ref={v}
      className={`inline-slot__media ${enter ? 'inline-slot__media--enter' : ''}`}
      src={videoSrc(id, 'loop.mp4')}
      poster={videoSrc(id, 'poster.webp')}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
    />
  );
}
