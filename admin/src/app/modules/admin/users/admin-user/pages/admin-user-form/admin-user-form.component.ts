import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core'
import { BaseFormComponent } from 'app/shared/abstracts'
import { FormActionButtonsComponent } from 'app/shared'
import { Observable } from 'rxjs'
import { IAdminUser, AdminUserService } from '../../common'
import { PermissionService } from 'app/core/permission/permission.service'
import { AdminRoleService } from 'app/modules/admin/users/admin-role/common/services/admin-role.service'
import { pickTranslation } from 'app/shared/translatable/translatable'

@Component({
  selector: 'app-admin-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormActionButtonsComponent],
  templateUrl: './admin-user-form.component.html',
  styleUrls: ['./admin-user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserFormComponent extends BaseFormComponent<IAdminUser> {
  private crudService = inject(AdminUserService)
  private access = inject(PermissionService)
  private roleOptions = inject(AdminRoleService).selectOptions((role) =>
    pickTranslation(role.name, this.transloco.getActiveLang()),
  )
  readonly canManage = this.access.hasAny('admins.manage')
  readonly showDelete = this.canManage

  protected initFormFields(): void {
    this.fields = [
      {
        // Admins with only `admins.view` see the form read-only.
        props: { disabled: !this.canManage },
        fieldGroup: this.editableFields(),
      },
    ]
  }

  private editableFields(): FormlyFieldConfig[] {
    return [
      {
        key: 'full_name',
        type: 'input',
        props: { label: 'admin.adminUser.fields.full_name', translate: true, required: true },
      },
      {
        key: 'email',
        type: 'input',
        props: {
          label: 'admin.adminUser.fields.email',
          translate: true,
          required: true,
          type: 'email',
        },
      },
      {
        key: 'is_super_admin',
        type: 'checkbox',
        defaultValue: false,
        // Only a super admin can grant or see this switch as editable.
        hide: !this.access.isSuperAdmin(),
        props: { label: 'admin.adminUser.fields.is_super_admin', translate: true },
      },
      {
        key: 'role_id',
        type: 'select',
        props: {
          label: 'admin.adminUser.fields.role',
          translate: true,
          options: this.roleOptions,
          showClear: true,
        },
        expressions: {
          'props.required': (field) => !field.model?.is_super_admin,
          hide: (field) => !!field.model?.is_super_admin,
        },
      },
      {
        key: 'password',
        type: 'input',
        props: {
          label: this.isEditMode
            ? 'admin.adminUser.fields.newPassword'
            : 'admin.adminUser.fields.password',
          translate: true,
          type: 'password',
          required: !this.isEditMode,
          minLength: 8,
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

  protected getById(id: string, isArchiveView: boolean): Observable<IAdminUser> {
    return this.crudService.getById(id, isArchiveView)
  }

  protected create(data: Partial<IAdminUser> & { password?: string }): Observable<IAdminUser> {
    return this.crudService.create(data)
  }

  protected update(
    id: string,
    data: Partial<IAdminUser> & { password?: string },
  ): Observable<IAdminUser> {
    return this.crudService.update(id, data)
  }

  protected delete(id: string): Observable<IAdminUser> {
    return this.crudService.delete(id)
  }

  protected mapToModel(data: IAdminUser): Partial<IAdminUser> & { password?: string } {
    return {
      full_name: data.full_name,
      email: data.email,
      role_id: data.role_id,
      // The API accepts this flag only from a super admin.
      ...(this.access.isSuperAdmin() ? { is_super_admin: data.is_super_admin } : {}),
      is_active: data.is_active,
    } as Partial<IAdminUser> & { password?: string }
  }

  protected getDeleteTitle(): string {
    return 'admin.common.deleteTitle'
  }

  protected getDeleteMessage(): string {
    return String(this.model.email ?? '')
  }
}
