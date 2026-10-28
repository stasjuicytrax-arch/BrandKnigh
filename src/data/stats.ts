// Счётчики (DESIGN.md v2 §7): только реальные числа, считаются из данных, руками не вписываются.
import { cases } from './cases';
import { clients } from './clients';
import { phoneStories, videos } from './videos';

/** Русское множественное: plural(24, ['креатив', 'креатива', 'креативов']) */
export function plural(n: number, [one, few, many]: [string, string, string]) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

const videoCount = videos.length + phoneStories.length;

export const stats = [
  { value: videoCount, label: plural(videoCount, ['видео-креатив', 'видео-креатива', 'видео-креативов']) },
  { value: cases.length, label: plural(cases.length, ['сайт', 'сайта', 'сайтов']) },
  { value: clients.length, label: plural(clients.length, ['клиент', 'клиента', 'клиентов']) },
];
