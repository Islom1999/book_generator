import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { I18nService } from '../core/i18n.service';
import { Order } from '../core/models';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, RouterLink],
  template: `
    <section class="sec">
      <div class="wrap">
        <h1>{{ i18n.t('admin') }}</h1>
        @if (!token()) {
          <div class="wizard">
            <label>Email</label>
            <input [(ngModel)]="email" />
            <label>{{ i18n.t('password') }}</label>
            <input type="password" [(ngModel)]="password" />
            @if (err()) {
              <p class="err">{{ err() }}</p>
            }
            <button class="btn btn-pri" (click)="login()">{{ i18n.t('login') }}</button>
          </div>
        } @else {
          <div class="sec-head">
            <h2>{{ i18n.t('orders') }}</h2>
            <button class="btn btn-ghost" (click)="logout()">{{ i18n.t('logout') }}</button>
          </div>
          @for (o of orders(); track o.id) {
            <div class="ord">
              <div>
                <b>{{ o.customerName }}</b> · {{ o.phone }}
                <p>{{ o.city }}, {{ o.address }}</p>
                <p>{{ i18n.price(o.total) }} {{ i18n.t('currency') }} · {{ o.status }}</p>
                @for (it of o.items; track it.id) {
                  <p>
                    📖 {{ it.personalization?.childName }} — {{ it.book.titleUz }}
                    @if (it.personalization; as p) {
                      · <a [routerLink]="['/natijalar', p.id]">{{ i18n.t('nav_results') }}</a>
                      · <a [href]="api.pdfUrl(p.id)" target="_blank" rel="noopener">PDF</a>
                    }
                  </p>
                }
              </div>
              <select [ngModel]="o.status" (ngModelChange)="setStatus(o, $event)">
                <option value="new">new</option>
                <option value="ready">ready</option>
                <option value="printed">printed</option>
                <option value="shipped">shipped</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
          }
        }
      </div>
    </section>
  `,
})
export class AdminComponent implements OnInit {
  i18n = inject(I18nService);
  api = inject(ApiService);
  email = 'admin@ertaklar.uz';
  password = 'admin123';
  token = signal(localStorage.getItem('ert_token'));
  orders = signal<Order[]>([]);
  err = signal('');

  async ngOnInit() {
    if (this.token()) await this.load();
  }

  async login() {
    this.err.set('');
    try {
      const res = await this.api.login(this.email, this.password);
      localStorage.setItem('ert_token', res.accessToken);
      this.token.set(res.accessToken);
      await this.load();
    } catch {
      this.err.set('Email yoki parol noto‘g‘ri');
    }
  }

  logout() {
    localStorage.removeItem('ert_token');
    this.token.set(null);
    this.orders.set([]);
  }

  async load() {
    this.orders.set(await this.api.orders());
  }

  async setStatus(o: Order, status: string) {
    await this.api.updateOrder(o.id, status);
    await this.load();
  }
}
