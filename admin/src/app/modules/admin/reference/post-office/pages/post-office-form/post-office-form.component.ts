import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { FormlyModule } from '@ngx-formly/core'
import { pickTranslation } from 'app/shared/translatable/translatable'
import { BaseFormComponent } from 'app/shared/abstracts'
import { FormActionButtonsComponent } from 'app/shared'
import { Observable } from 'rxjs'
import { DistrictService } from '../../../district/common'
import { IPostOffice, PostOfficeService } from '../../common'
import { ContentLanguagesService } from 'app/core/languages/content-languages.service'
import { translatableFields } from 'app/shared/translatable/translatable'

@Component({
  selector: 'app-post-office-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormActionButtonsComponent],
  templateUrl: './post-office-form.component.html',
  styleUrls: ['./post-office-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostOfficeFormComponent extends BaseFormComponent<IPostOffice> {
  private crudService = inject(PostOfficeService)
  private languages = inject(ContentLanguagesService)
  private districtOptions = inject(DistrictService).selectOptions((district) =>
    pickTranslation(district.name, this.transloco.getActiveLang()),
  )
  readonly showDelete = true

  protected initFormFields(): void {
    this.fields = [
      {
        key: 'postal_code',
        type: 'input',
        props: {
          label: 'admin.postOffice.fields.postal_code',
          translate: true,
          required: true,
          pattern: '^\\d{6}$',
        },
      },
      translatableFields('name', 'admin.common.name', this.languages.languages(), this.transloco),
      translatableFields(
        'address',
        'admin.postOffice.fields.address',
        this.languages.languages(),
        this.transloco,
        { required: false },
      ),
      {
        key: 'district_id',
        type: 'select',
        props: {
          label: 'admin.postOffice.fields.district',
          translate: true,
          required: true,
          filter: true,
          options: this.districtOptions,
        },
      },
      {
        key: 'latitude',
        type: 'input-number',
        props: {
          label: 'admin.postOffice.fields.latitude',
          translate: true,
          minFractionDigits: 0,
          maxFractionDigits: 6,
        },
      },
      {
        key: 'longitude',
        type: 'input-number',
        props: {
          label: 'admin.postOffice.fields.longitude',
          translate: true,
          minFractionDigits: 0,
          maxFractionDigits: 6,
        },
      },
      {
        key: 'is_active',
        type: 'checkbox',
        defaultValue: true,
        props: { label: 'admin.common.isActive', translate: true },
      },
    ]
  }

  protected getById(id: string, isArchiveView: boolean): Observable<IPostOffice> {
    return this.crudService.getById(id, isArchiveView)
  }

  protected create(data: Partial<IPostOffice>): Observable<IPostOffice> {
    return this.crudService.create(data)
  }

  protected update(id: string, data: Partial<IPostOffice>): Observable<IPostOffice> {
    return this.crudService.update(id, data)
  }

  protected delete(id: string): Observable<IPostOffice> {
    return this.crudService.delete(id)
  }

  protected mapToModel(data: IPostOffice): Partial<IPostOffice> {
    return {
      postal_code: data.postal_code,
      name: data.name,
      address: data.address ?? undefined,
      district_id: data.district_id,
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
      is_active: data.is_active,
    } as Partial<IPostOffice>
  }

  protected getDeleteTitle(): string {
    return 'admin.common.deleteTitle'
  }

  protected getDeleteMessage(): string {
    return String(this.model.postal_code ?? '')
  }
}
