import { Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';
import { Lang, TRANSLATIONS } from './translations';

/** Bundled translations: no HTTP round trip, so SSR renders them directly. */
@Injectable({ providedIn: 'root' })
export class BundledTranslocoLoader implements TranslocoLoader {
  getTranslation(lang: string): Observable<Translation> {
    return of(TRANSLATIONS[lang as Lang] ?? {});
  }
}
