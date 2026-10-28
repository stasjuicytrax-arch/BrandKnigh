// Шапка (референс NextWave + рецепт жидкого стекла): логотип · пилюля ссылок (активная лаймовая) ·
// тёмная кнопка «Написать нам». Сверху страницы — без подложки; после первого экрана — одна стеклянная
// полоса; при скролле вниз прячется, вверх появляется. Телефон: логотип + «Меню» (полноэкранное меню).
import { useEffect, useState } from 'react';
import { Button } from './Buttons';
import { Glass } from '@/components/ui/liquid-glass';
import { hero, instagram, nav, tgUrl } from '@/data/site';
import { asset, reducedMotion } from '@/lib/env';
import { scrollToHash } from '@/lib/scroll';

export function Header({ standalone = false }: { standalone?: boolean }) {
  const [stuck, setStuck] = useState(standalone);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('#top');

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setStuck(standalone || y > 40);
      if (y < last - 2 || y < window.innerHeight) setHidden(false);
      else if (y > last + 2) setHidden(true);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [standalone]);

  // активный пункт: секция в середине экрана
  useEffect(() => {
    if (standalone) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    nav.forEach((n) => {
      const el = document.getElementById(n.href.slice(1));
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
      <header className={`nav ${stuck ? 'nav--stuck' : ''} ${hidden && !menu ? 'nav--hidden' : ''}`}>
        <div className="nav__bar container">
          <Glass />
          <a className="nav__brand" href={link('#top')} onClick={go('#top')} aria-label="BrandKnight — на главную">
            <i>BRK</i>
            BrandKnight
          </a>
          <nav className="nav__links" aria-label="Разделы">
            {nav.map((n) => (
              <a key={n.href} href={link(n.href)} onClick={go(n.href)} className={active === n.href ? 'is-on' : ''} aria-current={active === n.href ? 'true' : undefined}>
                {n.label}
              </a>
            ))}
          </nav>
          <Button href={tgUrl()} variant="dark" compact place="header" className="nav__cta">
            {hero.navCta}
          </Button>
          <button type="button" className="nav__menu" aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu((m) => !m)}>
            {menu ? 'Закрыть' : 'Меню'}
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`menu ${menu ? 'is-open' : ''}`} aria-hidden={!menu} {...{ inert: menu ? undefined : '' }}>
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
          <Button href={tgUrl()} place="menu" className="menu__tg">
            {hero.cta}
          </Button>
          <a className="menu__ig" href={instagram[0].url} target="_blank" rel="noopener">
            Instagram {instagram[0].handle}
          </a>
        </div>
      </div>
    </>
  );
}
