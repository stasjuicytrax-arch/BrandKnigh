// Вращающийся лаймовый бейдж «НАПИШИ НАМ •» (DESIGN.md v2 §2.7): текст по кругу, 14 с на оборот.
import { useId } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { tgUrl } from '@/data/site';
import { goal } from '@/lib/metrika';

export function Badge({ className = '', place = 'badge' }: { className?: string; place?: string }) {
  const id = useId().replace(/:/g, '');
  const href = tgUrl();
  return (
    <a
      className={`badge ${className}`}
      href={href}
      aria-label="Напиши нам в Telegram"
      onClick={() => href.includes('t.me/') && goal('tg_click', { place })}
    >
      <svg className="badge__ring" viewBox="0 0 132 132" aria-hidden>
        <defs>
          <path id={`c${id}`} d="M66 66m-52 0a52 52 0 1 1 104 0a52 52 0 1 1-104 0" />
        </defs>
        <circle cx="66" cy="66" r="64" fill="var(--color-lime)" />
        <text fontFamily="Unbounded, sans-serif" fontSize="11.5" fontWeight="700" letterSpacing="2.2">
          <textPath href={`#c${id}`}>НАПИШИ НАМ • НАПИШИ НАМ • НАПИШИ НАМ •</textPath>
        </text>
      </svg>
      <span className="badge__core" aria-hidden>
        <ArrowUpRight size={22} strokeWidth={2.4} />
      </span>
    </a>
  );
}
