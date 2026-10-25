// Скачивает видео-креативы с YouTube (yt-dlp) и перекодирует их по TZ.md §2.
// Запуск из корня проекта:  node scripts/fetch-videos.mjs
// Нужны: python -m yt_dlp, ffmpeg и ffprobe в PATH. Исходники кладутся в .cache/videos-raw/ (не в git).
// Результат: public/assets/videos/<id>/{loop.mp4, full.mp4, poster.webp} и content/videos-meta.json.
import { readFileSync, mkdirSync, existsSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const manifest = JSON.parse(readFileSync(new URL('../content/assets-manifest.json', import.meta.url)));
const RAW = '.cache/videos-raw';
const OUT = 'public/assets/videos';
mkdirSync(RAW, { recursive: true });

// Новый креатив заказчика (TZ.md §2.3): идёт первым везде.
const sources = [{ id: 'meg-14june', file: 'MEG_14June_story_v2.mp4' }];
const seen = new Set();
for (const v of manifest.groups.videos) {
  if (seen.has(v.youtube)) continue;
  seen.add(v.youtube);
  sources.push({ id: v.youtube, youtube: v.youtubeUrl, cover: v.file, order: v.order });
}
for (const name of ['video-5', 'video-story-3']) {
  sources.push({ id: name, file: `public/assets/old-site/video-mp4/${name}.mp4` });
}

const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();

function download(src) {
  if (src.file) return { file: src.file, title: '' };
  const have = readdirSync(RAW).find((f) => f.startsWith(src.id + '.') && !f.endsWith('.part'));
  let title = '';
  try { title = run('python', ['-m', 'yt_dlp', '--js-runtimes', 'node', '--skip-download', '--print', 'title', src.youtube]).trim(); } catch {}
  if (have) return { file: `${RAW}/${have}`, title };
  run('python', ['-m', 'yt_dlp', '--js-runtimes', 'node', '-q', '--no-playlist', '-f', 'bv*[height<=1920]+ba/b',
    '--merge-output-format', 'mp4', '-o', `${RAW}/${src.id}.%(ext)s`, src.youtube]);
  const got = readdirSync(RAW).find((f) => f.startsWith(src.id + '.') && !f.endsWith('.part'));
  return { file: `${RAW}/${got}`, title };
}

function probe(file) {
  const j = JSON.parse(run('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file]));
  const v = j.streams.find((s) => s.codec_type === 'video');
  let w = v.width, h = v.height;
  const rot = Number(v.tags?.rotate ?? v.side_data_list?.find((d) => d.rotation !== undefined)?.rotation ?? 0);
  if (Math.abs(rot) === 90) [w, h] = [h, w];
  return { w, h, duration: Number(j.format.duration), audio: j.streams.some((s) => s.codec_type === 'audio') };
}

const ff = (args) => run('ffmpeg', ['-y', '-v', 'error', ...args]);
const fit = (w, h) => `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},setsar=1`;

const meta = [];
for (const src of sources) {
  try {
    const { file, title } = download(src);
    const p = probe(file);
    const vertical = p.h >= p.w;
    const ratio = vertical ? '9:16' : '16:9';
    const [lw, lh] = vertical ? [540, 960] : [960, 540];
    const [fw, fh] = vertical ? [720, 1280] : [1280, 720];
    const dir = `${OUT}/${src.id}`;
    mkdirSync(dir, { recursive: true });
    const loopLen = Math.min(8, Math.max(6, p.duration)).toFixed(2);
    if (!existsSync(`${dir}/loop.mp4`)) ff(['-i', file, '-t', loopLen, '-an', '-vf', fit(lw, lh), '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p', '-crf', '28', '-preset', 'veryfast', '-movflags', '+faststart', `${dir}/loop.mp4`]);
    if (!existsSync(`${dir}/full.mp4`)) ff(['-i', file, '-vf', fit(fw, fh), '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
      '-crf', '24', '-preset', 'veryfast', ...(p.audio ? ['-c:a', 'aac', '-b:a', '128k'] : ['-an']),
      '-movflags', '+faststart', `${dir}/full.mp4`]);
    if (!existsSync(`${dir}/poster.webp`)) ff(['-ss', String(Math.min(1, p.duration / 2)), '-i', file, '-frames:v', '1',
      '-vf', fit(lw, lh), '-c:v', 'libwebp', '-quality', '82', `${dir}/poster.webp`]);
    const sizes = Object.fromEntries(['loop.mp4', 'full.mp4', 'poster.webp'].map((f) => [f, statSync(`${dir}/${f}`).size]));
    const tooBig = Object.entries(sizes).filter(([, s]) => s > 25 * 1024 * 1024).map(([f]) => f);
    meta.push({ id: src.id, order: src.order ?? null, youtube: src.youtube ?? null, cover: src.cover ?? null,
      title, ratio, source: `${p.w}x${p.h}`, duration: Math.round(p.duration * 10) / 10, audio: p.audio, sizes, tooBig });
    console.log(`ok  ${src.id}  ${ratio}  ${p.duration.toFixed(1)}s  ${title}${tooBig.length ? '  >25MB: ' + tooBig : ''}`);
  } catch (e) {
    meta.push({ id: src.id, error: String(e.stderr || e.message).slice(0, 300) });
    console.log(`ERR ${src.id}  ${String(e.stderr || e.message).slice(0, 200)}`);
  }
}
writeFileSync('content/videos-meta.json', JSON.stringify(meta, null, 2) + '\n');
console.log(`готово: ${meta.filter((m) => !m.error).length}/${meta.length}`);
