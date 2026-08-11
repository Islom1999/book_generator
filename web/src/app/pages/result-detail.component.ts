import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { CartService } from '../core/cart.service';
import { I18nService } from '../core/i18n.service';
import { Personalization } from '../core/models';

@Component({
  selector: 'app-result-detail',
  imports: [RouterLink],
  template: `
    <section class="sec">
      <div class="wrap">
        <a class="link" routerLink="/natijalar">← {{ i18n.t('nav_results') }}</a>

        @if (loading() && !item()) {
          <div class="gen">
            <div class="spin"></div>
            <p>{{ i18n.t('generating') }}</p>
          </div>
        }

        @if (item(); as r) {
          <div class="result-hero">
            @if (r.photoUrl) {
              <img class="result-photo" [src]="r.photoUrl" [alt]="r.childName" />
            }
            <div>
              <span class="eyebrow">✦ {{ i18n.title(r.book) }}</span>
              <h1>{{ r.generatedTitle || i18n.title(r.book) }}</h1>
              <p class="muted">
                {{ r.childName }}, {{ r.childAge }} {{ i18n.t('age_unit') }}
                @if (r.dedication) {
                  · {{ r.dedication }}
                }
              </p>
              @if (busy()) {
                <p class="muted">{{ i18n.t('generating') }}</p>
              }
              @if (r.status === 'failed' && r.errorMessage) {
                <p class="err">{{ r.errorMessage }}</p>
              }
              <div class="hero-cta">
                @if (r.pages.length) {
                  <a class="btn btn-pri" [href]="api.pdfUrl(r.id)" target="_blank" rel="noopener">{{ i18n.t('open_pdf') }}</a>
                }
                <button class="btn btn-ghost" (click)="toCart(false)">{{ i18n.t('add_and_cart') }}</button>
                <button class="btn btn-ghost" (click)="toCart(true)">{{ i18n.t('order_now') }}</button>
              </div>
            </div>
          </div>

          @if (r.pages.length) {
            <h2>{{ i18n.t('preview_title') }}</h2>
            <div class="pv-pages">
              @for (p of r.pages; track p.pageNumber) {
                <div class="pv-page" [class.locked]="p.locked">
                  @if (p.imageUrl) {
                    <img [src]="p.imageUrl" [alt]="'p' + p.pageNumber" />
                  } @else {
                    <div class="ph">{{ p.pageNumber }}</div>
                  }
                  <span class="pv-pagenum">{{ p.pageNumber }}</span>
                  <p>{{ p.text }}</p>
                </div>
              }
            </div>
            @if (pdfSrc()) {
              <h2>{{ i18n.t('open_pdf') }}</h2>
              <iframe class="pdf-frame" [src]="pdfSrc()" title="PDF"></iframe>
            }
          }
        }
      </div>
    </section>
  `,
})
export class ResultDetailComponent implements OnInit, OnDestroy {
  i18n = inject(I18nService);
  api = inject(ApiService);
  private cart = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  item = signal<Personalization | null>(null);
  loading = signal(true);
  busy = signal(false);
  pdfSrc = signal<SafeResourceUrl | null>(null);
  private timer: ReturnType<typeof setInterval> | null = null;
  private sanitizer = inject(DomSanitizer);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    await this.load(id);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private async load(id: string) {
    this.loading.set(true);
    try {
      const p = await this.api.personalization(id);
      this.setItem(p);
      if (['generating_preview', 'generating_full'].includes(p.status) || !p.pages.length) {
        this.busy.set(true);
        this.poll(id);
      }
    } catch {
      this.item.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  private poll(id: string) {
    this.timer = setInterval(async () => {
      const p = await this.api.personalization(id);
      this.setItem(p);
      if (['preview_ready', 'ready', 'failed'].includes(p.status)) {
        this.busy.set(false);
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }
    }, 2000);
  }

  private setItem(p: Personalization) {
    this.item.set(p);
    this.pdfSrc.set(
      p.pages.length
        ? this.sanitizer.bypassSecurityTrustResourceUrl(
            `${this.api.pdfUrl(p.id)}?v=${encodeURIComponent(p.pages.map((x) => x.imageUrl).join('|'))}`,
          )
        : null,
    );
  }

  toCart(orderNow: boolean) {
    const r = this.item();
    if (!r?.id) return;
    this.cart.add(r);
    void this.router.navigate([orderNow ? '/checkout' : '/cart']);
  }
}
