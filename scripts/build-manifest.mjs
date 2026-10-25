// Generates content/assets-manifest.json from the inventory scraped from brandknight.ru (25.10.2026).
// Run once; the output is committed. Not needed at build time.
import { writeFileSync } from 'node:fs';

const T = 'https://static.tildacdn.com/';
const g = (group, list) => list.map((p) => {
  const [dir, name] = p.split('/');
  return { group, url: T + p, file: `public/assets/old-site/${group}/${dir.slice(4, 13)}-${name.replace(/[^A-Za-z0-9._-]/g, '_')}` };
});

const brand = g('brand', [
  'tild3734-3530-4564-b835-383737326264/BRK_White.svg',
  'tild3330-6235-4138-b266-633739313739/BRK_White.svg',
  'tild6430-3934-4661-b433-376337396632/BRK_White_1.svg',
  'tild6137-6138-4236-a264-656638636135/Brk_png.png',
  'tild6233-6236-4038-b738-666363343935/Brk_png.png',
  'tild3464-3562-4131-b166-613638326362/Brk_png.png',
  'tild3165-3363-4264-a436-346334386161/_1.svg',
  'tild3633-3532-4535-a534-386336353665/_4_1.svg',
  'tild3232-3736-4866-b734-643938356136/Group_6757669.svg',
  'tild6637-3135-4536-b136-336330323638/_Png.png',
]);

const services = g('services-icons', [
  'tild3436-3264-4836-a563-323539646166/Group_7.png',
  'tild3431-3135-4639-b466-633339326534/Group_8_2.png',
  'tild6363-3662-4135-b839-323733373663/Group_9.png',
  'tild3162-6133-4931-a536-613535393765/Group_10.png',
  'tild6331-6136-4732-b732-323564353764/Group_11.png',
  'tild6462-3730-4539-a535-396365633230/Group_12.png',
]);

const hero = g('hero', [
  'tild6638-6636-4330-b465-636636616332/Frame_6757777.jpg',
  'tild3538-3934-4235-b033-323432353337/9a0b7518394679965492.jpg',
  'tild3431-3763-4233-a332-356538306131/64b890d6-7a4b-45eb-8.png',
  'tild3036-3062-4232-a463-646239353238/photo.png',
  'tild6430-6130-4938-b634-316234643162/photo.png',
  'tild6361-3830-4232-b034-653465363737/Stylish_iPhone_16_Pr.png',
  'tild3266-6364-4237-b337-353830663930/FOR_E__1.jpg',
  'tild3361-6233-4362-b166-363932363530/S1_1.jpg',
  'tild3766-6333-4361-b462-323264643161/12.jpg',
  'tild3961-6237-4537-b632-356135366531/Frame_6758287.png',
  'tild3531-6263-4462-a630-393530366431/Frame_6757786.png',
  'tild3837-6663-4337-b865-626332353666/noise.gif',
]);

// Static posters / stories (block «статичные креативы», 9:16)
const posters = g('posters-static', [
  'tild6436-3464-4134-a239-616464353163/S1.jpg',
  'tild6332-6132-4630-b830-306565663364/DJ_Meg_-_24_May.jpg',
  'tild6464-3930-4061-a261-323331613731/31_MAY_-_CHEROCKY.jpg',
  'tild6466-3462-4831-a566-643435393163/Story_2_2.jpg',
  'tild6463-6330-4664-a136-363062333937/S11.jpg',
  'tild3134-3266-4132-b835-646266316162/Story_2.jpg',
  'tild3032-3836-4463-a264-306566656264/Smile_story.jpg',
  'tild3533-6235-4934-b930-626663363832/Story_1.jpg',
  'tild3936-3339-4232-a136-666632353537/_1.jpg',
  'tild6231-6264-4265-a532-373638613262/G13_April_21.jpg',
  'tild6539-6339-4533-b939-366466343965/Story_4.jpg',
  'tild6361-3532-4238-b930-376131373362/Batumi_new_season__9.jpg',
  'tild6636-3331-4166-b463-373663633831/Story_5.jpg',
  'tild6165-3866-4164-a665-333734373964/Story.jpg',
  'tild6132-3630-4764-b834-303237343235/Story_1_2.jpg',
  'tild3232-3933-4639-b632-326436616438/_1_1.jpg',
  'tild3062-3039-4832-a138-383732613431/_____.jpg',
  'tild3433-6661-4661-b363-333534343933/Gothic_carnival_3.jpg',
  'tild3966-3234-4332-a639-356634303938/Story_3_1.jpg',
  'tild3564-3261-4635-b436-333835643163/Story_3_2.jpg',
]);

