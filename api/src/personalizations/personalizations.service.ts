import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { In, Repository } from 'typeorm';
import { BooksService } from '../books/books.service';
import { Personalization, StoryPage } from '../entities/personalization.entity';
import { OpenRouterService } from '../openrouter/openrouter.service';
import { PdfService } from './pdf.service';

@Injectable()
export class PersonalizationsService {
  private readonly logger = new Logger(PersonalizationsService.name);

  constructor(
    @InjectRepository(Personalization)
    private readonly repo: Repository<Personalization>,
    private readonly books: BooksService,
    private readonly ai: OpenRouterService,
    private readonly config: ConfigService,
    private readonly pdf: PdfService,
  ) {}

  async create(params: {
    bookId: string;
    childName: string;
    childAge: number;
    gender: string;
    bookLang: string;
    dedication?: string;
    photo: Express.Multer.File;
  }) {
    if (!params.photo) {
      throw new BadRequestException('Surat yuklang');
    }
    const book = await this.books.getById(params.bookId);
    const photoUrl = this.saveUpload(params.photo, 'photos');
    const row = await this.repo.save(
      this.repo.create({
        book,
        childName: params.childName.trim(),
        childAge: Number(params.childAge),
        gender: params.gender,
        bookLang: params.bookLang || 'uz',
        dedication: params.dedication || null,
        photoUrl,
        status: 'generating_preview',
        pages: [],
      }),
    );
    void this.runPreview(row.id).catch((e) =>
      this.logger.error(`preview ${row.id}`, e),
    );
    return this.toDto(row);
  }

