// Кнопки (рецепт жидкого стекла §5 + DESIGN.md v2 §7):
//  primary — сплошная лаймовая пилюля, справа круг со стрелкой (на hover поворот 45° и заливка ink);
//  dark    — то же, тёмная; glass — стеклянная пилюля поверх фото; ghost — контур.
// Главная кнопка никогда не стекло: стеклом она теряется.
import { ArrowUpRight, Play } from 'lucide-react';
import type { ReactNode } from 'react';
import { Glass } from '@/components/ui/liquid-glass';
import { goal } from '@/lib/metrika';
import { scrollToHash } from '@/lib/scroll';

type Variant = 'primary' | 'dark' | 'glass' | 'ghost';
type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  compact?: boolean;
  place?: string;
  className?: string;
  /** круг со стрелкой (по умолчанию у всех, кроме ghost) */
  arrow?: boolean;
  onClick?: () => void;
};

export function Button({ href, children, variant = 'primary', compact, place, className = '', arrow, onClick }: Props) {
  const external = href.startsWith('http');
  const withArrow = arrow ?? variant !== 'ghost';
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
      className={`btn btn--${variant} ${compact ? 'btn--compact' : ''} ${withArrow ? '' : 'btn--plain'} ${className}`}
      onClick={(e) => {
        if (href.includes('t.me/')) goal('tg_click', { place: place ?? 'unknown' });
        if (href.startsWith('#')) {
          e.preventDefault();
          scrollToHash(href);
        }
        onClick?.();
      }}
    >
      {variant === 'glass' && <Glass />}
      <span className="btn__label">{children}</span>
      {withArrow && (
        <span className="btn__arrow" aria-hidden>
          <ArrowUpRight size={compact ? 16 : 20} strokeWidth={1.6} />
        </span>
      )}
    </a>
  );
}

/** «Смотреть работы» с кругом-плеем, как в NextWave */
export function PlayLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="play-link"
      onClick={(e) => {
        if (href.startsWith('#')) {
          e.preventDefault();
          scrollToHash(href);
        }
      }}
    >
      <span className="play-link__circle" aria-hidden>
        <Play size={16} strokeWidth={2} />
      </span>
      {children}
    </a>
  );
}

/** Круглая кнопка-стрелка на карточках */
export function ArrowDot({ dark }: { dark?: boolean }) {
  return (
    <span className={`arrow-dot ${dark ? 'arrow-dot--dark' : ''}`} aria-hidden>
      <ArrowUpRight size={18} strokeWidth={1.8} />
    </span>
  );
}
