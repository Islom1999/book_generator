import { Injectable, computed, signal } from '@angular/core';
import { CartItem, Personalization } from './models';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>(this.read());
  readonly count = computed(() => this.items().length);
  readonly total = computed(() =>
    this.items().reduce((s, it) => s + it.personalization.book.price, 0),
  );

  add(personalization: Personalization) {
    const next = [
      ...this.items(),
      { key: `${Date.now()}-${Math.random()}`, personalization },
    ];
    this.write(next);
  }

  remove(key: string) {
    this.write(this.items().filter((it) => it.key !== key));
  }

  clear() {
    this.write([]);
  }

  private read(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem('ert_cart') || '[]');
    } catch {
      return [];
    }
  }

  private write(items: CartItem[]) {
    this.items.set(items);
    localStorage.setItem('ert_cart', JSON.stringify(items));
  }
}
