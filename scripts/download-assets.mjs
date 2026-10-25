// Скачивает все ассеты старого сайта brandknight.ru в public/assets/old-site/*
// Запуск из корня проекта:  node scripts/download-assets.mjs
// Node 18+. Повторный запуск пропускает уже скачанные файлы.
import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const manifest = JSON.parse(readFileSync(new URL('../content/assets-manifest.json', import.meta.url)));
const jobs = [];
for (const [group, items] of Object.entries(manifest.groups)) {
  for (const it of items) {
    jobs.push({ url: it.url, file: it.file });
    if (it.thumb) jobs.push({ url: it.thumb, file: `public/assets/old-site/youtube-thumbs/${it.youtube}.jpg`, fallback: `https://i.ytimg.com/vi/${it.youtube}/hqdefault.jpg` });
  }
}

let ok = 0, skip = 0, fail = [];
async function get(job) {
  if (existsSync(job.file)) { skip++; return; }
  mkdirSync(dirname(job.file), { recursive: true });
  for (const url of [job.url, job.fallback].filter(Boolean)) {
    try {
      const r = await fetch(url, { redirect: 'follow' });
      if (!r.ok) continue;
      writeFileSync(job.file, Buffer.from(await r.arrayBuffer()));
      ok++; return;
    } catch {}
  }
  fail.push(job.url);
}
const q = [...new Map(jobs.map((j) => [j.file, j])).values()];
await Promise.all(Array.from({ length: 6 }, async () => { while (q.length) await get(q.shift()); }));
console.log(`скачано: ${ok}, уже были: ${skip}, ошибок: ${fail.length}`);
if (fail.length) console.log(fail.join('\n'));