// Video creatives (animated posters): cover image + YouTube id, in page order
const videoPairs = [
  ['tild3536-6533-4538-a639-396463383734/__.jpg', '5mK4kTPKZ9k'],
  ['tild6433-3139-4765-b332-366239626332/Storys_2.jpg', 'Cjd1mTKGnKg'],
  ['tild3130-3661-4132-a435-616463396536/2022-11-03_11-37-55.png', 'a4FOjA_2OZQ'],
  ['tild3837-3362-4531-b838-386138333730/2022-11-03_11-34-48.png', 'iSFW5vyqNzk'],
  ['tild3737-6237-4161-a432-613230316334/2022-11-03_11-43-56.png', 'A3px6Bh2qKM'],
  ['tild6535-3638-4631-a335-613730636663/26_NOVEMBER_STORY.jpg', 'hytYXIRvD9I'],
  ['tild3662-3763-4131-a330-366434653536/Story.jpg', 'ksp6yT9WuCs'],
  ['tild6435-3261-4031-b037-316462306638/2022-11-03_11-32-40.png', 'I9l8yuseP5k'],
  ['tild6633-3130-4936-b536-323332626531/Story_3.jpg', 'j7Ne1skQVOI'],
  ['tild3038-3036-4464-b134-333730303764/2022-11-03_11-38-49.png', 'UKuidKjLgM8'],
  ['tild6161-6639-4362-a138-636439376363/202_1.jpg', 'TcWjYh5Beak'],
  ['tild6666-3565-4230-b930-353031656133/Story.jpg', '1OZbTFYGeYY'],
  ['tild6232-6665-4332-b233-376131396131/2022-11-03_11-42-27.png', '9_02SZ1zka8'],
  ['tild3630-3238-4632-b730-626637313435/Story.jpg', 'Otghkgddruw'],
  ['tild3831-3866-4739-b139-356136373139/10_December_Story.jpg', 'Kirhksw0rSU'],
  ['tild6433-6564-4638-b937-333332346635/S1.jpg', 'IzKDan8OnLU'],
  ['tild3231-3766-4262-b834-383834383665/Batumi_new_season__1.jpg', 'TFC8hfCmBMc'],
  ['tild6361-3139-4935-b937-303030316634/Story_5.jpg', 'a4FOjA_2OZQ'],
  ['tild3930-6235-4165-a562-323064386532/Story_2.jpg', 'Hbskw-7cKGk'],
  ['tild3433-6333-4863-b833-653161363436/Story_2_1.jpg', '9dz9F80Y7A4'],
  ['tild3637-3265-4363-a635-666133386461/Story_5_1.jpg', 'M31fCLsxFPA'],
  ['tild6565-6235-4339-a564-316363353238/Story_1.jpg', 'vSQ7r3abWBU'],
  ['tild3733-6131-4565-b732-623663626637/G13_April_21.jpg', 'GuzceAgOWbc'],
  ['tild6464-6533-4431-b738-366433316266/Story_hb.jpg', '6D6m5GBEgL4'],
  ['tild6265-6133-4234-a362-366231643863/List.png', 'A3px6Bh2qKM'],
];
// NB: cover→video pairing follows DOM order of the Tilda zero-block; verify visually after download.
const videos = videoPairs.map(([p, id], i) => ({
  ...g('video-covers', [p])[0],
  youtube: id,
  youtubeUrl: `https://www.youtube.com/watch?v=${id}`,
  thumb: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
  order: i + 1,
}));

const mp4 = [
  ['qvino.mp4', 'https://dl.dropboxusercontent.com/scl/fi/x2gszp9hi4k01bwgfo6i0/qvino.mp4?rlkey=p0s5k0m6vjzs5s7t7rbdrhmoz&dl=1', 'фон блока услуг'],
  ['video-5.mp4', 'https://dl.dropboxusercontent.com/scl/fi/dx45i44g3uee2c3xgmcv0/Video-5.mp4?rlkey=jq6wf6llsbwyhl4q18fzhjix1&dl=1', 'сторис в мокапе iPhone (блок «видео креативы»)'],
  ['video-story-3.mp4', 'https://dl.dropboxusercontent.com/scl/fi/6d63rglxiz5s3emdyg0ul/Video-Story-3.mp4?rlkey=hxua3fclh589oirgiqwzbl21d&dl=1', 'сторис в мокапе iPhone (блок «видео креативы»)'],
  ['2.mp4', 'https://dl.dropboxusercontent.com/scl/fi/w1ldc173i6m5ksbkc4bmt/2.mp4?rlkey=rtehip4toc0dj1i4rk6bk6mks&dl=1', 'фон после видео-креативов'],
  ['3.mp4', 'https://dl.dropboxusercontent.com/scl/fi/r8pdjknfsyl43gxtaz5ng/3.mp4?rlkey=exu5syh1fbb5n9zdh50pahydw&dl=1', 'фон блока контактов'],
].map(([name, url, note]) => ({ group: 'video-mp4', url, file: `public/assets/old-site/video-mp4/${name}`, note }));

