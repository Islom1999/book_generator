import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { I18nService } from '../core/i18n.service';
import { Book } from '../core/models';

@Component({
  selector: 'app-book-detail',
  imports: [RouterLink],
  template: `
    @if (book(); as b) {
      <section class="sec">
        <div class="wrap detail">
          <div class="detail-cover" [style.background]="grad(b)">
            @if (b.coverUrl) {
              <img [src]="b.coverUrl" [alt]="i18n.title(b)" />
            } @else {
              <span>{{ b.emoji }}</span>
            }
          </div>
          <div>
            <span class="eyebrow">✦ {{ b.ageRange }}</span>
            <h1>{{ i18n.title(b) }}</h1>
            <p class="hero-sub">{{ i18n.desc(b) }}</p>
            <div class="meta">
              <div><small>{{ i18n.t('book_age') }}</small><b>{{ b.ageRange }}</b></div>
              <div><small>{{ i18n.t('book_pages') }}</small><b>{{ b.pageCount }}</b></div>
            </div>
            <div class="detail-price"><b>{{ i18n.price(b.price) }}</b> <small>{{ i18n.t('currency') }}</small></div>
            <a class="btn btn-pri" [routerLink]="['/books', b.slug, 'personalize']">✦ {{ i18n.t('personalise') }}</a>
          </div>
        </div>
      </section>
    }
  `,
})
export class BookDetailComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  book = signal<Book | null>(null);

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.book.set(await this.api.book(slug));
  }

  grad(b: Book) {
    return `linear-gradient(160deg, hsl(${b.hue} 70% 92%), hsl(${b.hue} 60% 80%))`;
  }
}
