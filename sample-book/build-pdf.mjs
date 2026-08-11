import { createRequire } from 'module';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createWriteStream } from 'fs';

const require = createRequire(import.meta.url);
const PDFDocument = require('../api/node_modules/pdfkit');

const dir = dirname(fileURLToPath(import.meta.url));
const fontReg = join(dir, '../api/assets/fonts/NotoSans-Regular.ttf');
const fontBold = join(dir, '../api/assets/fonts/NotoSans-Bold.ttf');
const out = join(dir, 'Amir-va-Ajdaho.pdf');

const W = 480;
const H = 640;
const padX = 28;

const pages = [
  {
    img: 'page-01-cover.jpg',
    heading: 'Amir va Mehribon Ajdaho',
    text: 'Sevimli Amirga. 5 yoshing muborak!',
  },
  {
    img: 'page-02-window.jpg',
    text: 'Amir ertalab derazani ochdi. Quyosh kulib turardi. Bugun yangi sarguzasht uni kutardi.',
  },
  {
    img: 'page-03-path.jpg',
    text: 'U nonini olib tog‘ yo‘liga chiqdi. Gullar salom berdi. Yuragi dadil edi.',
  },
  {
    img: 'page-04-dragon.jpg',
    text: 'Qoyalarda yolg‘iz ajdaho o‘tirardi. U qo‘rqinchli emasdi — shunchaki do‘st izlar edi.',
  },
  {
    img: 'page-05-share.jpg',
    text: 'Amir nonini ajdaho bilan bo‘lishdi. Mehribonlik qo‘rquvni do‘stlikka aylantirdi.',
  },
  {
    img: 'page-06-fly.jpg',
    text: 'Yangi do‘st Amirni osmon bo‘ylab uchirdi. Qishloq pastda oltindek porlardi.',
  },
  {
    img: 'page-07-sleep.jpg',
    text: 'Uyga qaytib, Amir tinch uxlab qoldi. Ajdaho esa qishloqni mehr bilan qo‘riqladi. Oxiri.',
  },
];

const doc = new PDFDocument({
  size: [W, H],
  margin: 0,
  info: { Title: 'Amir va Mehribon Ajdaho', Author: 'Ertaklar.uz' },
});

const stream = createWriteStream(out);
doc.pipe(stream);

pages.forEach((p, i) => {
  if (i > 0) doc.addPage({ size: [W, H], margin: 0 });
  doc.image(join(dir, p.img), 0, 0, { cover: [W, H] });

  const band = H * 0.28;
  const y = H - band + 18;
  if (p.heading) {
    doc.font(fontBold).fontSize(18).fillColor('#1b1633').text(p.heading, padX, y, {
      width: W - padX * 2,
      align: 'center',
      lineGap: 2,
    });
    doc.moveDown(0.25);
    doc.font(fontReg).fontSize(12).fillColor('#3a3358').text(p.text, {
      width: W - padX * 2,
      align: 'center',
      lineGap: 3,
    });
  } else {
    doc.font(fontReg).fontSize(13).fillColor('#1b1633').text(p.text, padX, y + 8, {
      width: W - padX * 2,
      align: 'center',
      lineGap: 4,
    });
  }
});

doc.end();
await new Promise((resolve, reject) => {
  stream.on('finish', resolve);
  stream.on('error', reject);
});
console.log(out);