// Websites block: screenshot ↔ case (order of the Tilda block)
const siteShots = [
  ['tild6464-6139-4232-a166-643338646639/2026-06-26_18-52-34.png', 'https://help-wedding.ru/', 'keep'],
  ['tild3331-3936-4037-b162-623463633565/2022-10-31_14-50-21.png', 'https://www.school-xyz.com', 'keep'],
  ['tild6330-6131-4031-b464-656663323862/2022-10-31_15-17-42.png', 'https://welldone.green/', 'keep'],
  ['tild3232-3330-4365-b238-323339363034/2022-11-03_17-31-54.png', 'https://dinamo-school.ru/', 'keep'],
  ['tild6137-6261-4632-a530-356136366661/2023-10-01_23-32-29.png', 'https://bimtara.ru/', 'keep'],
  ['tild3763-3633-4337-b465-663065313237/2022-10-31_15-26-27.png', 'http://sinoptikwear.com', 'REMOVE'],
  ['tild6430-3032-4334-a364-363166656665/2022-12-02_14-52-00.png', 'https://lp.synergy.ru/unmanned-technology', 'keep'],
  ['tild6630-6330-4663-b632-303531656463/2025-10-01_16-44-57.png', 'https://wapagency.ru/', 'keep'],
  ['tild3730-3661-4030-b837-363234393761/2026-06-15_15-57-26.png', 'https://filatova-tour.com/ (svetspace)', 'REMOVE'],
  ['tild6131-6532-4664-b563-663432383338/2023-09-29_18-33-15.png', 'https://citiwell.ru/', 'keep'],
  ['tild6361-3866-4239-a534-383636303166/2023-12-12_13-49-09.png', 'https://msk.brkwood.ru/', 'keep'],
  ['tild6133-3865-4065-b539-333532323937/2026-06-15_16-00-06.png', 'https://kampika.com/ (rebelway)', 'REMOVE'],
  ['tild3239-3639-4135-a637-323364383439/2024-03-03_23-43-50.png', 'https://nichegolishnego.shop/', 'keep'],
];
const sites = siteShots.map(([p, site, status]) => ({ ...g('sites', [p])[0], site, status }));

const clients = g('clients', [
  'tild3061-6636-4337-b233-626537313664/CV.png',
  'tild3734-3534-4337-b535-663934393562/SVET_WHITE_PNG.png',
  'tild3835-6432-4731-b234-623336653639/Logo__White.png',
  'tild3630-6439-4736-b732-636239623537/1.png',
  'tild3030-6535-4661-b962-353831636637/5.png',
  'tild6564-3065-4132-b733-613365393561/_3_1.png',
  'tild6436-3265-4762-b266-656265646131/smallsize_on_transpa.png',
  'tild3633-3333-4438-b961-316162623338/RIFZA_png.png',
  'tild3535-6235-4735-b862-343864646335/Logo_Png__2.png',
  'tild3363-3031-4362-a433-626530303339/pngegg_3.png',
  'tild6231-6335-4238-b135-303465373039/Logo_2.png',
  'tild6266-6337-4337-b265-643761313130/4.png',
  'tild6333-6638-4238-b932-346161653834/logo.svg',
  'tild3162-3230-4962-a164-383365633535/Lukoil_logo-1068x601.png',
  'tild3664-6531-4164-a635-393937336530/_-1.png',
  'tild3362-6136-4164-b234-646365303032/MALogo.png',
]);

// Second gallery (T603, linked from services menu): logos / identity / print
const identity = g('identity-gallery', [
  'tild3538-6537-4262-b233-383833326536/_2.jpg',
  'tild3532-3336-4765-b766-323236323962/_F.jpg',
  'tild3830-3139-4233-b261-353730653030/A1_2.jpg',
  'tild3666-3564-4261-b335-303333343936/279144508_5070921246.webp',
  'tild3739-3132-4432-a338-366433363432/239364988_3491209834.jpg',
  'tild6166-6663-4863-a233-323561333961/Square.jpg',
  'tild6664-3437-4366-b862-336333386336/26_NOVEMBER.jpg',
  'tild6461-3863-4835-b961-393438633332/166746de425a1253c09e.jpg',
]);

const character = g('brand-character', [
  'tild6363-3430-4333-b265-666164336664/PSD__.png',
  'tild6330-6661-4565-a665-636235663739/_.PNG',
]);

const partnersStrip = g('partners-strip', [
  'tild3034-3938-4433-b963-663037303063/1.png',
  'tild3233-6137-4164-b265-346233626134/2.png',
  'tild3037-6639-4731-b465-623932623339/3.png',
  'tild3762-3462-4134-a439-333964333638/4.png',
  'tild3834-3631-4534-a662-633439646430/52.png',
  'tild3963-6232-4565-b330-633136306561/LOGO_2019_WHITE.png',
]);

const misc = g('misc', [
  'tild6465-6465-4633-a232-616336316430/icons8-instagram-240.png',
  'tild3139-3961-4739-b264-346464313264/left_bold2.svg',
  'tild3338-3063-4961-b836-366435373836/right_bold2.svg',
]);

const manifest = {
  source: 'https://brandknight.ru/',
  scrapedAt: '2026-10-25',
  note: 'Все файлы старого сайта. Скачать: node scripts/download-assets.mjs (нужен обычный интернет).',
  groups: { brand, hero, services, posters, videos, mp4, sites, clients, identity, character, partnersStrip, misc },
};
writeFileSync(new URL('../content/assets-manifest.json', import.meta.url), JSON.stringify(manifest, null, 2));
const n = Object.values(manifest.groups).reduce((a, x) => a + x.length, 0);
console.log('manifest entries:', n);
