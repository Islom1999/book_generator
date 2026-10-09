import { inject, Injectable } from '@angular/core'
import { TranslocoService } from '@ngneat/transloco'
import { BaseApiService } from 'app/core/services/base.service'
import { pickTranslation, Translatable } from 'app/shared/translatable/translatable'
import { map, shareReplay } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PostOfficeOptionsService {
  private api = inject(BaseApiService)
  private transloco = inject(TranslocoService)

  /** Select options for districts, labelled in the admin's active language. */
  districtOptions = this.api.get<{ id: string; name: Translatable }[]>('admin/districts').pipe(
    map((items) =>
      items.map((item) => ({
        value: item.id,
        label: pickTranslation(item.name, this.transloco.getActiveLang()),
      })),
    ),
    shareReplay(1),
  )
}
