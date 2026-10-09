import { Injectable } from '@angular/core'
import { User } from 'app/core/user/user.types'
import { Observable, of, ReplaySubject } from 'rxjs'

/** The signed-in admin. Set by `AuthService` from the sign-in response. */
@Injectable({ providedIn: 'root' })
export class UserService {
  private _user = new ReplaySubject<User>(1)

  set user(value: User) {
    this._user.next(value)
  }

  get user$(): Observable<User> {
    return this._user.asObservable()
  }

  /** Local-only (e.g. the online/away status toggle in the user menu). */
  update(user: User): Observable<User> {
    this._user.next(user)
    return of(user)
  }
}
