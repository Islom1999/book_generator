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

  /**
   * Uses the public storefront list (active languages only), so every admin
   * gets it regardless of permissions; `admin/languages` needs `languages.manage`.
   */
  load(): Observable<ContentLanguage[]> {
    return this._api
      .get<{ data: ContentLanguage[] }>('languages', { queryParams: { limit: 100 } })
      .pipe(
        map(({ data }) => [...data].sort((a, b) => a.sort_order - b.sort_order)),
        tap((languages) => this.languages.set(languages)),
      )
  }
}
