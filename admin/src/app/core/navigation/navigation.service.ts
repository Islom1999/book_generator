import { inject, Injectable } from '@angular/core'
import { FuseNavigationItem } from '@fuse/components/navigation'
import { TranslocoService } from '@ngneat/transloco'
import { adminNavigation } from 'app/core/navigation/navigation'
import { Permission } from 'app/core/permission/permission.catalog'
import { User } from 'app/core/user/user.types'
import { UserService } from 'app/core/user/user.service'
import { Navigation } from 'app/core/navigation/navigation.types'
import { combineLatest, map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private _transloco = inject(TranslocoService)
  private _userService = inject(UserService)
  private _navigation = new ReplaySubject<Navigation>(1)
  private _user?: User

  constructor() {
    // Rebuild the menu when the admin switches language or signs in as someone else.
    combineLatest([
      this._transloco.langChanges$.pipe(
        switchMap((lang) => this._transloco.selectTranslation(lang)),
      ),
      this._userService.user$,
    ]).subscribe(([, user]) => {
      this._user = user
      this._navigation.next(this._build())
    })
  }

  get navigation$(): Observable<Navigation> {
    return this._navigation.asObservable()
  }

  /** Resolves once the menu is translated for the active language. */
  get(): Observable<Navigation> {
    return combineLatest([this._transloco.selectTranslation(), this._userService.user$]).pipe(
      take(1),
      map(([, user]) => {
        this._user = user
        return this._build()
      }),
      tap((navigation) => this._navigation.next(navigation)),
    )
  }

  private _build(): Navigation {
    const items = this._translate(this._allowed(adminNavigation))
    return { default: items, compact: items, futuristic: items, horizontal: items }
  }

  /** Drops items the admin has no permission for, then groups left empty. */
  private _allowed(items: FuseNavigationItem[]): FuseNavigationItem[] {
    const own = new Set(this._user?.permissions ?? [])
    const superAdmin = !!this._user?.is_super_admin
    return items
      .filter((item) => {
        const keys: Permission[] = item.meta?.permissions ?? []
        return superAdmin || keys.length === 0 || keys.some((key) => own.has(key))
      })
      .map((item) => (item.children ? { ...item, children: this._allowed(item.children) } : item))
      .filter((item) => item.type !== 'group' || (item.children?.length ?? 0) > 0)
  }

  private _translate(items: FuseNavigationItem[]): FuseNavigationItem[] {
    return items.map((item) => ({
      ...item,
      title: item.title ? this._transloco.translate(item.title) : item.title,
      children: item.children ? this._translate(item.children) : undefined,
    }))
  }
}
