import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../core/api.service';
import { I18nService } from '../core/i18n.service';
import { Book } from '../core/models';
import { ResultsService } from '../core/results.service';

@Component({
  selector: 'app-wizard',
  imports: [FormsModule],
  template: `
    <section class="sec">
      <div class="wrap wizard">
        <h1>{{ i18n.t('wizard_title') }}</h1>
        @if (book(); as b) {
          <p class="muted">{{ i18n.title(b) }}</p>
        }
        <div class="steps">{{ i18n.t('step') }} {{ step() }} / 4</div>

        @if (step() === 1) {
          <label>{{ i18n.t('w_name') }}</label>
          <input [(ngModel)]="name" [placeholder]="i18n.t('w_name_ph')" />
          <label>{{ i18n.t('w_gender') }}</label>
          <div class="row">
            <button type="button" [class.on]="gender === 'boy'" (click)="gender = 'boy'">👦 {{ i18n.t('w_boy') }}</button>
            <button type="button" [class.on]="gender === 'girl'" (click)="gender = 'girl'">👧 {{ i18n.t('w_girl') }}</button>
          </div>
        }
        @if (step() === 2) {
          <h2>{{ i18n.t('w_age_q') }}</h2>
          <div class="ages">
            @for (a of ages; track a) {
              <button type="button" [class.on]="age === a" (click)="age = a">{{ a }}</button>
            }
          </div>
        }
        @if (step() === 3) {
          <label>{{ i18n.t('w_photo') }}</label>
          <p class="muted">{{ i18n.t('w_photo_hint') }}</p>
          <input type="file" accept="image/*" (change)="onFile($event)" />
          @if (previewUrl()) {
            <img class="photo-prev" [src]="previewUrl()" alt="preview" />
          }
        }
        @if (step() === 4) {
          <label>{{ i18n.t('w_lang') }}</label>
          <div class="row">
            <button type="button" [class.on]="bookLang === 'uz'" (click)="bookLang = 'uz'">O‘zbekcha</button>
            <button type="button" [class.on]="bookLang === 'ru'" (click)="bookLang = 'ru'">Русский</button>
          </div>
          <label>{{ i18n.t('w_dedication') }} <small>({{ i18n.t('w_optional') }})</small></label>
          <textarea [(ngModel)]="dedication" [placeholder]="i18n.t('w_dedication_ph')"></textarea>
        }

        @if (err()) {
          <p class="err">{{ err() }}</p>
        }
        @if (checking()) {
          <div class="gen">
            <div class="spin"></div>
            <p>{{ i18n.t('w_photo_checking') }}</p>
          </div>
        } @else if (submitting()) {
          <div class="gen">
            <div class="spin"></div>
            <p>{{ i18n.t('generating') }}</p>
          </div>
        } @else {
          <div class="wiz-nav">
            @if (step() > 1) {
              <button class="btn btn-ghost" (click)="step.set(step() - 1)">{{ i18n.t('back') }}</button>
            }
            <button class="btn btn-pri" [disabled]="!canNext()" (click)="next()">{{ i18n.t('next') }}</button>
          </div>
        }
      </div>
    </section>
  `,
})
export class WizardComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(ApiService);
  private results = inject(ResultsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  book = signal<Book | null>(null);
  step = signal(1);
  name = '';
  gender = '';
  age = '';
  bookLang = 'uz';
  dedication = '';
  file: File | null = null;
  previewUrl = signal<string | null>(null);
  submitting = signal(false);
  checking = signal(false);
  err = signal('');
  ages = ['1', '2', '3', '4', '5', '6', '7', '8'];

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.book.set(await this.api.book(slug));
  }

  canNext() {
    if (this.submitting() || this.checking()) return false;
    if (this.step() === 1) return !!(this.name.trim() && this.gender);
    if (this.step() === 2) return !!this.age;
    if (this.step() === 3) return !!this.file;
    return true;
  }

  onFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files?.[0];
    if (!f) return;
    this.file = f;
    this.err.set('');
    this.previewUrl.set(URL.createObjectURL(f));
  }

  async next() {
    if (this.step() === 3) {
      this.err.set('');
      this.checking.set(true);
      try {
        await this.validatePhoto();
        this.step.set(4);
      } catch (e: unknown) {
        this.err.set(this.photoErr(e));
      } finally {
        this.checking.set(false);
      }
      return;
    }
    if (this.step() < 4) {
      this.step.set(this.step() + 1);
      return;
    }
    await this.submit();
  }

  async submit() {
    const b = this.book();
    if (!b || !this.file) return;
    this.submitting.set(true);
    this.err.set('');
    const fd = new FormData();
    fd.append('bookId', b.id);
    fd.append('childName', this.name.trim());
    fd.append('childAge', this.age);
    fd.append('gender', this.gender);
    fd.append('bookLang', this.bookLang);
    fd.append('dedication', this.dedication);
    fd.append('photo', this.file);
    try {
      const created = await this.api.createPersonalization(fd);
      this.results.remember(created.id);
      await this.router.navigate(['/natijalar', created.id]);
    } catch (e: unknown) {
      this.err.set(this.photoErr(e));
      this.submitting.set(false);
    }
  }

  private async validatePhoto() {
    if (!this.file) throw new Error('PHOTO_NO_FACE');
    const fd = new FormData();
    fd.append('photo', this.file);
    fd.append('childAge', this.age);
    await this.api.inspectPhoto(fd);
  }

  private photoErr(e: unknown) {
    const code = this.httpCode(e);
    if (code === 'PHOTO_ADULT') return this.i18n.t('w_photo_adult');
    if (code === 'PHOTO_TEEN') return this.i18n.t('w_photo_teen');
    if (code === 'PHOTO_NO_FACE') return this.i18n.t('w_photo_no_face');
    if (code === 'PHOTO_MULTI') return this.i18n.t('w_photo_multi');
    if (code === 'PHOTO_HAS_ADULT') return this.i18n.t('w_photo_has_adult');
    return this.i18n.t('error');
  }

  private httpCode(e: unknown): string {
    if (!e || typeof e !== 'object' || !('error' in e)) return '';
    const err = (e as { error?: { message?: string | string[] } }).error;
    const msg = err?.message;
    return Array.isArray(msg) ? String(msg[0] || '') : String(msg || '');
  }
}
