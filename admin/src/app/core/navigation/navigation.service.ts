import { inject, Injectable } from '@angular/core'
import { FuseNavigationItem } from '@fuse/components/navigation'
import { TranslocoService } from '@ngneat/transloco'
import { adminNavigation } from 'app/core/navigation/navigation'
import { Navigation } from 'app/core/navigation/navigation.types'
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private _transloco = inject(TranslocoService)
  private _navigation = new ReplaySubject<Navigation>(1)

  constructor() {
    // Re-translate the menu whenever the admin switches language.
    this._transloco.langChanges$
      .pipe(switchMap((lang) => this._transloco.selectTranslation(lang)))
      .subscribe(() => this._navigation.next(this._build()))
  }

  get navigation$(): Observable<Navigation> {
    return this._navigation.asObservable()
  }

  /** Resolves once the menu is translated for the active language. */
  get(): Observable<Navigation> {
    return this._transloco.selectTranslation().pipe(
      take(1),
      map(() => this._build()),
      tap((navigation) => this._navigation.next(navigation)),
    )
  }

  private _build(): Navigation {
    const items = this._translate(adminNavigation)
    return { default: items, compact: items, futuristic: items, horizontal: items }
  }

  private _translate(items: FuseNavigationItem[]): FuseNavigationItem[] {
    return items.map((item) => ({
      ...item,
      title: item.title ? this._transloco.translate(item.title) : item.title,
      children: item.children ? this._translate(item.children) : undefined,
    }))
  }
}
