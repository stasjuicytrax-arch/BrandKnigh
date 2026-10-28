// Кнопки DESIGN.md v2 §7: лаймовая и тёмная пилюли со стрелкой в круге, контурная пилюля.
// Главные CTA поверх 3D и медиа — лаймовая на Apple Tahoe Liquid Glass (21st.dev @jahed, TZ.md §3.5).
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { LiquidGlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { goal } from '@/lib/metrika';
import { scrollToHash } from '@/lib/scroll';

type Base = { href: string; children: ReactNode; place?: string; className?: string; onClick?: () => void };

export function ArrowCircle({ className = '' }: { className?: string }) {
  return (
    <span className={`arrow ${className}`} aria-hidden>
      <ArrowUpRight size={16} strokeWidth={2.4} />
    </span>
  );
}

function linkProps({ href, place, onClick }: Base) {
  const external = href.startsWith('http');
  return {
    href,
    target: external ? '_blank' : undefined,
    rel: external ? 'noopener' : undefined,
    onClick: (e: React.MouseEvent) => {
      if (href.includes('t.me/')) goal('tg_click', { place: place ?? 'unknown' });
      if (href.startsWith('#')) {
        e.preventDefault();
        scrollToHash(href);
      }
      onClick?.();
    },
  };
}

/** Лаймовая пилюля. glass — материал Liquid Glass с лаймовым тоном (для CTA поверх сцены). */
export function LimeButton(props: Base & { glass?: boolean }) {
  const inner = (
    <>
      {props.children}
      <ArrowCircle />
    </>
  );
  if (!props.glass) {
    return (
      <a className={`btn btn--lime ${props.className ?? ''}`} {...linkProps(props)}>
        {inner}
      </a>
    );
  }
  return (
    <LiquidGlassButton
      asChild
      interactive
      material="clear"
      appearance="light"
      refraction={28}
      bezel={24}
      blur={2}
      saturation={1.4}
      brightness={1.05}
      fallbackBlur={10}
      tint="#d2ff1f"
      data-glass-preset="lime"
      className={`btn btn--lime btn--glass ${props.className ?? ''}`}
    >
      <a {...linkProps(props)}>{inner}</a>
    </LiquidGlassButton>
  );
}

export function DarkButton(props: Base) {
  return (
    <a className={`btn btn--dark ${props.className ?? ''}`} {...linkProps(props)}>
      {props.children}
      <ArrowCircle />
    </a>
  );
}

export function GhostButton(props: Base) {
  return (
    <a className={`btn btn--ghost ${props.className ?? ''}`} {...linkProps(props)}>
      {props.children}
    </a>
  );
}
