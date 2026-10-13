import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const key = process.env.OPENROUTER_API_KEY;
const model = process.env.OPENROUTER_IMAGE_MODEL || 'google/gemini-2.5-flash-image';
const outDir = join(process.cwd(), 'uploads/templates/anor');
const sampleDir = join(process.cwd(), '../sample-book/anor');
mkdirSync(outDir, { recursive: true });
mkdirSync(sampleDir, { recursive: true });

const STYLE = `Brand-new children's picture-book page. Do not copy any existing book.

FORMAT: portrait canvas 3:4 (taller than wide), full bleed to the edges, NO white frame, NO white borders, no letterboxing, NO TEXT, no letters, no watermark.
Layout: top ~72% illustration, bottom ~28% EMPTY cream parchment band.

FACE (critical): SEMI-REALISTIC painted portrait of a 5-year-old Central Asian child.
Accurate anatomy: real eye shape with eyelids and catchlights, real nose, real lips, natural skin, individual hair strands.
Face LARGE — at least one-third of the illustration height, close-up, features clearly readable.
NOT cartoon, NOT Disney, NOT chibi, NOT anime, NOT round simplified baby face.
Exactly ONE child. Neutral linen shirt, no doppa/skullcap.

Setting: Uzbekistan pomegranate garden, dusk, warm lantern light, clay walls, mountains far away.
Painterly gouache, rich color, cinematic lighting.`;

const pages = [
  {
    file: 'page-01-cover.jpg',
    prompt: `${STYLE}

SCENE: COVER. Child faces the camera, head-and-shoulders plus lantern in both hands. Face is the focal point. Behind: pomegranate trees with red fruit, first evening stars, golden dusk. Soft smile, calm eyes.`,
  },
  {
    file: 'page-02-fruit.jpg',
    prompt: `${STYLE}

SCENE: Same child as the reference image (keep the same face). 3/4 close-up. Child opens a split pomegranate; a tiny warm star-glow shines inside the fruit. Face still large and readable. Wonder in the eyes. Garden dusk behind.`,
  },
  {
    file: 'page-03-stars.jpg',
    prompt: `${STYLE}

SCENE: Same child as the reference image (keep the same face). Child lying in grass, looking slightly toward camera and the sky. Face large in the foreground. Starry night, pomegranate silhouettes, a small star reflected in the eyes. Peaceful.`,
  },
];

async function chatImage(prompt, refs = []) {
  const content = [{ type: 'text', text: prompt }];
  for (const url of refs) {
    content.push({ type: 'image_url', image_url: { url } });
  }
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:4200',
      'X-Title': 'Ertaklar.uz',
    },
    body: JSON.stringify({
      model,
      modalities: ['image', 'text'],
      image_config: { aspect_ratio: '3:4' },
      messages: [{ role: 'user', content }],
    }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify(json).slice(0, 600));
  }
  const dataUrl = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!dataUrl) {
    throw new Error('no image in response');
  }
  return Buffer.from(dataUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
}

function toData(buf) {
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

if (!key) {
  console.error('OPENROUTER_API_KEY missing');
  process.exit(1);
}

const coverPath = join(outDir, 'page-01-cover.jpg');
let coverRef = existsSync(coverPath) ? toData(readFileSync(coverPath)) : null;

for (const page of pages) {
  const dest = join(outDir, page.file);
  if (existsSync(dest)) {
    console.log('skip', page.file);
    if (!coverRef) coverRef = toData(readFileSync(dest));
    continue;
  }
  const refs = coverRef ? [coverRef] : [];
  console.log('generating', page.file);
  const buf = await chatImage(page.prompt, refs);
  writeFileSync(dest, buf);
  writeFileSync(join(sampleDir, page.file), buf);
  console.log('wrote', dest, buf.length);
  if (!coverRef) coverRef = toData(buf);
}
console.log('done');
