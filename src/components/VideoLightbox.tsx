// Лайтбокс видео (DESIGN.md v2 §7): тёмный фон 92%, видео 9:16 со звуком, стеклянные стрелки,
// закрытие по Esc, клику по фону и свайпу вниз. Цель Метрики video_open.
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { videoSrc, type Video } from '@/data/videos';
import { goal } from '@/lib/metrika';

type Props = { items: Video[]; index: number | null; onClose: () => void };

export function VideoLightbox({ items, index, onClose }: Props) {
  const [i, setI] = useState(index ?? 0);
  const close = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const open = index !== null;

  useEffect(() => {
    if (index === null) return;
    setI(index);
    goal('video_open', { id: items[index].id });
    const prev = document.activeElement as HTMLElement | null;
    close.current?.focus();
    document.documentElement.classList.add('menu-open');
    return () => {
      document.documentElement.classList.remove('menu-open');
      prev?.focus();
    };
  }, [index, items]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setI((v) => (v + 1) % items.length);
      if (e.key === 'ArrowLeft') setI((v) => (v - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open, items.length, onClose]);

  if (!open) return null;
  const v = items[i];
  const many = items.length > 1;

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={v.title ?? 'Видео-креатив'}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
      onTouchEnd={(e) => {
        const s = touch.current;
        if (!s) return;
        const dx = e.changedTouches[0].clientX - s.x, dy = e.changedTouches[0].clientY - s.y;
        if (dy > 90 && Math.abs(dy) > Math.abs(dx)) onClose();
        else if (many && Math.abs(dx) > 60) setI((p) => (p + (dx < 0 ? 1 : -1) + items.length) % items.length);
      }}
    >
      <video key={v.id} className="lightbox__video" src={videoSrc(v.id, 'full.mp4')} poster={videoSrc(v.id, 'poster.webp')} controls autoPlay playsInline />
      {v.title && <p className="lightbox__title t-small glass">{v.title}</p>}
      <button ref={close} type="button" className="lightbox__btn lightbox__close glass" aria-label="Закрыть" onClick={onClose}>
        <X size={22} strokeWidth={2} />
      </button>
      {many && (
        <>
          <button type="button" className="lightbox__btn lightbox__prev glass" aria-label="Предыдущее видео" onClick={() => setI((p) => (p - 1 + items.length) % items.length)}>
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
          <button type="button" className="lightbox__btn lightbox__next glass" aria-label="Следующее видео" onClick={() => setI((p) => (p + 1) % items.length)}>
            <ChevronRight size={24} strokeWidth={2} />
          </button>
        </>
      )}
    </div>,
    document.body,
  );
}
