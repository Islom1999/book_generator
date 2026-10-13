import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { FormlyModule } from '@ngx-formly/core'
import { BaseFormComponent } from 'app/shared/abstracts'
import { FormActionButtonsComponent } from 'app/shared'
import { Observable } from 'rxjs'
import { ContentLanguagesService } from 'app/core/languages/content-languages.service'
import { PermissionService } from 'app/core/permission/permission.service'
import { pickTranslation, translatableFields } from 'app/shared/translatable/translatable'
import { AdminRoleService, IAdminRole } from '../../common'
import { PermissionMatrixType } from '../../components'

@Component({
  selector: 'app-admin-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormActionButtonsComponent],
  templateUrl: './admin-role-form.component.html',
  styleUrls: ['./admin-role-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoleFormComponent extends BaseFormComponent<IAdminRole> {
  private crudService = inject(AdminRoleService)
  private languages = inject(ContentLanguagesService)
  private access = inject(PermissionService)
  readonly canManage = this.access.hasAny('roles.manage')
  readonly showDelete = this.canManage

  protected initFormFields(): void {
    this.fields = [
      {
        // Admins who may only view roles see the form read-only.
        props: { disabled: !this.canManage },
        fieldGroup: [
          translatableFields(
            'name',
            'admin.common.name',
            this.languages.languages(),
            this.transloco,
          ),
          {
            key: 'description',
            type: 'textarea',
            props: {
              label: 'admin.adminRole.fields.description',
              translate: true,
              rows: 2,
              maxLength: 1000,
            },
          },
          { key: 'permissions', type: PermissionMatrixType, defaultValue: [] },
          {
            key: 'is_active',
            type: 'checkbox',
            defaultValue: true,
            props: { label: 'admin.common.isActive', translate: true },
          },
        ],
      },
    ]
  }

  protected getById(id: string, isArchiveView: boolean): Observable<IAdminRole> {
    return this.crudService.getById(id, isArchiveView)
  }

  protected create(data: Partial<IAdminRole>): Observable<IAdminRole> {
    return this.crudService.create(data)
  }

  protected update(id: string, data: Partial<IAdminRole>): Observable<IAdminRole> {
    return this.crudService.update(id, data)
  }

  protected delete(id: string): Observable<IAdminRole> {
    return this.crudService.delete(id)
  }

  protected mapToModel(data: IAdminRole): Partial<IAdminRole> {
    return {
      name: data.name,
      description: data.description,
      permissions: data.permissions,
      is_active: data.is_active,
    }
  }

  protected getDeleteTitle(): string {
    return 'admin.common.deleteTitle'
  }

  protected getDeleteMessage(): string {
    return String(pickTranslation(this.model.name, this.transloco.getActiveLang()) ?? '')
  }
}
