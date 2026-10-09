import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/i18n.service';
import { Book } from '../core/models';

@Component({
  selector: 'app-book-card',
  imports: [RouterLink],
  template: `
    <article class="card">
      <a [routerLink]="['/books', book.slug]" class="cover" [style.background]="grad">
        @if (book.badge === 'best') {
          <span class="badge">{{ i18n.t('badge_top') }}</span>
        }
        @if (book.badge === 'new') {
          <span class="badge">{{ i18n.t('badge_new') }}</span>
        }
        @if (book.coverUrl) {
          <img [src]="book.coverUrl" [alt]="i18n.title(book)" />
        } @else {
          <span>{{ book.emoji }}</span>
        }
      </a>
      <h3>{{ i18n.title(book) }}</h3>
      <p>{{ i18n.desc(book) }}</p>
      <div class="card-row">
        <div class="price"><small>{{ i18n.t('from') }} </small>{{ i18n.price(book.price) }} <small>{{ i18n.t('currency') }}</small></div>
        <a class="btn btn-pri sm" [routerLink]="['/books', book.slug, 'personalize']">{{ i18n.t('personalise') }}</a>
      </div>
    </article>
  `,
})
export class BookCardComponent {
  @Input({ required: true }) book!: Book;
  i18n = inject(I18nService);
  get grad() {
    return `linear-gradient(160deg, hsl(${this.book.hue} 70% 92%), hsl(${this.book.hue} 60% 80%))`;
  }
}
