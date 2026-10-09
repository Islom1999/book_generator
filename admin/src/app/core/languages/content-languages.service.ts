import { inject, Injectable, signal } from '@angular/core'
import { BaseApiService } from 'app/core/services/base.service'
import { map, Observable, tap } from 'rxjs'

export interface ContentLanguage {
  id: string
  code: string
  name: string
  native_name: string
  is_default: boolean
  is_active: boolean
  sort_order: number
}

/**
 * Languages that content (book texts, region names...) is written in.
 * Managed in the admin panel, so forms build their translation inputs from
 * this list instead of a hard-coded uz/ru/en.
 */
@Injectable({ providedIn: 'root' })
export class ContentLanguagesService {
  private _api = inject(BaseApiService)
  readonly languages = signal<ContentLanguage[]>([])

  load(): Observable<ContentLanguage[]> {
    return this._api.get<ContentLanguage[]>('admin/languages').pipe(
      map((languages) =>
        languages
          .filter((language) => language.is_active)
          .sort((a, b) => a.sort_order - b.sort_order),
      ),
      tap((languages) => this.languages.set(languages)),
    )
  }
}
