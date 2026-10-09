import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { FormlyModule } from '@ngx-formly/core'
import { BaseFormComponent } from 'app/shared/abstracts'
import { FormActionButtonsComponent } from 'app/shared'
import { Observable } from 'rxjs'
import { IAdminUser, AdminUserService } from '../../common'
import { ROLE_OPTIONS } from 'app/core/user/roles'

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
  readonly showDelete = true

  protected initFormFields(): void {
    this.fields = [
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
        key: 'role',
        type: 'select',
        defaultValue: 'operator',
        props: {
          label: 'admin.adminUser.fields.role',
          translate: true,
          required: true,
          options: ROLE_OPTIONS,
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
      role: data.role,
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
