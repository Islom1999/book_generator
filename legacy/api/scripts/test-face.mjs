import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const key = process.env.OPENROUTER_API_KEY;
if (!key) {
  console.error('OPENROUTER_API_KEY missing');
  process.exit(1);
}

const photo = join(process.cwd(), 'uploads/photos/1786473621926_0a462649.jpg');
const template = join(process.cwd(), 'uploads/templates/ajdaho/page-01-cover.jpg');
const outDir = join(process.cwd(), 'uploads/test-face');
mkdirSync(outDir, { recursive: true });

const toData = (p) =>
  `data:image/jpeg;base64,${readFileSync(p).toString('base64')}`;

const photoUrl = toData(photo);
const templateUrl = toData(template);
const model = process.env.OPENROUTER_IMAGE_MODEL || 'google/gemini-2.5-flash-image';

const prompt = `You are doing a high-likeness identity transfer.

IMAGE A (first): children's book illustration template. Keep the scene, dragon, landscape, watercolor style, empty cream bottom band.
IMAGE B (second): a PHOTO of a real 3-year-old GIRL. This is Aziza. Her FACE is the product.

The illustrated child must look like a painted portrait of IMAGE B:
- same round face, big dark eyes, eyebrows, nose, mouth, TOOTHY SMILE
- same warm skin tone
- same dark voluminous curly/coily hair
- she is a GIRL, not a boy (no skullcap/doppa)

Do not invent a generic cartoon boy. If a parent would not recognize Aziza, you failed.
No text in the image.`;

const headers = {
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': 'http://localhost:4200',
  'X-Title': 'Ertaklar.uz-test',
};

function saveB64(name, b64) {
  const raw = b64.replace(/^data:image\/\w+;base64,/, '');
  const file = join(outDir, name);
  writeFileSync(file, Buffer.from(raw, 'base64'));
  console.log('saved', file, Buffer.from(raw, 'base64').length);
}

// 1) Chat completions + image output (usually better identity)
const chatBody = {
  model,
  modalities: ['image', 'text'],
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: templateUrl } },
        { type: 'image_url', image_url: { url: photoUrl } },
      ],
    },
  ],
};

const chatRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers,
  body: JSON.stringify(chatBody),
});
const chatJson = await chatRes.json();
if (!chatRes.ok) {
  console.log('CHAT FAIL', chatRes.status, JSON.stringify(chatJson).slice(0, 800));
} else {
  const msg = chatJson.choices?.[0]?.message || {};
  console.log('chat keys', Object.keys(msg));
  const images = msg.images || [];
  console.log('images', images.length, 'content type', typeof msg.content);
  if (images[0]?.image_url?.url) saveB64('chat-cover.jpg', images[0].image_url.url);
  const content = msg.content;
  if (typeof content === 'string' && content.includes('base64')) {
    const m = content.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
    if (m) saveB64('chat-cover-content.jpg', m[0]);
  }
  if (Array.isArray(content)) {
    for (const part of content) {
      const u = part?.image_url?.url || part?.inline_data?.data;
      if (u) saveB64('chat-cover-part.jpg', u.startsWith('data:') ? u : `data:image/jpeg;base64,${u}`);
    }
  }
}

// 2) Images API with face photo FIRST (identity bias)
const imgBody = {
  model,
  prompt,
  aspect_ratio: '3:4',
  output_format: 'jpeg',
  input_references: [
    { type: 'image_url', image_url: { url: photoUrl } },
    { type: 'image_url', image_url: { url: templateUrl } },
  ],
};
const imgRes = await fetch('https://openrouter.ai/api/v1/images', {
  method: 'POST',
  headers,
  body: JSON.stringify(imgBody),
});
const imgJson = await imgRes.json();
if (!imgRes.ok) {
  console.log('IMAGES FAIL', imgRes.status, JSON.stringify(imgJson).slice(0, 800));
} else {
  const b64 = imgJson.data?.[0]?.b64_json;
  if (b64) saveB64('images-cover.jpg', b64);
  else console.log('images empty', JSON.stringify(imgJson).slice(0, 500));
}
