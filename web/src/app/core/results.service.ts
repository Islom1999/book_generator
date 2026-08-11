import { Injectable, signal } from '@angular/core';

const KEY = 'ert_results';

@Injectable({ providedIn: 'root' })
export class ResultsService {
  readonly ids = signal<string[]>(this.read());

  remember(id: string) {
    const next = [id, ...this.read().filter((x) => x !== id)].slice(0, 40);
    this.write(next);
  }

  remove(id: string) {
    this.write(this.read().filter((x) => x !== id));
  }

  private read(): string[] {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  }

  private write(ids: string[]) {
    this.ids.set(ids);
    localStorage.setItem(KEY, JSON.stringify(ids));
  }
}
