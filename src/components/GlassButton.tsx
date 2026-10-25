// Главная кнопка (DESIGN.md §6, §9): LiquidGlassButton с пресетами glass-lime и glass-clear.
// Всегда ссылка (<a>): ведёт в Telegram или к якорю. Клик в Telegram шлёт цель tg_click с местом.
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { LiquidGlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { goal } from '@/lib/metrika';

type Props = {
  href: string;
  children: ReactNode;
  preset?: 'lime' | 'clear';
  /** Метка места для Метрики (hero, header, menu…) */
  place?: string;
  className?: string;
  appearance?: 'light' | 'dark';
  arrow?: boolean;
};

const PRESET = {
  // glass-clear: refraction 28, bezel 24, blur 2, saturation 1.4, brightness 1.05
  clear: { refraction: 28, bezel: 24, blur: 2, saturation: 1.4, brightness: 1.05 },
  // glass-lime: тот же материал, свет внутри тонирован лаймом
  lime: { refraction: 28, bezel: 24, blur: 2, saturation: 1.4, brightness: 1.05, tint: '#d2ff1f' },
} as const;

export function GlassButton({ href, children, preset = 'lime', place, className = '', appearance = 'light', arrow = true }: Props) {
  const external = href.startsWith('http');
  return (
    <LiquidGlassButton
      asChild
      interactive
      material="clear"
      appearance={appearance}
      fallbackBlur={10}
      size="default"
      {...PRESET[preset]}
      data-glass-preset={preset}
      className={`glass-btn h-12! px-7! py-0! md:h-14! md:px-8! ${className}`}
    >
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener' : undefined}
        onClick={() => {
          if (href.includes('t.me/')) goal('tg_click', { place: place ?? 'unknown' });
        }}
      >
        <span className="glass-btn__label">{children}</span>
        {arrow && <ArrowUpRight aria-hidden size={20} strokeWidth={1.75} />}
      </a>
    </LiquidGlassButton>
  );
}
