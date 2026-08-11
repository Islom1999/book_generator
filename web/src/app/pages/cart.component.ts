import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { CartService } from '../core/cart.service';
import { I18nService } from '../core/i18n.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  template: `
    <section class="sec">
      <div class="wrap cart-page">
        <h1>{{ i18n.t('cart_title') }}</h1>
        @if (cart.items().length === 0) {
          <p>{{ i18n.t('cart_empty') }}</p>
          <a class="btn btn-pri" routerLink="/books">{{ i18n.t('cart_empty_cta') }}</a>
        } @else {
          @for (it of cart.items(); track it.key) {
            <div class="cart-row">
              <div class="cart-cover" [style.background]="grad(it.personalization.book.hue)">
                {{ it.personalization.book.emoji }}
              </div>
              <div>
                <b><a [routerLink]="['/natijalar', it.personalization.id]">{{ i18n.title(it.personalization.book) }}</a></b>
                <p>{{ i18n.t('cart_for') }} {{ it.personalization.childName }},
                  {{ it.personalization.childAge }} {{ i18n.t('age_unit') }}</p>
              </div>
              <div class="price">{{ i18n.price(it.personalization.book.price) }}</div>
              <a class="link" [href]="api.pdfUrl(it.personalization.id)" target="_blank" rel="noopener">PDF</a>
              <button class="link" (click)="cart.remove(it.key)">{{ i18n.t('cart_remove') }}</button>
            </div>
          }
          <div class="cart-total">
            <span>{{ i18n.t('subtotal') }}</span>
            <b>{{ i18n.price(cart.total()) }} {{ i18n.t('currency') }}</b>
          </div>
          <a class="btn btn-pri" routerLink="/checkout">{{ i18n.t('checkout') }}</a>
        }
      </div>
    </section>
  `,
})
export class CartComponent {
  i18n = inject(I18nService);
  cart = inject(CartService);
  api = inject(ApiService);
  grad(hue: number) {
    return `linear-gradient(160deg, hsl(${hue} 70% 92%), hsl(${hue} 60% 80%))`;
  }
}
