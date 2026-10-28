// 4.12 Связь с нами (TZ.md §4.12) и 4.13 футер. Форма без сервера: валидация → текст заявки
// копируется в буфер → открывается Telegram с этим текстом. Пока username не прислан, вместо Telegram
// показываем готовый текст заявки и просим написать в Instagram.
import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Buttons';
import { email, instagram, telegram, tgUrl } from '@/data/site';
import { asset } from '@/lib/env';
import { goal } from '@/lib/metrika';

const NEEDS = ['Анимация афиш', 'Видео-креатив', 'Сайт', 'Логотип', 'Бренд-персонаж', 'Другое'];
const WAYS = ['Telegram', 'WhatsApp', 'Звонок'];

function maskPhone(raw: string) {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (!d.startsWith('7')) d = '7' + d;
  d = d.slice(0, 11);
  const p = d.slice(1);
  let out = '+7';
  if (p.length) out += ' (' + p.slice(0, 3);
  if (p.length >= 3) out += ')';
  if (p.length > 3) out += ' ' + p.slice(3, 6);
  if (p.length > 6) out += '-' + p.slice(6, 8);
  if (p.length > 8) out += '-' + p.slice(8, 10);
  return out;
}

function Chips({ items, value, onChange, multi, label }: { items: string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean; label: string }) {
  return (
    <fieldset className="field">
      <legend className="field__label">{label}</legend>
      <div className="chips">
        {items.map((it) => {
          const on = value.includes(it);
          return (
            <button
              key={it}
              type="button"
              className={`chip ${on ? 'is-on' : ''}`}
              aria-pressed={on}
              onClick={() => onChange(multi ? (on ? value.filter((v) => v !== it) : [...value, it]) : [it])}
            >
              {it}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [needs, setNeeds] = useState<string[]>([]);
  const [about, setAbout] = useState('');
  const [way, setWay] = useState<string[]>(['Telegram']);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [sent, setSent] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (name.trim().length < 2) err.name = 'Напишите, как к вам обращаться';
    if (phone.replace(/\D/g, '').length !== 11) err.phone = 'Нужен номер из 11 цифр';
    setErrors(err);
    if (err.name) return nameRef.current?.focus();
    if (err.phone) return phoneRef.current?.focus();
    const text = [
      'Заявка с сайта BrandKnight',
      `Имя: ${name.trim()}`,
      `Телефон: ${phone}`,
      `Нужно: ${needs.join(', ') || '—'}`,
      `Описание: ${about.trim() || '—'}`,
      `Связаться: ${way.join(', ')}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
    goal('form_submit');
    setSent(text);
    if (telegram) window.open(tgUrl(text), '_blank', 'noopener');
  };

  return (
    <section id="contact" className="section container contact" aria-labelledby="contact-h">
      <div className="contact__copy">
        <h2 id="contact-h" className="t-head title">
          Связь <span className="pill">с нами</span>
        </h2>
        <p className="t-lead">Хотите обсудить проект или проконсультироваться? Оставьте свои контактные данные.</p>
        <p className="t-small contact__note">*консультация бесплатная</p>
        <ul className="contact__links">
          {telegram && <li><a href={tgUrl()}>Telegram @{telegram}</a></li>}
          {instagram.map((i) => (
            <li key={i.handle}><a href={i.url} target="_blank" rel="noopener">Instagram {i.handle}</a></li>
          ))}
          <li><a href={`mailto:${email}`}>{email}</a></li>
        </ul>
      </div>

      <form className="form" onSubmit={submit} noValidate>
        {sent ? (
          <div className="form__done" role="status">
            <b className="t-title">Готово</b>
            <p>
              Текст заявки скопирован.{' '}
              {telegram ? <>Если Telegram не открылся, напишите нам: @{telegram}</> : <>Отправьте его нам в Instagram {instagram[0].handle}.</>}
            </p>
            <pre>{sent}</pre>
            <button type="button" className="btn btn--ghost btn--plain" onClick={() => setSent(null)}>
              <span className="btn__label">Заполнить заново</span>
            </button>
          </div>
        ) : (
          <>
            <label className={`field ${errors.name ? 'has-error' : ''}`}>
              <span className="field__label">Имя*</span>
              <input ref={nameRef} name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} />
              {errors.name && <span id="err-name" className="field__error">{errors.name}</span>}
            </label>
            <label className={`field ${errors.phone ? 'has-error' : ''}`}>
              <span className="field__label">Телефон*</span>
              <input ref={phoneRef} name="tel" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 (___) ___-__-__" value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'err-phone' : undefined} />
              {errors.phone && <span id="err-phone" className="field__error">{errors.phone}</span>}
            </label>
            <Chips label="Что нужно сделать" items={NEEDS} value={needs} onChange={setNeeds} multi />
            <label className="field">
              <span className="field__label">Описание проекта</span>
              <textarea rows={3} value={about} onChange={(e) => setAbout(e.target.value)} />
            </label>
            <Chips label="Удобный способ связи" items={WAYS} value={way} onChange={setWay} />
            <button type="submit" className="btn btn--primary form__submit">
              <span className="btn__label">Отправить в Telegram</span>
              <span className="btn__arrow" aria-hidden><ArrowUpRight size={20} strokeWidth={1.6} /></span>
            </button>
            <p className="t-small form__legal">
              Нажимая кнопку, вы принимаете <a href={asset('policy/')}>политику конфиденциальности</a>.
            </p>
          </>
        )}
      </form>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer scene" aria-labelledby="footer-h">
      <div className="footer__top">
        <div>
          <h2 id="footer-h" className="t-head">Можем вам помочь?</h2>
          <Button href={tgUrl()} place="footer">Напиши нам</Button>
        </div>
        <ul className="footer__links">
          {telegram && <li><a href={tgUrl()}>Telegram</a></li>}
          {instagram.map((i) => (
            <li key={i.handle}><a href={i.url} target="_blank" rel="noopener">Instagram {i.handle}</a></li>
          ))}
          <li><a href={asset('policy/')}>Политика конфиденциальности</a></li>
        </ul>
        <Badge className="footer__badge" place="footer-badge" />
      </div>
      <div className="footer__meta t-small">
        <span>© BrandKnight, 2026</span>
        <span>{email}</span>
      </div>
      <p className="footer__word" aria-hidden>BRANDKNIGHT</p>
    </footer>
  );
}
