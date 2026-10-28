// Страница /policy (TZ.md §4.14): текст со старого сайта в той же типографике, футер без 3D.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Header } from '@/components/Header';
import { policy, policyTitle } from '@/data/policy';
import './styles/index.css';

function Policy() {
  return (
    <>
      <Header standalone />
      <main className="policy container">
        <h1 className="t-head">Политика конфиденциальности</h1>
        <p className="t-lead policy__sub">{policyTitle}</p>
        <div className="policy__body">
          {policy.map((b, i) =>
            b.type === 'h' ? (
              <h2 key={i} className="t-lead">{b.text}</h2>
            ) : (
              <p key={i} className="t-body">{b.text}</p>
            ),
          )}
        </div>
      </main>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Policy />
  </StrictMode>,
);
