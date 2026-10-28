// Курсор (TZ.md §3.3), только pointer: fine. Точка 10px; над [data-cursor="текст"] — стеклянный круг 88px
// с подписью; над ссылками и кнопками — 40px. Пружина stiffness 300, damping 30.
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { finePointer } from '@/lib/env';

export function Cursor() {
  const [on] = useState(finePointer);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 300, damping: 30 });
  const sy = useSpring(y, { stiffness: 300, damping: 30 });
  const [label, setLabel] = useState<string | null>(null);
  const [link, setLink] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!on) return;
    document.documentElement.classList.add('has-cursor');
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      const media = t?.closest?.('[data-cursor]');
      setLabel(media ? media.getAttribute('data-cursor') : null);
      setLink(!media && Boolean(t?.closest?.('a, button, [role="button"], label')));
    };
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', press);
    window.addEventListener('pointerup', release);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
    };
  }, [on, x, y]);

  if (!on) return null;
  const size = label ? 88 : link ? 40 : 10;
  return (
    <motion.div className="cursor" aria-hidden style={{ x: sx, y: sy }}>
      <motion.div
        className={`cursor__dot ${label ? 'cursor__dot--media' : ''} ${link ? 'cursor__dot--link' : ''}`}
        animate={{ width: size, height: size, scale: down ? 0.9 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {label && <span className="t-small">{label}</span>}
      </motion.div>
    </motion.div>
  );
}
