import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../core/cart.service';
import { I18nService } from '../core/i18n.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="hd">
      <div class="wrap hd-in">
        <a class="logo" routerLink="/"><span class="logo-star">✦</span> {{ i18n.t('brand') }}</a>
        <nav class="nav">
          <a routerLink="/" routerLinkActive="on" [routerLinkActiveOptions]="{ exact: true }">{{ i18n.t('nav_home') }}</a>
          <a routerLink="/books" routerLinkActive="on">{{ i18n.t('nav_books') }}</a>
          <a routerLink="/natijalar" routerLinkActive="on">{{ i18n.t('nav_results') }}</a>
          <a routerLink="/" fragment="how">{{ i18n.t('nav_how') }}</a>
        </nav>
        <div class="hd-right">
          <button class="lang-btn" (click)="i18n.toggle()">{{ i18n.t('lang_switch') }}</button>
          <a class="cart-btn" routerLink="/cart">🛒
            @if (cart.count() > 0) {
              <span class="cart-badge">{{ cart.count() }}</span>
            }
          </a>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  i18n = inject(I18nService);
  cart = inject(CartService);
}
