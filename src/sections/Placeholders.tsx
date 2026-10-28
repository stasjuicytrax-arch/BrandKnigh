// Секции 4.4–4.13 (каркас): id для меню и h2 со старого сайта. Вёрстка — этапы 4–7, после согласования стиля.
import { testimonials } from '@/data/testimonials';

const SECTIONS = [
  { id: 'video', title: ['Рекламные', 'видео-креативы'] },
  { id: 'posters', title: ['Статичные', 'креативы'] },
  { id: 'sites', title: ['Создание', 'сайтов'] },
  { id: 'services', title: ['Услуги'] },
  { id: 'identity', title: ['Логотипы', 'и стиль'] },
  { id: 'characters', title: ['Бренд-персонажи'] },
  { id: 'clients', title: ['Наши', 'клиенты'] },
  ...(testimonials.length ? [{ id: 'thanks', title: ['Благодарности'] }] : []),
  { id: 'contact', title: ['Связь', 'с нами'] },
] as const;

export function Placeholders() {
  return (
    <>
      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className="stub container" aria-labelledby={`${s.id}-h`}>
          <h2 id={`${s.id}-h`} className="t-head">
            {s.title.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </h2>
        </section>
      ))}
      <footer className="stub stub--footer scene" aria-labelledby="footer-h">
        <h2 id="footer-h" className="t-head">
          <span className="block">Можем вам</span>
          <span className="block">помочь?</span>
        </h2>
      </footer>
    </>
  );
}
