// 4.10 Наши клиенты (референс NextWave — тёмная полоса): логотипы клиентов и партнёров без дублей,
// монохромно светлым на тёмном; раз в 2 с один логотип подсвечивается лаймом.
import { useEffect, useState } from 'react';
import { clients, partners } from '@/data/clients';
import { asset, reducedMotion } from '@/lib/env';

const ALL = [...clients, ...partners.filter((p) => !clients.some((c) => c.name === p.name))];

export function Clients() {
  const [lit, setLit] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    const t = setInterval(() => setLit((i) => (i + 1) % ALL.length), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <section id="clients" className="clients scene section" aria-labelledby="clients-h">
      <div className="clients__head">
        <h2 id="clients-h" className="t-head">Наши клиенты</h2>
        <p className="clients__count">
          <b>{clients.length}</b> клиентов и <b>{ALL.length - clients.length}</b> партнёров
        </p>
      </div>
      <ul className="clients__grid">
        {ALL.map((c, i) => (
          <li key={c.name} className={i === lit ? 'is-lit' : ''}>
            <img src={asset(c.logo)} alt={c.name} loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  );
}
