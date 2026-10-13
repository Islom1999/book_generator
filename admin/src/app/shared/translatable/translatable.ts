import { inject, Pipe, PipeTransform } from '@angular/core'
import { TranslocoService } from '@ngneat/transloco'
import { FormlyFieldConfig } from '@ngx-formly/core'
import { ContentLanguage } from 'app/core/languages/content-languages.service'
import { map, Observable, of } from 'rxjs'

/** `{ "uz": "...", "ru": "...", "en": "..." }`, mirrors the backend `Translatable`. */
export type Translatable = Record<string, string>

/** Text for `lang`, falling back to the first non-empty translation. */
export function pickTranslation(value: Translatable | null | undefined, lang: string): string {
  if (!value) return ''
  return value[lang] || Object.values(value).find(Boolean) || ''
}

/** Shows a translatable value in the admin's active UI language. */
@Pipe({ name: 'translatable', standalone: true })
export class TranslatablePipe implements PipeTransform {
  private _transloco = inject(TranslocoService)

  transform(value: Translatable | null | undefined): Observable<string> {
    if (!value) return of('—')
    return this._transloco.langChanges$.pipe(map((lang) => pickTranslation(value, lang) || '—'))
  }
}

/**
 * One input per content language, grouped under `key`, e.g.
 * `name.uz`, `name.ru`, `name.en`. Only the default language is required.
 */
export function translatableFields(
  key: string,
  label: string,
  languages: ContentLanguage[],
  transloco: TranslocoService,
  options: { textarea?: boolean; required?: boolean } = {},
): FormlyFieldConfig {
  return {
    key,
    fieldGroup: languages.map((language) => ({
      key: language.code,
      type: options.textarea ? 'textarea' : 'input',
      props: {
        required: (options.required ?? true) && language.is_default,
      },
      expressions: {
        // "Nomi (UZ)", re-translated when the admin switches UI language.
        'props.label': transloco
          .selectTranslate(label)
          .pipe(map((text: string) => `${text} (${language.code.toUpperCase()})`)),
      },
    })),
  }
}
