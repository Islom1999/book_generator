import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AbstractControl, ReactiveFormsModule } from '@angular/forms'
import { FormlyModule } from '@ngx-formly/core'
import { BaseFormComponent } from 'app/shared/abstracts'
import { FormActionButtonsComponent } from 'app/shared'
import { Observable } from 'rxjs'
import { ISetting, SettingService } from '../../common'

@Component({
  selector: 'app-setting-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormActionButtonsComponent],
  templateUrl: './setting-form.component.html',
  styleUrls: ['./setting-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingFormComponent extends BaseFormComponent<ISetting> {
  private crudService = inject(SettingService)
  readonly showDelete = true

  protected initFormFields(): void {
    this.fields = [
      {
        key: 'key',
        type: 'input',
        props: {
          label: 'admin.setting.fields.key',
          translate: true,
          required: true,
          pattern: '^[a-z0-9_.]+$',
        },
      },
      {
        key: 'value',
        type: 'textarea',
        props: {
          label: 'admin.setting.fields.value',
          translate: true,
          required: true,
          description: 'JSON: 3, true, "text", {"a": 1}',
        },
        validators: {
          json: {
            expression: (control: AbstractControl) => isJson(control.value),
            message: () => this.transloco.translate('admin.setting.invalidJson'),
          },
        },
      },
      {
        key: 'description',
        type: 'textarea',
        props: { label: 'admin.setting.fields.description', translate: true },
      },
    ]
  }

  protected getById(id: string, isArchiveView: boolean): Observable<ISetting> {
    return this.crudService.getById(id, isArchiveView)
  }

  protected create(data: Partial<ISetting>): Observable<ISetting> {
    return this.crudService.create(this.parseValue(data))
  }

  protected update(id: string, data: Partial<ISetting>): Observable<ISetting> {
    return this.crudService.update(id, this.parseValue(data))
  }

  protected delete(id: string): Observable<ISetting> {
    return this.crudService.delete(id)
  }

  protected mapToModel(data: ISetting): Partial<ISetting> {
    return {
      key: data.key,
      value: JSON.stringify(data.value, null, 2),
      description: data.description ?? undefined,
    } as Partial<ISetting>
  }

  protected getDeleteTitle(): string {
    return 'admin.common.deleteTitle'
  }

  protected getDeleteMessage(): string {
    return String(this.model.key ?? '')
  }

  /** The form edits `value` as JSON text; the API stores real JSON. */
  private parseValue(data: Partial<ISetting>): Partial<ISetting> {
    return { ...data, value: JSON.parse(String(data.value)) }
  }
}

function isJson(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return true
  try {
    JSON.parse(String(value))
    return true
  } catch {
    return false
  }
}
