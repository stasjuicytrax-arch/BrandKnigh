// 4.8 Логотипы и стиль + 4.9 Бренд-персонажи (тексты со старого сайта).
// Логотипы — лаймовая сцена-карта, работы брошены на неё отпечатками с лёгким поворотом (Tenista/Carbon),
// на hover выпрямляются. Персонаж Rubik — стеклянная карточка с текстом и две картинки.
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Glass } from '@/components/ui/liquid-glass';
import { asset, reducedMotion } from '@/lib/env';

const WORKS = Array.from({ length: 8 }, (_, i) => `assets/identity/id-${i + 1}.webp`);
const TILT = [-6, 4, -3, 5, -4, 3, -5, 6];

export function Identity() {
  const [open, setOpen] = useState<string | null>(null);
  const dragged = useRef(false);
  const still = reducedMotion();
  return (
    <section id="identity" className="identity scene section" aria-labelledby="identity-h">
      <div className="identity__head">
        <h2 id="identity-h" className="t-head">Логотипы и стиль</h2>
        <p className="t-body">Знаки, фирменные цвета, шрифты и шаблоны для соцсетей. Чтобы афиши и сайт говорили одним голосом.</p>
      </div>
      <div className="identity__wall">
        {WORKS.map((w, i) => (
          <motion.button
            key={w}
            type="button"
            className="print"
            style={{ '--r': `${TILT[i]}deg` } as React.CSSProperties}
            drag={!still}
            dragSnapToOrigin
            dragElastic={0.35}
            dragTransition={{ bounceStiffness: 260, bounceDamping: 18 }}
            whileDrag={{ scale: 1.06, zIndex: 5 }}
            onDragStart={() => (dragged.current = true)}
            onClick={() => {
              if (dragged.current) {
                dragged.current = false;
                return;
              }
              setOpen(w);
            }}
            data-cursor="Тяни"
          >
            <img src={asset(w)} alt={`Работа студии: фирменный стиль ${i + 1}`} loading="lazy" draggable={false} />
          </motion.button>
        ))}
      </div>
      {open &&
        createPortal(
          <div className="lightbox" role="dialog" aria-modal="true" aria-label="Работа" onClick={() => setOpen(null)}>
            <img className="lightbox__poster" src={asset(open)} alt="Фирменный стиль" />
            <button type="button" className="lightbox__btn lightbox__close round-btn" aria-label="Закрыть" onClick={() => setOpen(null)}>
              <Glass />
              <X size={22} />
            </button>
          </div>,
          document.body,
        )}
    </section>
  );
}

export function Characters() {
  return (
    <section id="characters" className="section container characters" aria-labelledby="characters-h">
      <div className="characters__art">
        <img className="characters__main" src={asset('assets/character/rubik.webp')} alt="Rubik — бренд-персонаж компании «Рубим жарим»" loading="lazy" width={900} height={900} />
        <img className="characters__faces" src={asset('assets/character/rubik-faces.webp')} alt="Эмоции персонажа Rubik" loading="lazy" width={1000} height={706} />
      </div>
      <div className="characters__text" data-reveal>
        <h2 id="characters-h" className="t-head title">
          Бренд-<span className="pill">персонажи</span>
        </h2>
        <p className="t-lead">Вымышленные герои, которые полностью соответствуют бренду и выражают его суть. Они помогают отстроиться от конкурентов и делают компанию привлекательнее.</p>
        <p className="t-body characters__soft">Персонаж — это воображаемый человек с именем, хобби, симпатиями и антипатиями, как герой книги. Например, Rubik — персонаж для компании «Рубим жарим».</p>
      </div>
    </section>
  );
}
