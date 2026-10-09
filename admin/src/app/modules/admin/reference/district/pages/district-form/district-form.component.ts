import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { FormlyModule } from '@ngx-formly/core'
import { BaseFormComponent } from 'app/shared/abstracts'
import { FormActionButtonsComponent } from 'app/shared'
import { Observable } from 'rxjs'
import { IDistrict, DistrictOptionsService, DistrictService } from '../../common'
import { ContentLanguagesService } from 'app/core/languages/content-languages.service'
import { pickTranslation, translatableFields } from 'app/shared/translatable/translatable'

@Component({
  selector: 'app-district-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormActionButtonsComponent],
  templateUrl: './district-form.component.html',
  styleUrls: ['./district-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistrictFormComponent extends BaseFormComponent<IDistrict> {
  private crudService = inject(DistrictService)
  private languages = inject(ContentLanguagesService)
  private regionOptions = inject(DistrictOptionsService).regionOptions
  readonly showDelete = true

  protected initFormFields(): void {
    this.fields = [
      translatableFields('name', 'admin.common.name', this.languages.languages(), this.transloco),
      {
        key: 'region_id',
        type: 'select',
        props: {
          label: 'admin.district.fields.region',
          translate: true,
          required: true,
          filter: true,
          options: this.regionOptions,
        },
      },
      {
        key: 'sort_order',
        type: 'input-number',
        defaultValue: 0,
        props: { label: 'admin.common.sortOrder', translate: true },
      },
      {
        key: 'is_active',
        type: 'checkbox',
        defaultValue: true,
        props: { label: 'admin.common.isActive', translate: true },
      },
    ]
  }

  protected getById(id: string, isArchiveView: boolean): Observable<IDistrict> {
    return this.crudService.getById(id, isArchiveView)
  }

  protected create(data: Partial<IDistrict>): Observable<IDistrict> {
    return this.crudService.create(data)
  }

  protected update(id: string, data: Partial<IDistrict>): Observable<IDistrict> {
    return this.crudService.update(id, data)
  }

  protected delete(id: string): Observable<IDistrict> {
    return this.crudService.delete(id)
  }

  protected mapToModel(data: IDistrict): Partial<IDistrict> {
    return {
      name: data.name,
      region_id: data.region_id,
      sort_order: data.sort_order,
      is_active: data.is_active,
    } as Partial<IDistrict>
  }

  protected getDeleteTitle(): string {
    return 'admin.common.deleteTitle'
  }

  protected getDeleteMessage(): string {
    return String(pickTranslation(this.model.name, this.transloco.getActiveLang()) ?? '')
  }
}