  async get(id: string) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Topilmadi');
    return this.toDto(row);
  }

  async listByIds(ids: string[]) {
    if (!ids.length) return [];
    const rows = await this.repo.find({
      where: { id: In(ids.slice(0, 50)) },
      order: { createdAt: 'DESC' },
    });
    const order = new Map(ids.map((id, i) => [id, i]));
    return rows
      .sort((a, b) => (order.get(a.id) ?? 99) - (order.get(b.id) ?? 99))
      .map((r) => this.toDto(r));
  }

  async buildPdf(id: string) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Topilmadi');
    if (!row.pages?.length) {
      throw new BadRequestException('Kitob hali tayyor emas');
    }
    return this.pdf.build(row);
  }

  async generateFull(id: string) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Topilmadi');
    if (row.status === 'ready' || row.status === 'generating_full') {
      return this.toDto(row);
    }
    row.status = 'generating_full';
    await this.repo.save(row);
    void this.runImages(row.id, 0).catch((e) =>
      this.logger.error(`full ${row.id}`, e),
    );
    return this.toDto(row);
  }

  private fill(template: string, row: Personalization) {
    return template
      .replaceAll('{{name}}', row.childName)
      .replaceAll('{{age}}', String(row.childAge));
  }

  private pagesFromTemplate(row: Personalization): StoryPage[] {
    const templates = row.book.templatePages || [];
    const ru = row.bookLang === 'ru';
    return templates.map((p) => ({
      pageNumber: p.pageNumber,
      text:
        p.pageNumber === 1 && row.dedication
          ? row.dedication
          : this.fill(ru ? p.textRu : p.textUz, row),
      imagePrompt: p.scene,
      templateImageUrl: p.imageUrl,
      hasChild: p.hasChild !== false,
      imageUrl: null,
    }));
  }

  private async runPreview(id: string) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) return;
    try {
      const templates = row.book.templatePages || [];
      if (!templates.length) {
        throw new Error('Bu kitobda template yo‘q');
      }
      const uz = row.bookLang !== 'ru';
      const base = uz ? row.book.titleUz : row.book.titleRu;
      row.generatedTitle = uz
        ? `${row.childName} — ${base}`
        : `${row.childName} — ${base}`;
      row.pages = this.pagesFromTemplate(row);

      if (!this.ai.enabled) {
        row.pages = row.pages.map((p) => ({
          ...p,
          imageUrl: p.templateImageUrl || null,
        }));
        row.status = 'ready';
        row.errorMessage = 'OPENROUTER_API_KEY yo‘q — template rasmlari ishlatildi.';
        await this.repo.save(row);
        return;
      }

      const photoB64 = this.fileToDataUrl(this.absFromUrl(row.photoUrl));
      let description = `${row.childAge}-year-old ${row.gender} child, storybook hero`;
      try {
        description = await this.ai.describeChild(photoB64, row.childAge, row.gender);
      } catch (e) {
        this.logger.warn(`vision failed: ${e}`);
      }
      row.characterDescription = description;
      await this.repo.save(row);
      await this.runImages(id, 0);
    } catch (e) {
      this.logger.error(e);
      row.status = 'failed';
      row.errorMessage = e instanceof Error ? e.message : String(e);
      await this.repo.save(row);
    }
  }

  private async runImages(id: string, limit: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) return;
    try {
      const photoB64 = this.fileToDataUrl(this.absFromUrl(row.photoUrl));
      const targets = row.pages.filter(
        (p) => !p.imageUrl && (limit <= 0 || p.pageNumber <= limit),
      );
      await this.mapLimit(targets, 2, async (page) => {
        try {
          if (!page.hasChild || !page.templateImageUrl) {
            page.imageUrl = page.templateImageUrl || null;
          } else {
            const templateB64 = this.fileToDataUrl(
              this.absFromUrl(page.templateImageUrl),
            );
            const b64 = await this.ai.swapFace(templateB64, photoB64, {
              gender: row.gender,
              age: row.childAge,
              name: row.childName,
              scene: page.imagePrompt,
              look: row.characterDescription || undefined,
            });
            page.imageUrl = this.saveBase64(b64, 'pages');
          }
        } catch (e) {
          this.logger.warn(`page ${page.pageNumber} face swap: ${e}`);
          page.imageUrl = page.templateImageUrl || null;
        }
        await this.repo.save(row);
      });
      const remaining = row.pages.some((p) => !p.imageUrl);
      row.status = remaining ? 'preview_ready' : 'ready';
      await this.repo.save(row);
    } catch (e) {
      row.status = 'failed';
      row.errorMessage = e instanceof Error ? e.message : String(e);
      await this.repo.save(row);
    }
  }

  private toDto(row: Personalization) {
    const free = row.book?.freePages ?? 3;
    const locked =
      row.status === 'ready' ? false : true;
    return {
      id: row.id,
      book: row.book,
      childName: row.childName,
      childAge: row.childAge,
      gender: row.gender,
      bookLang: row.bookLang,
      dedication: row.dedication,
      photoUrl: row.photoUrl,
      generatedTitle: row.generatedTitle,
      status: row.status,
      errorMessage: row.errorMessage,
      pages: (row.pages || []).map((p) => ({
        ...p,
        locked: locked && p.pageNumber > free,
      })),
    };
  }

  private saveUpload(file: Express.Multer.File, folder: string) {
    const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
    const name = `${Date.now()}_${randomUUID().slice(0, 8)}.${ext}`;
    const rel = `${folder}/${name}`;
    writeFileSync(join(process.cwd(), 'uploads', rel), file.buffer);
    return `${this.publicUrl()}/uploads/${rel}`;
  }

  private saveBase64(b64: string, folder: string) {
    const name = `${Date.now()}_${randomUUID().slice(0, 8)}.jpg`;
    const rel = `${folder}/${name}`;
    writeFileSync(join(process.cwd(), 'uploads', rel), Buffer.from(b64, 'base64'));
    return `${this.publicUrl()}/uploads/${rel}`;
  }

  private publicUrl() {
    return this.config.get<string>('PUBLIC_URL') || 'http://localhost:3000';
  }

  private absFromUrl(url: string) {
    const idx = url.indexOf('/uploads/');
    const rel = idx >= 0 ? url.slice(idx + '/uploads/'.length) : url;
    return join(process.cwd(), 'uploads', rel);
  }

  private fileToDataUrl(absPath: string) {
    const buf = readFileSync(absPath);
    const mime = absPath.endsWith('.png') ? 'image/png' : 'image/jpeg';
    return `data:${mime};base64,${buf.toString('base64')}`;
  }

  private async mapLimit<T>(
    items: T[],
    limit: number,
    fn: (item: T) => Promise<void>,
  ) {
    let i = 0;
    const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const item = items[i++];
        await fn(item);
      }
    });
    await Promise.all(workers);
  }
}
