import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GridComponent, IColumn } from 'app/shared/components/grid'
import { ITableFilterConfig, TableFilterComponent } from 'app/shared/components/table-filter'
import { BaseTableComponent } from 'app/shared/abstracts'
import { ButtonModule } from 'primeng/button'
import { DialogService } from 'primeng/dynamicdialog'
import { AdminUserGridService, IAdminUser } from '../../common'
import { ROLE_OPTIONS } from 'app/core/user/roles'
import { AdminUserFormComponent } from '../admin-user-form/admin-user-form.component'

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule, GridComponent, TableFilterComponent, ButtonModule],
  providers: [AdminUserGridService, DialogService],
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserListComponent extends BaseTableComponent<IAdminUser> {
  gridService = inject(AdminUserGridService)
  formComponent = AdminUserFormComponent
  showAddButton = true

  filterConfig: ITableFilterConfig = {
    columns: 3,
    showResetButton: true,
    fields: [
      { key: 'full_name', type: 'input', label: 'admin.adminUser.fields.full_name' },
      { key: 'email', type: 'input', label: 'admin.adminUser.fields.email' },
      {
        key: 'role',
        type: 'select',
        label: 'admin.adminUser.fields.role',
        options: ROLE_OPTIONS,
        props: { translateSelectOptions: true },
      },
    ],
  }

  columns: IColumn[] = [
    { field: 'full_name', header: 'admin.adminUser.fields.full_name' },
    { field: 'email', header: 'admin.adminUser.fields.email' },
    { field: 'role', header: 'admin.adminUser.fields.role' },
    { field: 'is_active', header: 'admin.common.isActive', template: 'boolean' },
    { field: 'last_login_at', header: 'admin.adminUser.fields.last_login_at', template: 'date' },
  ]

  protected getItemId(item: IAdminUser): string | undefined {
    return item.id
  }

  protected getEditHeaderKey(): string {
    return 'admin.adminUser.edit'
  }

  protected getCreateHeaderKey(): string {
    return 'admin.adminUser.create'
  }
}
