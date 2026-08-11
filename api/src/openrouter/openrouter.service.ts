import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenRouterService {
  private readonly logger = new Logger(OpenRouterService.name);
  private readonly baseUrl = 'https://openrouter.ai/api/v1';

  constructor(private readonly config: ConfigService) {}

  private get apiKey() {
    return this.config.get<string>('OPENROUTER_API_KEY') || '';
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer':
        this.config.get<string>('OPENROUTER_SITE_URL') || 'http://localhost:4200',
      'X-Title': this.config.get<string>('OPENROUTER_SITE_NAME') || 'Ertaklar.uz',
    };
  }

  get enabled() {
    return Boolean(this.apiKey);
  }

  get chatModel() {
    return (
      this.config.get<string>('OPENROUTER_CHAT_MODEL') || 'google/gemini-2.5-flash'
    );
  }

  get imageModel() {
    return (
      this.config.get<string>('OPENROUTER_IMAGE_MODEL') ||
      'google/gemini-2.5-flash-image'
    );
  }

  async chat(messages: unknown[], json = false): Promise<string> {
    if (!this.enabled) {
      throw new Error('OPENROUTER_API_KEY o‘rnatilmagan');
    }
    const body: Record<string, unknown> = {
      model: this.chatModel,
      messages,
    };
    if (json) {
      body.response_format = { type: 'json_object' };
    }
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      this.logger.error(data);
      throw new Error(data?.error?.message || `OpenRouter chat ${res.status}`);
    }
    return data?.choices?.[0]?.message?.content || '';
  }

  async describeChild(photoDataUrl: string, age: number, gender: string) {
    const text = await this.chat(
      [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Describe this child's appearance for a consistent children's book illustration character sheet. Age about ${age}, gender: ${gender}. Include: hair color/style, skin tone, eye color, face shape, notable features. 2-4 sentences, English, no name. Do not mention photo quality.`,
            },
            { type: 'image_url', image_url: { url: photoDataUrl } },
          ],
        },
      ],
      false,
    );
    return text.trim();
  }

  async generateStory(params: {
    themePrompt: string;
    childName: string;
    childAge: number;
    gender: string;
    lang: string;
    dedication?: string | null;
    characterDescription: string;
    pageCount: number;
  }) {
    const langName =
      params.lang === 'ru' ? 'Russian' : params.lang === 'en' ? 'English' : 'Uzbek (Latin script)';
    const system = `You are a children's book author and art director. Return ONLY valid JSON.`;
    const user = `Write a gentle personalized picture book.

Theme: ${params.themePrompt}
Hero name: ${params.childName}
Age: ${params.childAge}
Gender: ${params.gender}
Language for page text: ${langName}
Character look: ${params.characterDescription}
Dedication (optional, use on page 1 if present): ${params.dedication || 'none'}
Page count: ${params.pageCount}

Rules:
- Kind, age-appropriate, no fear/violence.
- Each page: 2-4 short sentences.
- Hero name appears often.
- imagePrompt is English, children's book watercolor/gouache illustration, same character every page, 4:5 portrait, no text/letters in the image.
- Start imagePrompt with: "Children's picture book illustration, consistent character:" then the look, then the scene.

JSON shape:
{
  "title": "string in the story language",
  "pages": [
    { "pageNumber": 1, "text": "...", "imagePrompt": "..." }
  ]
}`;

    const raw = await this.chat(
      [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      true,
    );
    return this.parseJson<{
      title: string;
      pages: { pageNumber: number; text: string; imagePrompt: string }[];
    }>(raw);
  }

  /** Template = scene. Child photo = identity. Chat image-edit keeps likeness better than /images. */
  async swapFace(
    templateDataUrl: string,
    childPhotoDataUrl: string,
    identity: {
      gender: string;
      age: number;
      name: string;
      scene?: string;
      look?: string;
    },
  ): Promise<string> {
    const girl = identity.gender === 'girl';
    const who = girl ? 'GIRL' : 'BOY';
    const look = identity.look ? `\nPhoto features to keep: ${identity.look}` : '';
    const scene = identity.scene ? `\nKeep this scene/pose from the template: ${identity.scene}` : '';
    const prompt = `Identity transfer for a picture-book page. The PHOTO is the product.

IMAGES:
- First image = PHOTO of ${identity.name}, ${identity.age}-year-old ${who}. Copy THIS face.
- Second image = TEMPLATE page (pose, clothes, garden/dragon, cream text band, lighting).

OUTPUT (mandatory):
- Portrait 3:4, full-bleed storybook PAGE.
- Keep the TEMPLATE camera: medium shot, child LARGE in the foreground (waist-up / 3/4). Do NOT zoom into a face-only crop. Do NOT pull the camera far back.
- Top ~72% illustration, bottom ~28% EMPTY cream band.
- Exactly ONE child.

FACE (identity only — still a small face in a full scene):
- Replace only the child's head/face with a painted likeness of the photo (eyes, brows, nose, lips, skin, hair).
- Do NOT cartoonize. Do NOT copy the template child's face.
- Must be a ${who}. If template is the other gender, change hair/clothes (no doppa on a girl).
${look}
${scene}

Keep clothes, body, garden/dragon, lighting and page layout from the template.
No text, letters, or watermark.`;

    try {
      return await this.editViaChat(prompt, [childPhotoDataUrl, templateDataUrl]);
    } catch (e) {
      this.logger.warn(`chat face edit failed, images API: ${e}`);
      return this.generateImage(prompt, [childPhotoDataUrl, templateDataUrl]);
    }
  }

  private async editViaChat(prompt: string, imageDataUrls: string[]): Promise<string> {
    if (!this.enabled) {
      throw new Error('OPENROUTER_API_KEY o‘rnatilmagan');
    }
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        model: this.imageModel,
        modalities: ['image', 'text'],
        image_config: { aspect_ratio: '3:4' },
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              ...imageDataUrls.map((url) => ({
                type: 'image_url' as const,
                image_url: { url },
              })),
            ],
          },
        ],
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error?.message || `OpenRouter chat-image ${res.status}`);
    }
    const msg = data?.choices?.[0]?.message || {};
    const fromImages = msg.images?.[0]?.image_url?.url as string | undefined;
    if (fromImages) {
      return fromImages.replace(/^data:image\/\w+;base64,/, '');
    }
    const content = msg.content;
    if (typeof content === 'string') {
      const m = content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);
      if (m) return m[1];
    }
    throw new Error('Chat rasm qaytarmadi');
  }

  async generateImage(prompt: string, references: string[] = []): Promise<string> {
    if (!this.enabled) {
      throw new Error('OPENROUTER_API_KEY o‘rnatilmagan');
    }
    const refs = references.filter(Boolean);
    const body: Record<string, unknown> = {
      model: this.imageModel,
      prompt,
      aspect_ratio: '3:4',
      output_format: 'jpeg',
    };
    if (refs.length) {
      body.input_references = refs.map((url) => ({
        type: 'image_url',
        image_url: { url },
      }));
    }
    const res = await fetch(`${this.baseUrl}/images`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error?.message || `OpenRouter image ${res.status}`);
    }
    const b64 = data?.data?.[0]?.b64_json as string | undefined;
    if (!b64) {
      throw new Error('Rasm javobi bo‘sh');
    }
    return b64;
  }

  private parseJson<T>(raw: string): T {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start < 0 || end < 0) {
      throw new Error('AI JSON qaytarmadi');
    }
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  }
}
