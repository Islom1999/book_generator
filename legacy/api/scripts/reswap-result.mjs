import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import pg from 'pg';
import Replicate from 'replicate';

const id = process.argv[2] || 'b728a09e-636f-42a9-88c5-4e6677093937';
const token = process.env.REPLICATE_API_TOKEN;
if (!token) {
  console.error('REPLICATE_API_TOKEN missing');
  process.exit(1);
}

const replicate = new Replicate({ auth: token });
const root = process.cwd();
const toData = (abs) => `data:image/jpeg;base64,${readFileSync(abs).toString('base64')}`;
const fromUrl = (url) => join(root, 'uploads', url.slice(url.indexOf('/uploads/') + '/uploads/'.length));

const client = new pg.Client({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 55432),
  user: process.env.DB_USER || 'ertaklar',
  password: process.env.DB_PASSWORD || 'ertaklar',
  database: process.env.DB_NAME || 'ertaklar',
});
await client.connect();
const { rows } = await client.query(
  'select "photoUrl", pages from personalizations where id=$1',
  [id],
);
if (!rows[0]) {
  console.error('not found');
  process.exit(1);
}
const photo = toData(fromUrl(rows[0].photoUrl));
const pages = rows[0].pages;

for (const page of pages) {
  const template = toData(fromUrl(page.templateImageUrl));
  console.log('swap page', page.pageNumber);
  const output = await replicate.run(
    'ddvinh1/inswapper:25bdae46f2713138640b6e8c04dc4ca18625ce95b1863936b053eee42d9ba6db',
    {
      input: {
        source_img: photo,
        target_img: template,
        source_indexes: '0',
        target_indexes: '0',
        face_restore: true,
        face_upsample: true,
        background_enhance: false,
        upscale: 1,
        codeformer_fidelity: 0.8,
      },
    },
  );
  const url = typeof output === 'string' ? output : Array.isArray(output) ? output[0] : output?.url?.();
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const name = `pages/swap_${Date.now()}_${page.pageNumber}.jpg`;
  writeFileSync(join(root, 'uploads', name), buf);
  page.imageUrl = `http://localhost:3000/uploads/${name}`;
  console.log('wrote', name, buf.length);
}

await client.query('update personalizations set pages=$1::jsonb where id=$2', [
  JSON.stringify(pages),
  id,
]);
await client.end();
console.log('updated', id);
