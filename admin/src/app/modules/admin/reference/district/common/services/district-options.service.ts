import { inject, Injectable } from '@angular/core'
import { TranslocoService } from '@ngneat/transloco'
import { BaseApiService } from 'app/core/services/base.service'
import { pickTranslation, Translatable } from 'app/shared/translatable/translatable'
import { map, shareReplay } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class DistrictOptionsService {
  private api = inject(BaseApiService)
  private transloco = inject(TranslocoService)

  /** Select options for regions, labelled in the admin's active language. */
  regionOptions = this.api.get<{ id: string; name: Translatable }[]>('admin/regions').pipe(
    map((items) =>
      items.map((item) => ({
        value: item.id,
        label: pickTranslation(item.name, this.transloco.getActiveLang()),
      })),
    ),
    shareReplay(1),
  )
}
