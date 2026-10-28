// 4.7 Услуги (референс Ascend): бенто из серых плиток и одной лаймовой; каждая ведёт к своему разделу.
// Цен нет. Тексты — src/data/services.ts.
import { Clapperboard, Globe, Image, Mic2, PenTool, Smile, Sparkles } from 'lucide-react';
import { ArrowDot } from '@/components/Buttons';
import { services } from '@/data/services';
import { scrollToHash } from '@/lib/scroll';

const ICONS = [Sparkles, Clapperboard, Image, Globe, Mic2, PenTool, Smile];

export function Services() {
  return (
    <section id="services" className="section container" aria-labelledby="services-h">
      <div className="split">
        <h2 id="services-h" className="t-head title">Услуги</h2>
        <div className="split__side">
          <p className="t-body">Мы создаём готовые решения. Наш дизайн, ориентированный на пользователя, повышает производительность и увеличивает доход.</p>
        </div>
      </div>
      <div className="services">
        {services.map((s, i) => {
          const Icon = ICONS[i] ?? Sparkles;
          return (
            <a
              key={s.title}
              href={s.href}
              className={`service ${i === 0 ? 'service--lime' : ''} ${i === 3 ? 'service--dark' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToHash(s.href);
              }}
            >
              <span className="service__icon" aria-hidden>
                <Icon size={22} strokeWidth={1.75} />
              </span>
              <span className="service__body">
                <b className="t-title">{s.title}</b>
                <span>{s.note}</span>
              </span>
              <ArrowDot dark={i !== 3} />
            </a>
          );
        })}
      </div>
    </section>
  );
}
