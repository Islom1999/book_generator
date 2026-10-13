import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { I18nService } from '../core/i18n.service';
import { Personalization } from '../core/models';

@Component({
  selector: 'app-results-list',
  imports: [RouterLink],
  template: `
    <section class="sec">
      <div class="wrap">
        <div class="sec-head">
          <div>
            <span class="eyebrow">✦ {{ i18n.t('nav_results') }}</span>
            <h1>{{ i18n.t('results_title') }}</h1>
          </div>
          <a class="btn btn-pri" routerLink="/books">{{ i18n.t('results_new') }}</a>
        </div>

        @if (loading()) {
          <p class="muted">{{ i18n.t('loading') }}</p>
        } @else if (items().length === 0) {
          <p>{{ i18n.t('results_empty') }}</p>
          <a class="btn btn-pri" routerLink="/books">{{ i18n.t('cart_empty_cta') }}</a>
        } @else {
          <div class="grid">
            @for (r of items(); track r.id) {
              <a class="card result-card" [routerLink]="['/natijalar', r.id]">
                <div class="cover" [style.background]="grad(r.book.hue)">
                  @if (cover(r); as img) {
                    <img [src]="img" [alt]="r.generatedTitle || i18n.title(r.book)" />
                  } @else {
                    <span>{{ r.book.emoji }}</span>
                  }
                </div>
                <h3>{{ r.generatedTitle || i18n.title(r.book) }}</h3>
                <p>{{ r.childName }}, {{ r.childAge }} {{ i18n.t('age_unit') }}</p>
                <div class="card-row">
                  <small class="muted">{{ statusLabel(r.status) }}</small>
                  <span class="link">{{ i18n.t('results_open') }} →</span>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class ResultsListComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(ApiService);
  items = signal<Personalization[]>([]);
  loading = signal(true);

  async ngOnInit() {
    try {
      this.items.set(await this.api.personalizations());
    } finally {
      this.loading.set(false);
    }
  }

  cover(r: Personalization) {
    return r.pages.find((p) => p.imageUrl)?.imageUrl || r.photoUrl || null;
  }

  grad(hue: number) {
    return `linear-gradient(160deg, hsl(${hue} 70% 92%), hsl(${hue} 60% 80%))`;
  }

  statusLabel(status: string) {
    if (status === 'ready' || status === 'preview_ready') return this.i18n.t('results_ready');
    if (status === 'failed') return this.i18n.t('error');
    return this.i18n.t('generating');
  }
}
