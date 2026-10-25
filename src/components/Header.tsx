// Шапка (TZ.md §3.2). Слот логотипа на первом экране пуст: туда прилетает 3D-рыцарь.
// После 100vh — стеклянная полоса glass-clear; вниз прячется, вверх появляется.
import { useEffect, useRef, useState } from 'react';
import { GlassButton } from './GlassButton';
import { LiquidGlass } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { instagram, nav, tgUrl, hero } from '@/data/site';
import { asset, reducedMotion } from '@/lib/env';
import { scrollToHash } from '@/lib/scroll';
import { emitFlight, flight, onFlight } from '@/three/flight';

export function Header({ standalone = false }: { standalone?: boolean }) {
  const slot = useRef<HTMLAnchorElement>(null);
  const [landed, setLanded] = useState(standalone);
  const [glass, setGlass] = useState(standalone);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);

  // слот логотипа сообщает сцене свои экранные координаты
  useEffect(() => {
    if (standalone) return;
    const measure = () => {
      const r = slot.current?.getBoundingClientRect();
      if (!r) return;
      flight.target = { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width };
      emitFlight();
    };
    measure();
    window.addEventListener('resize', measure);
    const off = onFlight(() => setLanded(flight.progress >= 0.999));
    return () => {
      window.removeEventListener('resize', measure);
      off();
    };
  }, [standalone]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setGlass(standalone || y > window.innerHeight * 0.98);
      // прятать только после посадки рыцаря с запасом, чтобы посадку было видно
      setHidden(y > window.innerHeight * 1.6 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [standalone]);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', menu);
  }, [menu]);

  const go = (href: string) => (e: React.MouseEvent) => {
    if (standalone || !href.startsWith('#')) return;
    e.preventDefault();
    setMenu(false);
    scrollToHash(href);
  };
  const home = standalone ? asset('') : '#top';

  return (
    <>
      <header className={`site-header ${hidden && !menu ? 'site-header--hidden' : ''}`}>
        <LiquidGlass
          material="clear"
          appearance="light"
          refraction={20}
          bezel={16}
          blur={2}
          saturation={1.4}
          fallbackBlur={14}
          className={`site-header__glass ${glass ? 'is-on' : ''}`}
          aria-hidden
        />
        <div className="site-header__row px-margin">
          <a ref={slot} href={home} onClick={go('#top')} className="site-header__logo" aria-label="BrandKnight — на главную">
            <img src={asset('brk.svg')} alt="" className={landed ? 'is-on' : ''} />
          </a>
          <nav className="site-header__nav t-small" aria-label="Разделы">
            {nav.map((n) => (
              <a key={n.href} href={standalone ? asset(n.href) : n.href} onClick={go(n.href)}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="site-header__cta">
            <GlassButton href={tgUrl()} place="header" className="h-11! px-5!">
              {hero.cta}
            </GlassButton>
          </div>
          <button
            type="button"
            className="site-header__menu t-small"
            aria-expanded={menu}
            aria-controls="mobile-menu"
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? 'Закрыть' : 'Меню'}
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${menu ? 'is-open' : ''}`} aria-hidden={!menu} {...{ inert: menu ? undefined : '' }}>
        <nav className="mobile-menu__list" aria-label="Меню">
          {nav.map((n, i) => (
            <a
              key={n.href}
              href={standalone ? asset(n.href) : n.href}
              onClick={go(n.href)}
              className="t-head"
              style={{ transitionDelay: menu && !reducedMotion() ? `${200 + i * 50}ms` : '0ms' }}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="mobile-menu__foot">
          <GlassButton href={tgUrl()} place="menu" className="w-full">
            {hero.cta}
          </GlassButton>
          <a className="link-u t-small" href={instagram[0].url} target="_blank" rel="noopener">
            Instagram {instagram[0].handle}
          </a>
        </div>
      </div>
    </>
  );
}
