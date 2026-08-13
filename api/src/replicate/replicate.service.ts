import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Replicate from 'replicate';
import sharp from 'sharp';
import { bufferToJpegDataUrl, cropFaceRegion, dataUrlToBuffer } from './face-crop';

const FLUX_KONTEXT = 'black-forest-labs/flux-kontext-pro' as const;
const INSWAPPER =
  'ddvinh1/inswapper:25bdae46f2713138640b6e8c04dc4ca18625ce95b1863936b053eee42d9ba6db' as const;

export type ChildIdentity = {
  gender: string;
  age: number;
  name: string;
  scene?: string;
  look?: string;
  seed?: number;
};

@Injectable()
export class ReplicateService {
  private readonly logger = new Logger(ReplicateService.name);
  private readonly client: Replicate | null;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private readonly config: ConfigService) {
    const token = this.config.get<string>('REPLICATE_API_TOKEN') || '';
    this.client = token ? new Replicate({ auth: token }) : null;
  }

  get enabled() {
    return Boolean(this.client);
  }

  async cropPhoto(childPhotoDataUrl: string): Promise<string> {
    return bufferToJpegDataUrl(await cropFaceRegion(dataUrlToBuffer(childPhotoDataUrl)));
  }

  /**
   * One template, two genders: keep scene/costume/pose, restyle the child's
   * head (gender + hair) to the photo, then lock the real face.
   */
  async swapFace(
    childPhotoDataUrl: string,
    templateDataUrl: string,
    identity: ChildIdentity,
  ): Promise<string> {
    if (!this.client) throw new Error('REPLICATE_API_TOKEN o‘rnatilmagan');
    const cropped = await this.cropPhoto(childPhotoDataUrl);
    const prompt = this.characterPrompt(identity);
    const size = await this.dataUrlSize(templateDataUrl);

    return this.enqueue(async () => {
      let page = templateDataUrl;
      try {
        const adapted = await this.runWithRetry('flux-child', () =>
          this.runKontext(templateDataUrl, prompt, identity.seed),
        );
        page = `data:image/jpeg;base64,${adapted}`;
        this.logger.log(`child adapted via flux-kontext (${identity.gender})`);
      } catch (e) {
        this.logger.warn(`flux-kontext skipped: ${e}`);
      }
      page = await this.matchTemplateSize(page, size);
      const faced = await this.runWithRetry('inswapper', () => this.runInswapper(cropped, page));
      this.logger.log('face locked via inswapper');
      return (await this.matchTemplateSize(`data:image/jpeg;base64,${faced}`, size)).replace(
        /^data:image\/\w+;base64,/,
        '',
      );
    });
  }

  private characterPrompt(identity: ChildIdentity) {
    const girl = identity.gender === 'girl';
    const who = girl ? 'girl' : 'boy';
    const look = identity.look || `${identity.age}-year-old ${who}`;
    const genderLock = girl
      ? `The child MUST clearly be a little GIRL, never a boy. Feminine toddler face, round cheeks. Give her the same hair LENGTH and TEXTURE as the description (shoulder-length curly/coily if described that way). Do not keep a short masculine boy cut.`
      : `The child MUST clearly be a little BOY, never a girl. If the description is short or buzz-cut hair, keep it short — no long hair, no extra curls.`;
    return `Replace the child in this storybook page with a ${identity.age}-year-old ${who}.
${genderLock}
Appearance: ${look}
Keep the SAME story costume (vest, tunic, embroidery, sash), the SAME body pose and hands, and the SAME props (lantern, star, fruit, dragon).
Keep the SAME camera, village, cobblestones, trees, lighting, and 3D storybook style.
Change only the child's HEAD: gender, face shape, and hair.
Do not add people, do not paste a photograph, do not change the background. No text.`;
  }

  private enqueue<T>(fn: () => Promise<T>): Promise<T> {
    const run = this.queue.then(fn, fn);
    this.queue = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }

  private async runWithRetry(label: string, fn: () => Promise<string>): Promise<string> {
    let lastErr: unknown;
    for (let attempt = 1; attempt <= 8; attempt++) {
      try {
        return await fn();
      } catch (e) {
        lastErr = e;
        const wait = this.retryMs(e);
        if (wait == null) throw e;
        this.logger.warn(`${label} retry in ${wait}ms (try ${attempt}): ${e}`);
        await this.sleep(wait);
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
  }

  private async runKontext(template: string, prompt: string, seed?: number): Promise<string> {
    const output = await this.client!.run(FLUX_KONTEXT, {
      input: {
        input_image: template,
        prompt,
        aspect_ratio: '3:4',
        output_format: 'jpg',
        safety_tolerance: 2,
        prompt_upsampling: false,
        ...(typeof seed === 'number' ? { seed } : {}),
      },
      wait: { mode: 'poll', interval: 1000 },
    });
    return this.download(output);
  }

  private async runInswapper(source: string, target: string): Promise<string> {
    const output = await this.client!.run(INSWAPPER, {
      input: {
        source_img: source,
        target_img: target,
        source_indexes: '0',
        target_indexes: '0',
        face_restore: false,
        face_upsample: false,
        background_enhance: false,
        upscale: 1,
        codeformer_fidelity: 1,
      },
      wait: { mode: 'poll', interval: 1000 },
    });
    return this.download(output);
  }

  private async dataUrlSize(dataUrl: string) {
    const meta = await sharp(dataUrlToBuffer(dataUrl)).metadata();
    return { width: meta.width || 1024, height: meta.height || 1536 };
  }

  private async matchTemplateSize(dataUrl: string, size: { width: number; height: number }) {
    const buf = await sharp(dataUrlToBuffer(dataUrl))
      .resize(size.width, size.height, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 92 })
      .toBuffer();
    return bufferToJpegDataUrl(buf);
  }

  private async download(output: unknown): Promise<string> {
    const url = this.outputUrl(output);
    if (!url) throw new Error('Replicate rasm URL qaytarmadi');
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Replicate rasm yuklanmadi ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    this.logger.log(`replicate image ${buf.length} bytes`);
    return buf.toString('base64');
  }

  private retryMs(e: unknown): number | null {
    const msg = e instanceof Error ? e.message : String(e);
    if (/429|throttled|Too Many Requests/i.test(msg)) {
      const after = msg.match(/retry_after["\s:=]+(\d+)/i);
      const resets = msg.match(/resets in ~(\d+)\s*s/i);
      const sec = Number(after?.[1] || resets?.[1] || 8);
      return (Math.max(1, sec) + 2) * 1000;
    }
    if (/fetch failed|ECONNRESET|ETIMEDOUT|socket/i.test(msg)) return 3000;
    return null;
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  private outputUrl(output: unknown): string | null {
    if (!output) return null;
    if (typeof output === 'string') return output;
    if (Array.isArray(output)) return this.outputUrl(output[0]);
    if (typeof output === 'object') {
      const o = output as { url?: string | (() => string); href?: string };
      if (typeof o.url === 'function') return o.url();
      if (typeof o.url === 'string') return o.url;
      if (typeof o.href === 'string') return o.href;
    }
    return null;
  }
}
