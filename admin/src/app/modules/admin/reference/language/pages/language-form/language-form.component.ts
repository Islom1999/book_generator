import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { FormlyModule } from '@ngx-formly/core'
import { BaseFormComponent } from 'app/shared/abstracts'
import { FormActionButtonsComponent } from 'app/shared'
import { Observable } from 'rxjs'
import { ILanguage, LanguageService } from '../../common'

@Component({
  selector: 'app-language-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormActionButtonsComponent],
  templateUrl: './language-form.component.html',
  styleUrls: ['./language-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageFormComponent extends BaseFormComponent<ILanguage> {
  private crudService = inject(LanguageService)
  readonly showDelete = true

  protected initFormFields(): void {
    this.fields = [
      {
        key: 'code',
        type: 'input',
        props: {
          label: 'admin.language.fields.code',
          translate: true,
          required: true,
          pattern: '^[a-z]{2}(-[a-z0-9]{2,4})?$',
        },
      },
      {
        key: 'name',
        type: 'input',
        props: { label: 'admin.language.fields.name', translate: true, required: true },
      },
      {
        key: 'native_name',
        type: 'input',
        props: { label: 'admin.language.fields.native_name', translate: true, required: true },
      },
      {
        key: 'sort_order',
        type: 'input-number',
        defaultValue: 0,
        props: { label: 'admin.common.sortOrder', translate: true },
      },
      {
        key: 'is_default',
        type: 'checkbox',
        defaultValue: false,
        props: { label: 'admin.language.fields.is_default', translate: true },
      },
      {
        key: 'is_active',
        type: 'checkbox',
        defaultValue: true,
        props: { label: 'admin.common.isActive', translate: true },
      },
    ]
  }

  protected getById(id: string, isArchiveView: boolean): Observable<ILanguage> {
    return this.crudService.getById(id, isArchiveView)
  }

  protected create(data: Partial<ILanguage>): Observable<ILanguage> {
    return this.crudService.create(data)
  }

  protected update(id: string, data: Partial<ILanguage>): Observable<ILanguage> {
    return this.crudService.update(id, data)
  }

  protected delete(id: string): Observable<ILanguage> {
    return this.crudService.delete(id)
  }

  protected mapToModel(data: ILanguage): Partial<ILanguage> {
    return {
      code: data.code,
      name: data.name,
      native_name: data.native_name,
      is_default: data.is_default,
      is_active: data.is_active,
      sort_order: data.sort_order,
    } as Partial<ILanguage>
  }

  protected getDeleteTitle(): string {
    return 'admin.common.deleteTitle'
  }

  protected getDeleteMessage(): string {
    return String(this.model.code ?? '')
  }
}
