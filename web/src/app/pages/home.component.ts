import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { I18nService } from '../core/i18n.service';
import { Book } from '../core/models';
import { BookCardComponent } from '../shared/book-card.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, BookCardComponent],
  template: `
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">✦ {{ i18n.t('hero_eyebrow') }}</span>
          <h1>{{ i18n.t('hero_title') }}</h1>
          <p class="hero-sub">{{ i18n.t('hero_sub') }}</p>
          <div class="hero-cta">
            <a class="btn btn-pri" routerLink="/books">✦ {{ i18n.t('hero_cta') }}</a>
            <a class="btn btn-ghost" routerLink="/books">{{ i18n.t('hero_cta2') }}</a>
          </div>
        </div>
        <div class="hero-motion">
          <div class="motion-stage">
            <div class="book-mock" style="background:linear-gradient(160deg,#6c5ce7,#2c2358)">
              <div>🐉</div>
              <small>Botir va Ajdaho</small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap">
        <div class="sec-head">
          <div>
            <span class="eyebrow">✦ {{ i18n.t('section_best') }}</span>
            <h2>{{ i18n.t('section_best_sub') }}</h2>
          </div>
          <a routerLink="/books">{{ i18n.t('view_all') }} →</a>
        </div>
        <div class="grid">
          @for (b of books(); track b.id) {
            <app-book-card [book]="b" />
          }
        </div>
      </div>
    </section>

    <section class="sec how" id="how">
      <div class="wrap">
        <h2>{{ i18n.t('how_title') }}</h2>
        <div class="how-row">
          @for (s of steps; track s.t) {
            <div class="how-card">
              <div class="n">{{ s.n }}</div>
              <h3>{{ i18n.t(s.t) }}</h3>
              <p>{{ i18n.t(s.d) }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(ApiService);
  books = signal<Book[]>([]);
  steps = [
    { n: 1, t: 'how_1_t', d: 'how_1_d' },
    { n: 2, t: 'how_2_t', d: 'how_2_d' },
    { n: 3, t: 'how_3_t', d: 'how_3_d' },
    { n: 4, t: 'how_4_t', d: 'how_4_d' },
  ];

  async ngOnInit() {
    this.books.set(await this.api.books());
  }
}
