import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../core/api.service';
import { I18nService } from '../core/i18n.service';
import { Book } from '../core/models';
import { BookCardComponent } from '../shared/book-card.component';

@Component({
  selector: 'app-catalog',
  imports: [BookCardComponent],
  template: `
    <section class="sec">
      <div class="wrap">
        <div class="sec-head">
          <h2>{{ i18n.t('catalog_title') }}</h2>
          <div class="chips">
            <button [class.on]="!gender()" (click)="gender.set(null)">{{ i18n.t('view_all') }}</button>
            <button [class.on]="gender() === 'girl'" (click)="gender.set('girl')">{{ i18n.t('section_girls') }}</button>
            <button [class.on]="gender() === 'boy'" (click)="gender.set('boy')">{{ i18n.t('section_boys') }}</button>
          </div>
        </div>
        <div class="grid">
          @for (b of filtered(); track b.id) {
            <app-book-card [book]="b" />
          }
        </div>
      </div>
    </section>
  `,
})
export class CatalogComponent implements OnInit {
  i18n = inject(I18nService);
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  books = signal<Book[]>([]);
  gender = signal<string | null>(null);
  filtered = computed(() => {
    const g = this.gender();
    return g ? this.books().filter((b) => b.gender === g) : this.books();
  });

  async ngOnInit() {
    this.gender.set(this.route.snapshot.queryParamMap.get('gender'));
    this.books.set(await this.api.books());
  }
}
