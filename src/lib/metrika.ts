// Цели Яндекс.Метрики (счётчик подключён в index.html). TZ.md §1.
import { metrikaId } from '@/data/site';

type Goal = 'tg_click' | 'form_submit' | 'video_open' | 'case_open';

export function goal(name: Goal, params?: Record<string, string>) {
  const ym = (window as unknown as { ym?: (...a: unknown[]) => void }).ym;
  ym?.(metrikaId, 'reachGoal', name, params);
}
