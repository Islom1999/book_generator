import sharp from 'sharp';

/** Head + hair crop so identity models see the hairstyle, not the room. */
export async function cropFaceRegion(input: Buffer): Promise<Buffer> {
  const meta = await sharp(input).metadata();
  const w = meta.width || 1;
  const h = meta.height || 1;
  const tall = h > w * 1.12;
  // Full face + hair, but not the whole body (avoids huge indoor backgrounds).
  const side = tall ? Math.min(w, Math.round(h * 0.5)) : Math.min(w, h);
  const left = Math.max(0, Math.round((w - side) / 2));
  const top = tall ? 0 : Math.max(0, Math.round((h - side) / 2));
  const width = Math.min(side, w - left);
  const height = Math.min(side, h - top);
  return sharp(input)
    .extract({ left, top, width, height })
    .resize(768, 768, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 92 })
    .toBuffer();
}

export function dataUrlToBuffer(dataUrl: string): Buffer {
  const b64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(b64, 'base64');
}

export function bufferToJpegDataUrl(buf: Buffer): string {
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}
