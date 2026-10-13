import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { ConfigService } from '@nestjs/config';
import { LocalStorageDriver, makePreview, normalizeImage } from '@app/storage';
import sharp from 'sharp';
import { MediaUrlService } from './media-url.service.js';

const config = {
  getOrThrow: () => 'test-secret',
  get: (_key: string, fallback: string) => fallback,
} as unknown as ConfigService;

describe('MediaUrlService', () => {
  const urls = new MediaUrlService(config);

  it('signs and verifies a key', () => {
    const url = urls.sign('page_image/a.jpg', 60)!;
    const token = url.split('/api/media/')[1];
    expect(urls.verify(token)).toBe('page_image/a.jpg');
  });

  it('rejects a tampered token', () => {
    const token = urls.sign('a.jpg', 60)!.split('/api/media/')[1];
    const [, signature] = token.split('.');
    const forged = Buffer.from(
      JSON.stringify({ k: 'print_file/b.pdf', e: 9e9 }),
    ).toString('base64url');
    expect(urls.verify(`${forged}.${signature}`)).toBeNull();
  });

  it('rejects an expired token', () => {
    const payload = Buffer.from(JSON.stringify({ k: 'a.jpg', e: 1 })).toString(
      'base64url',
    );
    expect(urls.verify(`${payload}.x`)).toBeNull();
  });
});

describe('images', () => {
  it('normalises and builds a small watermarked preview', async () => {
    const input = await sharp({
      create: { width: 2000, height: 1000, channels: 3, background: '#88aaff' },
    })
      .png()
      .toBuffer();
    const original = await normalizeImage(input);
    expect(original.contentType).toBe('image/jpeg');
    const preview = await makePreview(original.buffer, {
      maxPx: 800,
      watermark: 'ertaklar.uz',
    });
    expect(preview.width).toBe(800);
    expect(preview.height).toBe(400);
  });

  it('refuses non-images', async () => {
    await expect(normalizeImage(Buffer.from('not an image'))).rejects.toThrow();
  });
});

describe('LocalStorageDriver', () => {
  it('stores files and refuses keys escaping the root', async () => {
    const driver = new LocalStorageDriver(
      await mkdtemp(join(tmpdir(), 'storage-')),
    );
    await driver.put('a/b.txt', Buffer.from('hi'), 'text/plain');
    expect((await driver.get('a/b.txt')).toString()).toBe('hi');
    await expect(driver.get('../etc/passwd')).rejects.toThrow();
  });
});
