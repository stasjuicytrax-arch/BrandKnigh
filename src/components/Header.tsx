// Шапка (TZ.md §3.2, DESIGN.md v2 §7): стеклянный логотип · стеклянная пилюля ссылок (активная лаймовая) ·
// тёмная кнопка «Написать нам». На первом экране — три отдельных элемента поверх сцены, ниже — одна
// стеклянная полоса сверху; при скролле вниз прячется, вверх появляется. Телефон: логотип + «Меню».
import { useEffect, useState } from 'react';
import { DarkButton, LimeButton } from './Buttons';
import { hero, instagram, nav, tgUrl } from '@/data/site';
import { asset, reducedMotion } from '@/lib/env';
import { scrollToHash } from '@/lib/scroll';

/** Hero сообщает, что загрузка закончилась: шапка въезжает вместе с карточками */
export const REVEAL_EVENT = 'bk:reveal';

export function Header({ standalone = false }: { standalone?: boolean }) {
  const [stuck, setStuck] = useState(standalone);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('#top');
  const [shown, setShown] = useState(() => {
    if (standalone) return true;
    try {
      return Boolean(sessionStorage.getItem('bk-loaded'));
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (shown) return;
    const on = () => setShown(true);
    window.addEventListener(REVEAL_EVENT, on);
    return () => window.removeEventListener(REVEAL_EVENT, on);
  }, [shown]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const past = y > window.innerHeight * 0.85;
      setStuck(standalone || past);
      if (y < last - 2 || !past) setHidden(false);
      else if (y > window.innerHeight * 1.2 && y > last + 2) setHidden(true);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [standalone]);

  // активный пункт: секция, которая сейчас в середине экрана
  useEffect(() => {
    if (standalone) return;
    const ids = nav.map((n) => n.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [standalone]);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', menu);
  }, [menu]);

  const go = (href: string) => (e: React.MouseEvent) => {
    setMenu(false);
    if (standalone) return;
    e.preventDefault();
    scrollToHash(href);
  };
  const link = (href: string) => (standalone ? asset(href === '#top' ? '' : href) : href);

  return (
    <>
      <header
        className={`nav ${stuck ? 'nav--stuck glass' : ''} ${hidden && !menu ? 'nav--hidden' : ''} ${shown ? '' : 'nav--waiting'}`}
      >
        <a className="nav__brand glass" href={link('#top')} onClick={go('#top')} aria-label="BrandKnight — на главную">
          <i>BRK</i>
          BRAND KNIGHT
        </a>
        <nav className="nav__links glass" aria-label="Разделы">
          {nav.map((n) => (
            <a key={n.href} href={link(n.href)} onClick={go(n.href)} className={active === n.href ? 'is-on' : ''} aria-current={active === n.href ? 'true' : undefined}>
              {n.label}
            </a>
          ))}
        </nav>
        <DarkButton href={tgUrl()} place="header" className="nav__cta">
          {hero.navCta}
        </DarkButton>
        <button type="button" className="nav__menu" aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu((m) => !m)}>
          {menu ? 'Закрыть' : 'Меню'}
        </button>
      </header>

      <div id="mobile-menu" className={`menu scene ${menu ? 'is-open' : ''}`} aria-hidden={!menu} {...{ inert: menu ? undefined : '' }}>
        <div className="menu__light" aria-hidden />
        <div className="grain" />
        <nav className="menu__list" aria-label="Меню">
          {nav.map((n, i) => (
            <a
              key={n.href}
              href={link(n.href)}
              onClick={go(n.href)}
              className="t-head"
              style={{ transitionDelay: menu && !reducedMotion() ? `${200 + i * 50}ms` : '0ms' }}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="menu__foot">
          <LimeButton href={tgUrl()} place="menu" className="menu__tg">
            {hero.cta}
          </LimeButton>
          <a className="t-small menu__ig" href={instagram[0].url} target="_blank" rel="noopener">
            Instagram {instagram[0].handle}
          </a>
        </div>
      </div>
    </>
  );
}
