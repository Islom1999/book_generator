import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { CartService } from '../core/cart.service';
import { I18nService } from '../core/i18n.service';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, RouterLink],
  template: `
    <section class="sec">
      <div class="wrap cart-page">
        @if (done()) {
          <h1>{{ i18n.t('co_done_t') }}</h1>
          <p>{{ i18n.t('co_done_d') }}</p>
          <a class="btn btn-pri" routerLink="/">{{ i18n.t('co_back_home') }}</a>
        } @else {
          <h1>{{ i18n.t('co_title') }}</h1>
          <label>{{ i18n.t('co_name') }}</label>
          <input [(ngModel)]="customerName" />
          <label>{{ i18n.t('co_phone') }}</label>
          <input [(ngModel)]="phone" placeholder="+998" />
          <label>{{ i18n.t('co_city') }}</label>
          <input [(ngModel)]="city" />
          <label>{{ i18n.t('co_addr') }}</label>
          <textarea [(ngModel)]="address"></textarea>
          <label>{{ i18n.t('co_pay') }}</label>
          <p>{{ i18n.t('co_cash') }}</p>
          <div class="cart-total">
            <span>{{ i18n.t('subtotal') }}</span>
            <b>{{ i18n.price(cart.total()) }} {{ i18n.t('currency') }}</b>
          </div>
          @if (err()) {
            <p class="err">{{ err() }}</p>
          }
          <button class="btn btn-pri" [disabled]="busy() || !ok()" (click)="place()">
            {{ i18n.t('co_place') }}
          </button>
        }
      </div>
    </section>
  `,
})
export class CheckoutComponent {
  i18n = inject(I18nService);
  cart = inject(CartService);
  private api = inject(ApiService);
  customerName = '';
  phone = '';
  city = 'Toshkent';
  address = '';
  busy = signal(false);
  done = signal(false);
  err = signal('');

  ok() {
    return this.customerName && this.phone && this.city && this.address && this.cart.items().length;
  }

  async place() {
    this.busy.set(true);
    this.err.set('');
    try {
      await this.api.createOrder({
        customerName: this.customerName,
        phone: this.phone,
        city: this.city,
        address: this.address,
        paymentMethod: 'cash',
        items: this.cart.items().map((it) => ({ personalizationId: it.personalization.id })),
      });
      this.cart.clear();
      this.done.set(true);
    } catch (e: unknown) {
      this.err.set(e instanceof Error ? e.message : 'Xatolik');
    } finally {
      this.busy.set(false);
    }
  }
}
