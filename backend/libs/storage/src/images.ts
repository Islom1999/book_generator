import sharp from 'sharp';

export interface ProcessedImage {
  buffer: Buffer;
  width: number;
  height: number;
  contentType: string;
}

/** Longest side kept for originals; enough for AI input and print upscaling. */
const ORIGINAL_MAX_PX = 4096;

/**
 * Normalises an upload: applies EXIF rotation, strips metadata (GPS etc.),
 * caps the size and re-encodes to JPEG. Throws on anything that is not an image.
 */
export async function normalizeImage(input: Buffer): Promise<ProcessedImage> {
  const { data, info } = await sharp(input, { failOn: 'error' })
    .rotate()
    .resize({
      width: ORIGINAL_MAX_PX,
      height: ORIGINAL_MAX_PX,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  return {
    buffer: data,
    width: info.width,
    height: info.height,
    contentType: 'image/jpeg',
  };
}

function escapeXml(text: string) {
  return text.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[c]!,
  );
}

/** A diagonal, repeated text pattern covering the whole image. */
function watermarkSvg(width: number, height: number, text: string) {
  const size = Math.max(14, Math.round(Math.min(width, height) / 14));
  const step = size * 7;
  const rows: string[] = [];
  for (let y = -height; y < height * 2; y += step / 2) {
    for (let x = -width; x < width * 2; x += step) {
      rows.push(`<text x="${x}" y="${y}">${escapeXml(text)}</text>`);
    }
  }
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <g transform="rotate(-30 ${width / 2} ${height / 2})" font-family="sans-serif"
         font-size="${size}" font-weight="700" fill="#ffffff" fill-opacity="0.35"
         stroke="#000000" stroke-opacity="0.15" stroke-width="1">${rows.join('')}</g>
    </svg>`,
  );
}

/**
 * Customer-facing preview (BUSINESS_LOGIC §11): small, watermarked WebP.
 * Without `watermark` it is just a thumbnail (admin lists).
 */
export async function makePreview(
  input: Buffer,
  options: { maxPx: number; watermark?: string },
): Promise<ProcessedImage> {
  const resized = await sharp(input)
    .resize({
      width: options.maxPx,
      height: options.maxPx,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toBuffer({ resolveWithObject: true });
  const { width, height } = resized.info;
  let pipeline = sharp(resized.data);
  if (options.watermark) {
    pipeline = pipeline.composite([
      {
        input: watermarkSvg(width, height, options.watermark),
        top: 0,
        left: 0,
      },
    ]);
  }
  const buffer = await pipeline.webp({ quality: 80 }).toBuffer();
  return { buffer, width, height, contentType: 'image/webp' };
}
