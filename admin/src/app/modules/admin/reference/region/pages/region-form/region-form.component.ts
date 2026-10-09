import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { FormlyModule } from '@ngx-formly/core'
import { BaseFormComponent } from 'app/shared/abstracts'
import { FormActionButtonsComponent } from 'app/shared'
import { Observable } from 'rxjs'
import { IRegion, RegionService } from '../../common'
import { ContentLanguagesService } from 'app/core/languages/content-languages.service'
import { pickTranslation, translatableFields } from 'app/shared/translatable/translatable'

@Component({
  selector: 'app-region-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormActionButtonsComponent],
  templateUrl: './region-form.component.html',
  styleUrls: ['./region-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionFormComponent extends BaseFormComponent<IRegion> {
  private crudService = inject(RegionService)
  private languages = inject(ContentLanguagesService)
  readonly showDelete = true

  protected initFormFields(): void {
    this.fields = [
      translatableFields('name', 'admin.common.name', this.languages.languages(), this.transloco),
      { key: 'code', type: 'input', props: { label: 'admin.region.fields.code', translate: true } },
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

  protected getById(id: string, isArchiveView: boolean): Observable<IRegion> {
    return this.crudService.getById(id, isArchiveView)
  }

  protected create(data: Partial<IRegion>): Observable<IRegion> {
    return this.crudService.create(data)
  }

  protected update(id: string, data: Partial<IRegion>): Observable<IRegion> {
    return this.crudService.update(id, data)
  }

  protected delete(id: string): Observable<IRegion> {
    return this.crudService.delete(id)
  }

  protected mapToModel(data: IRegion): Partial<IRegion> {
    return {
      name: data.name,
      code: data.code ?? undefined,
      sort_order: data.sort_order,
      is_active: data.is_active,
    } as Partial<IRegion>
  }

  protected getDeleteTitle(): string {
    return 'admin.common.deleteTitle'
  }

  protected getDeleteMessage(): string {
    return String(pickTranslation(this.model.name, this.transloco.getActiveLang()) ?? '')
  }
}
