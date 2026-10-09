import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { In, Not, Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { User } from '../entities/user.entity';
import { AJDAHO_PAGES, AJDAHO_SLUG, TemplatePage } from '../templates/ajdaho.template';
import { ANOR_PAGES, ANOR_SLUG } from '../templates/anor.template';
import { BAHOR_PAGES, BAHOR_SLUG } from '../templates/bahor-kapalagi.template';
import { OY_TUYA_PAGES, OY_TUYA_SLUG } from '../templates/oy-tuya.template';

const KNOWN_SLUGS = [AJDAHO_SLUG, ANOR_SLUG, OY_TUYA_SLUG, BAHOR_SLUG];

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Book) private readonly books: Repository<Book>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
    await this.seedAjdaho();
    await this.seedAnor();
    await this.seedOyTuya();
    await this.seedBahor();
    await this.books.update({ slug: Not(In(KNOWN_SLUGS)) }, { isActive: false });
  }

  private async seedAdmin() {
    const email = (this.config.get<string>('ADMIN_EMAIL') || 'admin@ertaklar.uz').toLowerCase();
    const exists = await this.users.findOne({ where: { email } });
    if (exists) return;
    const password = this.config.get<string>('ADMIN_PASSWORD') || 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);
    await this.users.save(this.users.create({ email, passwordHash, role: 'admin' }));
    this.logger.log(`Admin yaratildi: ${email}`);
  }

  private async seedAjdaho() {
    this.copyPages('ajdaho', AJDAHO_PAGES, join(process.cwd(), '..', 'sample-book'));
    await this.upsertBook({
      slug: AJDAHO_SLUG,
      titleUz: 'Amir va Mehribon Ajdaho',
      titleRu: 'Амир и добрый дракон',
      descUz: 'Mehribonlik qo‘rqinchli ajdahoni do‘stga aylantiradi. Bolangiz — bosh qahramon.',
      descRu: 'Доброта превращает дракона в друга. Ваш ребёнок — главный герой.',
      price: 129000,
      ageRange: '3–6',
      pageCount: AJDAHO_PAGES.length,
      freePages: AJDAHO_PAGES.length,
      badge: 'best',
      gender: null,
      hue: 262,
      emoji: '🐉',
      themePrompt: 'Template: Amir va Mehribon Ajdaho. Replace the child with the uploaded photo.',
      folder: 'ajdaho',
      pages: AJDAHO_PAGES,
    });
    this.logger.log('Template kitob tayyor: amir-va-ajdaho');
  }

  private async seedAnor() {
    this.copyPages('anor', ANOR_PAGES, join(process.cwd(), '..', 'sample-book', 'anor'));
    await this.upsertBook({
      slug: ANOR_SLUG,
      titleUz: 'Anor yulduzi',
      titleRu: 'Гранатовая звезда',
      descUz: 'Anor bog‘ida kichik yulduz charaqlaydi. Bolangiz — bosh qahramon.',
      descRu: 'В гранатовом саду вспыхивает маленькая звезда. Ваш ребёнок — главный герой.',
      price: 129000,
      ageRange: '3–6',
      pageCount: ANOR_PAGES.length,
      freePages: ANOR_PAGES.length,
      badge: null,
      gender: null,
      hue: 12,
      emoji: '🌟',
      themePrompt: 'Template: Anor yulduzi. Replace the child with the uploaded photo.',
      folder: 'anor',
      pages: ANOR_PAGES,
    });
    this.logger.log('Template kitob tayyor: anor-yulduzi');
  }

  private async seedOyTuya() {
    this.copyPages('oy-tuya', OY_TUYA_PAGES, join(process.cwd(), '..', 'sample-book', 'oy-tuya'));
    await this.upsertBook({
      slug: OY_TUYA_SLUG,
      titleUz: 'Oy tuya',
      titleRu: 'Лунный верблюд',
      descUz: 'Oy yorug‘ida yumshoq tuya bilan sarguzasht. Bolangiz — bosh qahramon.',
      descRu: 'Приключение с добрым верблюдом при луне. Ваш ребёнок — главный герой.',
      price: 129000,
      ageRange: '3–6',
      pageCount: OY_TUYA_PAGES.length,
      freePages: OY_TUYA_PAGES.length,
      badge: 'new',
      gender: null,
      hue: 222,
      emoji: '🌙',
      themePrompt: 'Template: Oy tuya. Night desert, moon, gentle camel. Replace the child with the uploaded photo.',
      folder: 'oy-tuya',
      pages: OY_TUYA_PAGES,
    });
    this.logger.log('Template kitob tayyor: oy-tuya');
  }

  private async seedBahor() {
    this.copyPages(
      'bahor-kapalagi',
      BAHOR_PAGES,
      join(process.cwd(), '..', 'sample-book', 'bahor-kapalagi'),
    );
    await this.upsertBook({
      slug: BAHOR_SLUG,
      titleUz: 'Bahor kapalagi',
      titleRu: 'Весенняя бабочка',
      descUz: 'O‘rik bog‘ida do‘st kapalak. Bolangiz — bosh qahramon.',
      descRu: 'Друг-бабочка в абрикосовом саду. Ваш ребёнок — главный герой.',
      price: 129000,
      ageRange: '3–6',
      pageCount: BAHOR_PAGES.length,
      freePages: BAHOR_PAGES.length,
      badge: 'new',
      gender: null,
      hue: 330,
      emoji: '🦋',
      themePrompt:
        'Template: Bahor kapalagi. Spring orchard, butterfly. Replace the child with the uploaded photo.',
      folder: 'bahor-kapalagi',
      pages: BAHOR_PAGES,
    });
    this.logger.log('Template kitob tayyor: bahor-kapalagi');
  }

  private copyPages(folder: string, pages: TemplatePage[], srcDir: string) {
    const dir = join(process.cwd(), 'uploads', 'templates', folder);
    mkdirSync(dir, { recursive: true });
    for (const p of pages) {
      const dest = join(dir, p.file);
      const src = join(srcDir, p.file);
      if (!existsSync(dest) && existsSync(src)) {
        copyFileSync(src, dest);
      }
    }
  }

  private async upsertBook(opts: {
    slug: string;
    titleUz: string;
    titleRu: string;
    descUz: string;
    descRu: string;
    price: number;
    ageRange: string;
    pageCount: number;
    freePages: number;
    badge: string | null;
    gender: string | null;
    hue: number;
    emoji: string;
    themePrompt: string;
    folder: string;
    pages: TemplatePage[];
  }) {
    const publicUrl = this.config.get<string>('PUBLIC_URL') || 'http://localhost:3000';
    const templatePages = opts.pages.map((p) => ({
      pageNumber: p.pageNumber,
      imageUrl: `${publicUrl}/uploads/templates/${opts.folder}/${p.file}`,
      textUz: p.textUz,
      textRu: p.textRu,
      scene: p.scene,
      hasChild: p.hasChild,
    }));
    const payload: Partial<Book> = {
      slug: opts.slug,
      titleUz: opts.titleUz,
      titleRu: opts.titleRu,
      descUz: opts.descUz,
      descRu: opts.descRu,
      price: opts.price,
      ageRange: opts.ageRange,
      pageCount: opts.pageCount,
      freePages: opts.freePages,
      badge: opts.badge,
      gender: opts.gender,
      hue: opts.hue,
      emoji: opts.emoji,
      coverUrl: templatePages[0]?.imageUrl || null,
      themePrompt: opts.themePrompt,
      isActive: true,
      templatePages,
    };
    const book = await this.books.findOne({ where: { slug: opts.slug } });
    if (book) {
      Object.assign(book, payload);
      await this.books.save(book);
    } else {
      await this.books.save(this.books.create(payload));
    }
  }
}
