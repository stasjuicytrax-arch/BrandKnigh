// 4.6 Создание сайтов (референс NextWave): заголовок слева + вводный текст, сетка карточек кейсов —
// скриншот сверху со стеклянным тегом и круглой стрелкой, ниже название и одна фраза о проекте.
// Сначала 6 новых, остальные раскрываются кнопкой. Клик открывает сайт (цель case_open).
import { useState } from 'react';
import { ArrowDot, Button } from '@/components/Buttons';
import { Glass } from '@/components/ui/liquid-glass';
import { cases } from '@/data/cases';
import { tgUrl } from '@/data/site';
import { asset } from '@/lib/env';
import { goal } from '@/lib/metrika';

const FIRST = 5; // широкая + одна, затем ряд из трёх

/** Полный скриншот грузится при первом наведении и прокручивается внутри карточки — «листаешь сайт» */
function Shot({ c }: { c: (typeof cases)[number] }) {
  const [full, setFull] = useState(false);
  return (
    <span className={`case__shot ${full ? 'is-full' : ''}`} onPointerEnter={(e) => e.pointerType === 'mouse' && c.shots.full && setFull(true)}>
      <img className="case__img" src={asset(c.shots.desktop)} alt={`Сайт ${c.name}`} loading="lazy" width={1440} height={900} />
      {full && c.shots.full && <img className="case__full" src={asset(c.shots.full)} alt="" aria-hidden />}
      {c.tag && (
        <span className="case__tag">
          <Glass />
          <span>{c.tag}</span>
        </span>
      )}
      <ArrowDot />
    </span>
  );
}

export function Sites() {
  const [all, setAll] = useState(false);
  const shown = all ? cases : cases.slice(0, FIRST);
  return (
    <section id="sites" className="section container" aria-labelledby="sites-h">
      <div className="split">
        <h2 id="sites-h" className="t-head title">
          Создание <span className="pill">сайтов</span>
        </h2>
        <div className="split__side">
          <p className="t-body">Лендинги, пресс-киты артистов, сайты площадок и агентств. От идеи до запуска.</p>
          <Button href={tgUrl()} place="sites">Обсудить сайт</Button>
        </div>
      </div>

      <div className="cases" data-reveal>
        {shown.map((c, i) => (
          <a
            key={c.slug}
            href={c.url}
            target="_blank"
            rel="noopener"
            className={`case ${i === 0 ? 'case--wide' : ''}`}
            data-cursor="Открыть"
            onClick={() => goal('case_open', { slug: c.slug })}
          >
            <Shot c={c} />
            <span className="case__body">
              <b className="t-title">{c.name}</b>
              {c.about && <span className="case__about">{c.about}</span>}
              <span className="case__url">{c.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
            </span>
          </a>
        ))}
      </div>
      {!all && (
        <div className="more">
          <button type="button" className="btn btn--ghost btn--plain" onClick={() => setAll(true)}>
            <span className="btn__label">Показать ещё {cases.length - FIRST}</span>
          </button>
        </div>
      )}
    </section>
  );
}
