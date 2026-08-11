import { Injectable, signal } from '@angular/core';
import { Lang, T } from './i18n';
import { Book } from './models';

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>((localStorage.getItem('ert_lang') as Lang) || 'uz');

  t(key: string) {
    return T[this.lang()][key] || key;
  }

  toggle() {
    const next: Lang = this.lang() === 'uz' ? 'ru' : 'uz';
    this.lang.set(next);
    localStorage.setItem('ert_lang', next);
  }

  title(book: Book) {
    return this.lang() === 'ru' ? book.titleRu : book.titleUz;
  }

  desc(book: Book) {
    return this.lang() === 'ru' ? book.descRu : book.descUz;
  }

  price(n: number) {
    return n.toLocaleString('ru-RU').replace(/,/g, ' ');
  }
}
