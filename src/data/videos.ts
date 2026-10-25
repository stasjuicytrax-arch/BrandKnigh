// Видео-креативы. Файлы: public/assets/videos/<id>/{loop.mp4, full.mp4, poster.webp} (scripts/fetch-videos.mjs).
// cover — статичная обложка со старого сайта (пара проверена глазами 25.10.2026).
// title и tag заполняются на этапе 4 по надписям на обложках; не выдумывать.
// Нет на YouTube: A3px6Bh2qKM (приватный, обложка «39 KINGDOM x DJ TIARA»), TFC8hfCmBMc (удалён, обложка «AGILE 7 June»).
// Обложка №18 «AGILE 28 June» ссылалась на ролик PLATFORMA (a4FOjA_2OZQ) — ролик к ней не найден.
export type Video = { id: string; cover?: string; ratio: '9:16' | '16:9'; title?: string; tag?: 'Сторис' | 'Афиша' | 'Рекламный ролик' };

export const videos: Video[] = [
  // Новый креатив заказчика (TZ.md §2.3): первым в окне-в-строке, в сцене 4.3 и в карусели.
  { id: 'meg-14june', ratio: '9:16', title: 'MEG · 14 июня', tag: 'Сторис' },
  {
    "id": "5mK4kTPKZ9k",
    "cover": "assets/old-site/video-covers/3536-6533-__.jpg",
    "ratio": "9:16"
  },
  {
    "id": "Cjd1mTKGnKg",
    "cover": "assets/old-site/video-covers/6433-3139-Storys_2.jpg",
    "ratio": "9:16"
  },
  {
    "id": "a4FOjA_2OZQ",
    "cover": "assets/old-site/video-covers/3130-3661-2022-11-03_11-37-55.png",
    "ratio": "9:16"
  },
  {
    "id": "iSFW5vyqNzk",
    "cover": "assets/old-site/video-covers/3837-3362-2022-11-03_11-34-48.png",
    "ratio": "9:16"
  },
  {
    "id": "hytYXIRvD9I",
    "cover": "assets/old-site/video-covers/6535-3638-26_NOVEMBER_STORY.jpg",
    "ratio": "9:16"
  },
  {
    "id": "ksp6yT9WuCs",
    "cover": "assets/old-site/video-covers/3662-3763-Story.jpg",
    "ratio": "9:16"
  },
  {
    "id": "I9l8yuseP5k",
    "cover": "assets/old-site/video-covers/6435-3261-2022-11-03_11-32-40.png",
    "ratio": "9:16"
  },
  {
    "id": "j7Ne1skQVOI",
    "cover": "assets/old-site/video-covers/6633-3130-Story_3.jpg",
    "ratio": "9:16"
  },
  {
    "id": "UKuidKjLgM8",
    "cover": "assets/old-site/video-covers/3038-3036-2022-11-03_11-38-49.png",
    "ratio": "9:16"
  },
  {
    "id": "TcWjYh5Beak",
    "cover": "assets/old-site/video-covers/6161-6639-202_1.jpg",
    "ratio": "9:16"
  },
  {
    "id": "1OZbTFYGeYY",
    "cover": "assets/old-site/video-covers/6666-3565-Story.jpg",
    "ratio": "9:16"
  },
  {
    "id": "9_02SZ1zka8",
    "cover": "assets/old-site/video-covers/6232-6665-2022-11-03_11-42-27.png",
    "ratio": "9:16"
  },
  {
    "id": "Otghkgddruw",
    "cover": "assets/old-site/video-covers/3630-3238-Story.jpg",
    "ratio": "9:16"
  },
  {
    "id": "Kirhksw0rSU",
    "cover": "assets/old-site/video-covers/3831-3866-10_December_Story.jpg",
    "ratio": "9:16"
  },
  {
    "id": "IzKDan8OnLU",
    "cover": "assets/old-site/video-covers/6433-6564-S1.jpg",
    "ratio": "9:16"
  },
  {
    "id": "Hbskw-7cKGk",
    "cover": "assets/old-site/video-covers/3930-6235-Story_2.jpg",
    "ratio": "9:16"
  },
  {
    "id": "9dz9F80Y7A4",
    "cover": "assets/old-site/video-covers/3433-6333-Story_2_1.jpg",
    "ratio": "9:16"
  },
  {
    "id": "M31fCLsxFPA",
    "cover": "assets/old-site/video-covers/3637-3265-Story_5_1.jpg",
    "ratio": "9:16"
  },
  {
    "id": "vSQ7r3abWBU",
    "cover": "assets/old-site/video-covers/6565-6235-Story_1.jpg",
    "ratio": "9:16"
  },
  {
    "id": "GuzceAgOWbc",
    "cover": "assets/old-site/video-covers/3733-6131-G13_April_21.jpg",
    "ratio": "9:16"
  },
  {
    "id": "6D6m5GBEgL4",
    "cover": "assets/old-site/video-covers/6464-6533-Story_hb.jpg",
    "ratio": "9:16"
  }
];

/** Сторис для мокапа iPhone (Dropbox со старого сайта). */
export const phoneStories = ['video-5', 'video-story-3'];

export const videoSrc = (id: string, file: 'loop.mp4' | 'full.mp4' | 'poster.webp') => `${import.meta.env.BASE_URL}assets/videos/${id}/${file}`;
