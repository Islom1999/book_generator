import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../core/i18n.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="ft">
      <div class="wrap ft-grid">
        <div>
          <div class="logo"><span class="logo-star">✦</span> {{ i18n.t('brand') }}</div>
          <p>{{ i18n.t('footer_tag') }}</p>
        </div>
        <div>
          <h4>{{ i18n.t('nav_books') }}</h4>
          <a routerLink="/books">{{ i18n.t('view_all') }}</a>
          <a routerLink="/natijalar">{{ i18n.t('nav_results') }}</a>
          <a routerLink="/admin">{{ i18n.t('admin') }}</a>
        </div>
        <div>
          <h4>{{ i18n.t('nav_support') }}</h4>
          <p>support&#64;ertaklar.uz</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  i18n = inject(I18nService);
}
