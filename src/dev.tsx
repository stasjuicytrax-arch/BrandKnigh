// /dev — демо-страница компонентов 21st.dev (TZ.md §9, этап 2), адаптированных под токены.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GlassButton } from '@/components/GlassButton';
import { LiquidGlass } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { videoSrc, videos } from '@/data/videos';
import './styles/index.css';

function Backdrop({ id, dark = false }: { id: string; dark?: boolean }) {
  return (
    <video
      className={`dev__bg ${dark ? 'dev__bg--dark' : ''}`}
      src={videoSrc(id, 'loop.mp4')}
      poster={videoSrc(id, 'poster.webp')}
      muted
      loop
      playsInline
      autoPlay
    />
  );
}

function Dev() {
  return (
    <main className="dev px-margin">
      <h1 className="t-head">Компоненты</h1>

      <section className="dev__block">
        <h2 className="t-lead">Apple Tahoe Liquid Glass Button · @jahed</h2>
        <p className="t-small dev__note">Пресеты glass-lime и glass-clear поверх живой афиши. В Chrome стекло преломляет, в Safari и Firefox работает матовый фолбэк.</p>
        <div className="dev__stage">
          <Backdrop id={videos[0].id} />
          <div className="dev__row">
            <GlassButton href="#" preset="lime" place="dev">Написать в Telegram</GlassButton>
            <GlassButton href="#" preset="clear" place="dev">Смотреть кейс</GlassButton>
          </div>
          <LiquidGlass material="clear" appearance="light" refraction={28} bezel={24} blur={2} saturation={1.4} brightness={1.05} className="dev__panel">
            <p className="t-small">MEG · 14 июня</p>
          </LiquidGlass>
        </div>
        <div className="dev__stage dev__stage--ink">
          <Backdrop id={videos[3].id} dark />
          <div className="dev__row">
            <GlassButton href="#" preset="lime" appearance="dark" place="dev">Заказать анимацию</GlassButton>
            <GlassButton href="#" preset="clear" appearance="dark" place="dev">Обсудить сайт</GlassButton>
          </div>
        </div>
      </section>

      <section className="dev__block">
        <h2 className="t-lead">Tilted Grid Hero · @ruixen.ui</h2>
        <p className="t-body dev__note">Ждём код компонента от заказчика (вкладка «Copy prompt» на 21st.dev).</p>
      </section>

      <section className="dev__block">
        <h2 className="t-lead">Circular Carousel · @nexus-ui</h2>
        <p className="t-body dev__note">Ждём код компонента от заказчика (вкладка «Copy prompt» на 21st.dev).</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Dev />
  </StrictMode>,
);
