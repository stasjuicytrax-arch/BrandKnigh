// 4.5 Статичные креативы (TZ.md §4.5): наклонная сетка из 20 афиш, колонки бесконечно едут навстречу
// друг другу, по центру стеклянная карточка с заголовком. Своя версия Tilted Grid Hero (код 21st.dev
// заказчик не прислал). Клик по афише открывает её крупно. Reduced motion: колонки стоят.
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Glass } from '@/components/ui/liquid-glass';
import { posters } from '@/data/posters';
import { asset } from '@/lib/env';

const COLS = 5;
const columns = Array.from({ length: COLS }, (_, c) => posters.filter((_, i) => i % COLS === c));

export function Posters() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section id="posters" className="posters section" aria-labelledby="posters-h">
      <div className="posters__stage">
        <div className="posters__grid" aria-hidden>
          {columns.map((col, c) => (
            <div key={c} className={`posters__col ${c % 2 ? 'posters__col--down' : ''}`} style={{ animationDuration: `${38 + c * 4}s` }}>
              {[...col, ...col].map((p, i) => (
                <button key={i} type="button" tabIndex={-1} className="posters__item" onClick={() => setOpen(p)} data-cursor="Открыть">
                  <img src={asset(p)} alt="" loading="lazy" width={540} height={960} />
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="posters__card">
          <Glass />
          <h2 id="posters-h" className="t-head">Статичные креативы</h2>
          <p className="t-body">Статичные афиши, сторис и посты для анонсов. Единый стиль на весь сезон.</p>
        </div>
      </div>

      {open &&
        createPortal(
          <div className="lightbox" role="dialog" aria-modal="true" aria-label="Афиша" onClick={() => setOpen(null)}>
            <img className="lightbox__poster" src={asset(open)} alt="Статичная афиша" />
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
