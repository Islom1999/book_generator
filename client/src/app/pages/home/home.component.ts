import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DEFAULT_LANG, Lang, LANGS } from '../../i18n/translations';

const LANG_KEY = 'ertaklar.lang';

@Component({
  selector: 'app-home',
  imports: [FormsModule, TranslocoDirective, ButtonModule, SelectButtonModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly transloco = inject(TranslocoService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly langOptions = LANGS.map((value) => ({ label: value.toUpperCase(), value }));
  protected readonly steps = [1, 2, 3];
  protected readonly year = new Date().getFullYear();
  protected lang: Lang = DEFAULT_LANG;

  ngOnInit(): void {
    const saved = this.readSavedLang();
    if (saved) this.setLang(saved);
  }

  protected setLang(lang: Lang | null): void {
    if (!lang) return; // SelectButton emits null when the active option is clicked again.
    this.lang = lang;
    this.transloco.setActiveLang(lang);
    if (this.isBrowser) {
      document.documentElement.lang = lang;
      try {
        localStorage.setItem(LANG_KEY, lang);
      } catch {
        // Storage can be blocked (private mode, in-app browsers); the choice just isn't remembered.
      }
    }
  }

  private readSavedLang(): Lang | null {
    if (!this.isBrowser) return null;
    try {
      const value = localStorage.getItem(LANG_KEY);
      return LANGS.includes(value as Lang) ? (value as Lang) : null;
    } catch {
      return null;
    }
  }
}
